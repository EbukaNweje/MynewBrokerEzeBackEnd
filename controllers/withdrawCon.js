const msgModel = require("../models/msgModel")
const historyModel = require("../models/historyModel")
const userModel = require("../models/User")
const withdrawModel = require("../models/withdrawModel")
// const currencyapi = require('@everapi/currencyapi-js');
require("dotenv").config()
// const axios = require('axios');

// withdraw function
exports.withdraw = async (req, res) => {
    try {
        // Get the withdrawer's id
        const { id } = req.params;

        // Find the withdrawer
        const withdrawer = await userModel.findById(id);

        // Get the details for transaction
        const { amount, coin, walletAddress } = req.body;
        const newAmount = Number(amount);

        // Check if the amount is within the allowed range
        if (newAmount <= 0 || newAmount > 9999999 || newAmount === NaN) {
            return res.status(400).json({
                message: 'You can only withdraw between 0 and 9,999,999'
            });
        }

        if (coin != "BTC" && coin != "ETH") {
            return res.status(404).json({
                message: `Coin not available`
            });
        }

        // Perform the currency conversion
        // let response;
        // let roundedNumber;

        // if (coin == "BTC") {
        //     response = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&precision=5`);
        //     const conversionRates = response.data.bitcoin.usd;
        //     const myTotal = Number(conversionRates);
        //     const btcAmount = newAmount / myTotal;
        //     roundedNumber = btcAmount.toFixed(9);
        // } else if (coin == "ETH") {
        //     response = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd&precision=5`);
        //     const conversionRates = response.data.ethereum.usd;
        //     const myTotal = Number(conversionRates);
        //     const btcAmount = newAmount / myTotal;
        //     roundedNumber = btcAmount.toFixed(9);
        // }

        const Depo = await withdrawModel.find()

        // Save the withdraw details
        const withdraw = new withdrawModel({
            user: withdrawer._id,
            amount: `${newAmount}`,
            coin: coin,
            walletAddress,
            // total: roundedNumber,
            status: 'pending',
            transactionType: Depo.transactionType,
        });
        await withdraw.save();

        withdraw.user = id
        // Save the transfer id to the user
        withdrawer.Transactions.withdrawals.push(withdraw._id);
        await withdrawer.save();

        if(withdraw.status === 'pending'){
            return res.status(200).json({
                message: `withdraw made and pending`
            })
        }
        if(withdraw.status === 'confirmed'){
        // Add the withdrew amount to the user's account balance
        withdrawer.accountBalance += newAmount;
        }



        // Create a transaction history for the withdrawer and save
        const History = new historyModel({
            id: withdrawer._id,
            transactionType: withdraw.transactionType,
            amount: `${newAmount}`,
        });
        await History.save();

        // Create a notification message for the withdrawer and save
        if (withdraw) {
            const msg = `Hi ${withdrawer.fullName}, you just withdrew ${newAmount} to your balance in ${coin}`;
            const message = new msgModel({
                id: withdrawer._id,
                msg
            });
            await message.save();
        }

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};


exports.getAllWithdrawal = async (req, res) => {
    try {
        // Find all withdraw records and populate the user field to get user information
        const withdrawal = await withdrawModel.find().populate('user');

        if (!withdrawal || withdrawal.length === 0) {
            return res.status(404).json({
                message: 'No withdraw records found'
            });
        }

        // Return the retrieved withdraw records with user information
        res.status(200).json({ data: withdrawal });
    } catch (error) {
        // Handle errors
        console.error('Error fetching withdrawal:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
