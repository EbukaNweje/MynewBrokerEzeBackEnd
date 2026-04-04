const msgModel = require("../models/msgModel");
const historyModel = require("../models/historyModel");
const userModel = require("../models/User");
const withdrawModel = require("../models/withdrawModel");
// const currencyapi = require('@everapi/currencyapi-js');
require("dotenv").config();
// const axios = require('axios');

const VALID_COINS = ["BTC", "ETH", "XRP", "TRX"];
const VALID_METHODS = ["CRYPTO WALLET", "CASH APP", "PAYPAL", "BANK TRANSFER"];

// withdraw function
exports.withdraw = async (req, res) => {
  try {
    // Get the withdrawer's id
    const { id } = req.params;

    // Find the withdrawer
    const withdrawer = await userModel.findById(id);
    if (!withdrawer) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get the details for transaction
    const {
      amount,
      coin,
      walletAddress,
      method,
      cashAppTag,
      paypalEmail,
      bankDetails,
    } = req.body;
    const newAmount = Number(amount);

    // Check if the amount is within the allowed range
    if (isNaN(newAmount) || newAmount <= 0 || newAmount > 9999999) {
      return res.status(400).json({
        message: "You can only withdraw between 0 and 9,999,999",
      });
    }

    // Determine withdrawal method and address
    let withdrawalMethod = method || "CRYPTO WALLET";
    let withdrawalAddress;

    if (withdrawalMethod === "CRYPTO WALLET") {
      if (!VALID_COINS.includes(coin)) {
        return res.status(400).json({
          message: `Coin not available. Choose from: ${VALID_COINS.join(", ")}`,
        });
      }
      if (!walletAddress) {
        return res.status(400).json({ message: "Wallet address is required" });
      }
      withdrawalAddress = walletAddress;
    } else if (withdrawalMethod === "CASH APP") {
      if (!cashAppTag)
        return res.status(400).json({ message: "Cash App tag is required" });
      withdrawalAddress = cashAppTag;
    } else if (withdrawalMethod === "PAYPAL") {
      if (!paypalEmail)
        return res.status(400).json({ message: "PayPal email is required" });
      withdrawalAddress = paypalEmail;
    } else if (withdrawalMethod === "BANK TRANSFER") {
      if (!bankDetails)
        return res.status(400).json({ message: "Bank details are required" });
      withdrawalAddress = bankDetails;
    } else {
      return res.status(400).json({
        message: `Invalid method. Choose from: ${VALID_METHODS.join(", ")}`,
      });
    }

    // Save the withdraw details
    const withdraw = new withdrawModel({
      user: withdrawer._id,
      amount: newAmount,
      coin: withdrawalMethod === "CRYPTO WALLET" ? coin : withdrawalMethod,
      walletAddress: withdrawalAddress,
      status: "pending",
    });
    await withdraw.save();

    // Save the withdrawal id to the user
    withdrawer.Transactions.withdrawals.push(withdraw._id);
    await withdrawer.save();

    // Create a transaction history
    const History = new historyModel({
      userId: withdrawer._id,
      transactionType: "Withdraw",
      amount: newAmount,
    });
    await History.save();

    // Create a notification message
    const msg = `Hi ${withdrawer.fullName}, you just requested a withdrawal of $${newAmount} via ${withdrawalMethod}`;
    const message = new msgModel({
      userId: withdrawer._id,
      msg,
    });
    await message.save();

    return res.status(200).json({
      message: "Withdrawal request submitted and pending",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

exports.getAllWithdrawal = async (req, res) => {
  try {
    // Find all withdraw records and populate the user field to get user information
    const withdrawal = await withdrawModel.find().populate("user");

    if (!withdrawal || withdrawal.length === 0) {
      return res.status(404).json({
        message: "No withdraw records found",
      });
    }

    // Return the retrieved withdraw records with user information
    res.status(200).json({ data: withdrawal });
  } catch (error) {
    // Handle errors
    console.error("Error fetching withdrawal:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
