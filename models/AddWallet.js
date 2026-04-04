const mongoose  = require("mongoose")

const AddWallet =  new mongoose.Schema({
    walletName: {
        type: String,
        required: true,
        unique: true
    },

    walletAddress: {
        type: String,
        required: true
    },

    coin: {
        type: String,
        required: true,
        unique: true
    }
}, {timestamps: true});
module.exports = myWallet = mongoose.model('myWallet', AddWallet)
