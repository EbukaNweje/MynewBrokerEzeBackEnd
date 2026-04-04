const cron = require("node-cron");
const Subscription = require("../models/Subscription");
const User = require("../models/User");
const DailyInterest = require("../models/DailyInterest");
const AuditLog = require("../models/AuditLog");
const { sendEmail } = require("../utilities/brevo");
const { contributionCycleStartsEmail } = require("../middleware/emailTemplate");

// helpers
function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function isDateDue(targetDate, currentDate) {
  // Check if current date is on or after target date (same day or later)
  const target = new Date(targetDate);
  const current = new Date(currentDate);

  // Reset time to start of day for accurate comparison
  target.setHours(0, 0, 0, 0);
  current.setHours(0, 0, 0, 0);

  return current >= target;
}

// Run every day at 08:00 server time
cron.schedule("8 8 * * *", async () => {
  console.log("\n=== DAILY INTEREST CRON START ===");
  console.log("Server Time:", new Date().toLocaleString());
  console.log("UTC Time:", new Date().toISOString());
  console.log("Timezone:", Intl.DateTimeFormat().resolvedOptions().timeZone);

  try {
    const activeSubscriptions = await Subscription.find({ status: "active" });
    console.log(`Found ${activeSubscriptions.length} active subscriptions`);

    if (activeSubscriptions.length === 0) {
      console.log("No active subscriptions to process");
      return;
    }

    let processedCount = 0;
    let errorCount = 0;

    for (const subscription of activeSubscriptions) {
      try {
        const user = await User.findById(subscription.user);
        if (!user) {
          console.log(`❌ User not found for subscription ${subscription._id}`);
          errorCount++;
          continue;
        }

        const now = new Date();
        console.log(`\n--- Processing ${user.email} (${subscription._id}) ---`);
        console.log(
          `Days paid: ${subscription.daysPaid}, Amount: ${subscription.amount}`,
        );

        // Expire subscription if endDate passed
        if (now >= subscription.endDate) {
          subscription.status = "expired";
          await subscription.save();
          await AuditLog.create({
            type: "EXPIRE",
            user: user._id,
            subscription: subscription._id,
            message: "Subscription expired.",
          });
          console.log("✅ Expired subscription:", subscription._id);
          processedCount++;
          continue;
        }

        // If subscription is paused (user failed to recycle), do nothing except continue
        if (subscription.isPaused) {
          console.log(
            "⏸️  Paused (no interest):",
            subscription._id,
            user.email,
          );
          continue;
        }

        // Pay interest for days 1..6
        if (subscription.daysPaid < 6) {
          // For first payment, use startDate. For subsequent payments, use lastBonusAt + 1 day
          const lastBonus = subscription.lastBonusAt
            ? new Date(subscription.lastBonusAt)
            : new Date(subscription.startDate);

          const nextBonusDate = subscription.lastBonusAt
            ? addDays(lastBonus, 1)
            : new Date(subscription.startDate); // First payment can be on start date

          console.log(`Last bonus: ${lastBonus.toISOString()}`);
          console.log(`Next bonus due: ${nextBonusDate.toISOString()}`);
          console.log(`Current time: ${now.toISOString()}`);

          // Check if payment is due (current date >= next bonus date)
          if (isDateDue(nextBonusDate, now)) {
            const dailyBonus = subscription.amount * 0.2;

            // create interest record + update user
            const interest = new DailyInterest({
              user: user._id,
              subscription: subscription._id,
              amount: dailyBonus,
              date: now, // Store as Date object, not string
            });
            await interest.save();

            user.accountBalance = (user.accountBalance || 0) + dailyBonus;
            user.userTransactionTotal = user.userTransactionTotal || {};
            user.userTransactionTotal.dailyInterestHistoryTotal =
              (user.userTransactionTotal.dailyInterestHistoryTotal || 0) +
              dailyBonus;
            user.userTransaction = user.userTransaction || {};
            user.userTransaction.dailyInterestHistory =
              user.userTransaction.dailyInterestHistory || [];
            user.userTransaction.dailyInterestHistory.push(interest._id);
            await user.save();

            // update subscription
            subscription.daysPaid += 1;
            subscription.lastBonusAt = now;
            await subscription.save();

            await AuditLog.create({
              type: "INTEREST",
              user: user._id,
              subscription: subscription._id,
              message: `Paid daily interest ${dailyBonus}. daysPaid=${subscription.daysPaid}`,
            });

            console.log(
              `✅ Paid day ${subscription.daysPaid} interest to ${user.email}: ${dailyBonus}`,
            );
            processedCount++;

            // If daysPaid reached 6 after payment, mark mustRecycle so user must recycle to get day7
            if (subscription.daysPaid === 6) {
              subscription.mustRecycle = true;
              await subscription.save();

              // Send reminder email (user must recycle on day 6 to receive day 7)
              if (!subscription.isSubscriptionRecycle) {
                subscription.isSubscriptionRecycle = true;
                await subscription.save();

                try {
                  await sendEmail({
                    email: user.email,
                    subject:
                      "Action required: Recycle to receive final day interest",
                    html: contributionCycleStartsEmail(user, subscription),
                  });

                  await AuditLog.create({
                    type: "REMINDER",
                    user: user._id,
                    subscription: subscription._id,
                    message: "Sent recycle reminder (day6).",
                  });
                  console.log("📧 Reminder sent to:", user.email);
                } catch (emailError) {
                  console.log("❌ Email send failed:", emailError.message);
                }
              }
            }
          } else {
            console.log("⏳ Not due yet for payment");
          }
        } else {
          // daysPaid >= 6 -> either it was recycled (and cycle restarted) or day7 must be handled
          const lastBonus = subscription.lastBonusAt
            ? new Date(subscription.lastBonusAt)
            : new Date(subscription.startDate);
          const nextBonusDate = addDays(lastBonus, 1);

          if (isDateDue(nextBonusDate, now)) {
            // It's the Day 7. If user didn't recycle (mustRecycle true), pause and do not pay
            if (subscription.mustRecycle) {
              subscription.isPaused = true;
              await subscription.save();

              await AuditLog.create({
                type: "PAUSE",
                user: user._id,
                subscription: subscription._id,
                message: "Paused - user failed to recycle before day7.",
              });
              console.log(
                `⏸️  Paused subscription (missed recycle): ${subscription._id} for ${user.email}`,
              );
              processedCount++;
            } else {
              // Edge case: mustRecycle false but daysPaid >=6 (maybe recycled already). If not paused, allow payment
              const dailyBonus = subscription.amount * 0.2;
              const interest = new DailyInterest({
                user: user._id,
                subscription: subscription._id,
                amount: dailyBonus,
                date: now, // Store as Date object, not string
              });
              await interest.save();

              user.accountBalance = (user.accountBalance || 0) + dailyBonus;
              user.userTransactionTotal = user.userTransactionTotal || {};
              user.userTransactionTotal.dailyInterestHistoryTotal =
                (user.userTransactionTotal.dailyInterestHistoryTotal || 0) +
                dailyBonus;
              user.userTransaction = user.userTransaction || {};
              user.userTransaction.dailyInterestHistory =
                user.userTransaction.dailyInterestHistory || [];
              user.userTransaction.dailyInterestHistory.push(interest._id);
              await user.save();

              subscription.daysPaid += 1;
              subscription.lastBonusAt = now;
              await subscription.save();

              await AuditLog.create({
                type: "INTEREST",
                user: user._id,
                subscription: subscription._id,
                message: `Paid day ${subscription.daysPaid} interest ${dailyBonus} (post-recycle).`,
              });
              console.log(
                `✅ Paid final day interest to ${user.email}: ${dailyBonus}`,
              );
              processedCount++;
            }
          }
        }
      } catch (err) {
        console.log(
          `❌ Error processing subscription ${subscription._id}:`,
          err.message,
        );
        errorCount++;
      }
    }

    console.log(
      `\n📊 Summary: Processed ${processedCount} subscriptions, ${errorCount} errors`,
    );
  } catch (err) {
    console.log("❌ Cron job fatal error:", err.message);
  }

  console.log("=== DAILY INTEREST CRON END ===\n");
});
