const msgModel = require("../models/msgModel");
const historyModel = require("../models/historyModel");
const userModel = require("../models/User");
const depositModel = require("../models/depositModel");
// const currencyapi = require('@everapi/currencyapi-js');
require("dotenv").config();
const axios = require("axios");
const User = require("../models/User");

// Deposit function
exports.deposit = async (req, res) => {
  try {
    // Get the depositor's id
    const { id } = req.params;

    // Find the depositor
    if (!id) {
      return res.status(400).json({ message: "Missing user id in params" });
    }

    const depositor = await userModel.findById(id);
    if (!depositor) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get the details for transaction
    const { amount, coin } = req.body;
    const newAmount = Number(amount);

    // Check if the amount is a valid number and within the allowed range
    if (!Number.isFinite(newAmount) || newAmount <= 0 || newAmount > 9999999) {
      return res.status(400).json({
        message:
          "You can only deposit a positive number between 10 and 9,999,999",
      });
    }

    if (!coin) {
      return res.status(400).json({
        message: "Payment method is required",
      });
    }

    const extractCoinSymbol = (value) => {
      if (!value || typeof value !== "string") return "";
      const upper = value.toUpperCase();
      const bracketMatch = upper.match(/\(([^)]+)\)/);
      if (bracketMatch && bracketMatch[1]) {
        return bracketMatch[1].trim();
      }
      return upper.trim();
    };

    const coinSymbol = extractCoinSymbol(coin);
    const cryptoCoinMap = {
      BTC: "bitcoin",
      ETH: "ethereum",
      USDT: "tether",
      BNB: "binancecoin",
      SOL: "solana",
      XRP: "ripple",
      TRX: "tron",
    };

    const matchedEntry = Object.entries(cryptoCoinMap).find(
      ([symbol, name]) =>
        coinSymbol === symbol ||
        coinSymbol.includes(symbol) ||
        coinSymbol.includes(name.toUpperCase()),
    );

    let cryptoAmount = newAmount;
    if (matchedEntry) {
      const coinId = matchedEntry[1];
      const getConversionPrice = async (coinId) => {
        const url = `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd&precision=5`;

        const maxRetries = 3;
        for (let attempt = 1; attempt <= maxRetries; attempt += 1) {
          try {
            const response = await axios.get(url);
            const rate = response.data[coinId]?.usd;
            if (!rate || !Number.isFinite(rate)) {
              throw new Error("Invalid conversion rate");
            }
            return Number(rate);
          } catch (err) {
            if (err.response && err.response.status === 429) {
              if (attempt === maxRetries) throw err;
              await new Promise((resolve) =>
                setTimeout(resolve, 300 * attempt),
              );
              continue;
            }
            throw err;
          }
        }
        throw new Error("Conversion API rate limit triggered");
      };

      const rate = await getConversionPrice(coinId);
      cryptoAmount = Number((newAmount / rate).toFixed(9));
    }

    // Save the deposit details
    const deposit = new depositModel({
      user: depositor._id,
      amount: newAmount,
      coin,
      total: cryptoAmount,
      status: "pending",
    });

    await deposit.save();

    // Save the deposit id to the user
    depositor.Transactions.deposits.push(deposit._id);

    // If a deposit is confirmed immediately, update balance
    if (deposit.status === "confirmed") {
      depositor.accountBalance += newAmount;
      depositor.totalDeposit = (depositor.totalDeposit || 0) + newAmount;
    }

    await depositor.save();

    // Create transaction history
    const historyEntry = new historyModel({
      id: depositor._id,
      transactionType: deposit.transactionType,
      amount: newAmount,
    });
    await historyEntry.save();

    // Create a notification message
    const messageText = `Hi ${depositor.fullName}, you just deposited ${newAmount} USD (~${cryptoAmount} ${coin})`;
    const message = new msgModel({
      id: depositor._id,
      msg: messageText,
    });
    await message.save();

    return res.status(201).json({
      message: "Deposit created and pending",
      deposit,
    });
  } catch (err) {
    if (err.response && err.response.status === 429) {
      return res.status(429).json({
        message:
          "External rate API limit exceeded; please retry in a few seconds",
      });
    }

    console.error("Deposit error:", err);
    return res.status(500).json({
      message: err.message || "Internal server error",
    });
  }
};

exports.getAllDeposits = async (req, res) => {
  try {
    // Find all deposit records and populate the user field to get user information
    const deposits = await depositModel.find().populate("user");

    if (!deposits || deposits.length === 0) {
      return res.status(404).json({
        message: "No deposit records found",
      });
    }

    // Return the retrieved deposit records with user information
    res.status(200).json({ data: deposits });
  } catch (error) {
    // Handle errors
    console.error("Error fetching deposits:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// // Controller function to fetch all deposits of every user
// exports.getAllDeposits = async (req, res) => {

// try {
//     // Find all users
//     const users = await userModel.find();

//     // Create an array to store user deposits
//     const userDeposits = [];

//     // Iterate over each user
//     for (const user of users) {
//       // Populate deposits for the current user
//       await user.populate('Transactions.deposits').execPopulate();

//       // Extract user's full name, email, and deposits
//       const { fullName, email, Transactions: { deposits } } = user;

//       // Push the user's full name, email, and deposits to the array
//       userDeposits.push({ fullName, email, deposits });
//     }
//     console.log(userDeposits)

//     // Send the array of user deposits as the response
//     res.status(200).json({userDeposits});
//   } catch (error) {
//     console.error('Error fetching deposits:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }

// }
