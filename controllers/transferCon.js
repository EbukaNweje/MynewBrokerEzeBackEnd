const userModel = require("../models/User");
const transferModel = require("../models/transferModel");
const historyModel = require("../models/historyModel");
const msgModel = require("../models/msgModel");
const { sendEmail } = require("../utilities/brevo");
const {
  transferSentEmail,
  transferReceivedEmail,
} = require("../middleware/emailTemplate");

const TRANSFER_CHARGE_PERCENT = 20; // 20% charge as shown in UI
const MIN_TRANSFER = 1;

exports.transferFunds = async (req, res) => {
  try {
    const { id } = req.params; // sender's id
    const { recipientIdentifier, amount } = req.body;

    if (!recipientIdentifier || !amount) {
      return res
        .status(400)
        .json({ message: "Recipient and amount are required" });
    }

    const transferAmount = Number(amount);
    if (isNaN(transferAmount) || transferAmount < MIN_TRANSFER) {
      return res
        .status(400)
        .json({ message: `Minimum transfer amount is $${MIN_TRANSFER}` });
    }

    // Find sender
    const sender = await userModel.findById(id);
    if (!sender) {
      return res.status(404).json({ message: "Sender not found" });
    }

    if (sender.status === "blocked") {
      return res
        .status(403)
        .json({ message: "Your account has been suspended" });
    }

    // Find recipient by email or username
    const recipient = await userModel.findOne({
      $or: [
        { email: recipientIdentifier.toLowerCase().trim() },
        { fullName: recipientIdentifier.trim() },
      ],
    });

    if (!recipient) {
      return res
        .status(404)
        .json({ message: "Recipient not found. Check the email or fullName." });
    }

    if (recipient._id.toString() === sender._id.toString()) {
      return res
        .status(400)
        .json({ message: "You cannot transfer funds to yourself" });
    }

    if (recipient.status === "blocked") {
      return res
        .status(400)
        .json({ message: "Recipient account is not available" });
    }

    // Calculate charge and total deduction
    const charge = parseFloat(
      ((TRANSFER_CHARGE_PERCENT / 100) * transferAmount).toFixed(2),
    );
    const totalDeducted = parseFloat((transferAmount + charge).toFixed(2));

    // Check sender balance
    if (sender.accountBalance < totalDeducted) {
      return res.status(400).json({
        message: `Insufficient balance. You need $${totalDeducted} but have $${sender.accountBalance}`,
      });
    }

    // Deduct from sender, credit recipient
    sender.accountBalance = parseFloat(
      (sender.accountBalance - totalDeducted).toFixed(2),
    );
    recipient.accountBalance = parseFloat(
      (recipient.accountBalance + transferAmount).toFixed(2),
    );

    await sender.save();
    await recipient.save();

    // Save transfer record
    const transfer = new transferModel({
      sender: sender._id,
      recipient: recipient._id,
      amount: transferAmount,
      charge,
      totalDeducted,
      status: "completed",
    });
    await transfer.save();

    // History for sender
    const senderHistory = new historyModel({
      userId: sender._id,
      transactionType: "Transfer Sent",
      amount: String(totalDeducted),
      from: sender.email,
      to: recipient.email,
      desc: `Transferred $${transferAmount} to ${recipient.fullName || recipient.email}`,
    });
    await senderHistory.save();

    // History for recipient
    const recipientHistory = new historyModel({
      userId: recipient._id,
      transactionType: "Transfer Received",
      amount: String(transferAmount),
      from: sender.email,
      to: recipient.email,
      desc: `Received $${transferAmount} from ${sender.fullName || sender.email}`,
    });
    await recipientHistory.save();

    // In-app notifications
    await new msgModel({
      userId: sender._id,
      msg: `You successfully transferred $${transferAmount} to ${recipient.fullName || recipient.email}.`,
    }).save();

    await new msgModel({
      userId: recipient._id,
      msg: `You received $${transferAmount} from ${sender.fullName || sender.email}.`,
    }).save();

    // Email notifications (non-blocking)
    try {
      await sendEmail({
        email: sender.email,
        subject: "Transfer Sent Successfully",
        html: transferSentEmail(sender, {
          amount: transferAmount,
          charge,
          totalDeducted,
          recipientName: recipient.fullName || recipient.email,
        }),
      });

      await sendEmail({
        email: recipient.email,
        subject: "You Have Received a Transfer",
        html: transferReceivedEmail(recipient, {
          amount: transferAmount,
          senderName: sender.fullName || sender.email,
        }),
      });
    } catch (emailErr) {
      console.error("Transfer email error:", emailErr.message);
    }

    return res.status(200).json({
      message: "Transfer successful",
      data: {
        transferId: transfer._id,
        amount: transferAmount,
        charge,
        totalDeducted,
        recipientName: recipient.fullName || recipient.email,
        newBalance: sender.accountBalance,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getTransferHistory = async (req, res) => {
  try {
    const { id } = req.params;

    const transfers = await transferModel
      .find({ $or: [{ sender: id }, { recipient: id }] })
      .populate("sender", "fullName email")
      .populate("recipient", "fullName email")
      .sort({ _id: -1 });

    return res.status(200).json({ data: transfers });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
