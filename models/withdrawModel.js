const mongoose = require("mongoose")
const {DateTime} = require('luxon')

const createdOn = DateTime.now().toLocaleString({weekday:"short",month:"short",day:"2-digit", year:"numeric", hour:"2-digit",minute:"2-digit"})


const withdrawSchema = new mongoose.Schema({
    transactionType:{
        type:String,
        default:"Withdraw"
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    amount:{
        type:Number,
        required: true
    },
    walletAddress:{
        type:String,
        required:true,
    },
    coin:{
        type:String,
        enum: ["BTC", "ETH"]
    },
    status:{
        type:String,
        enum: ['pending', 'confirmed'],
        default: 'pending'
    },
    withdrawDate:{
        type:String,
        default:createdOn
    }
})

const withdrawModel = mongoose.model("withdraw",withdrawSchema)

module.exports = withdrawModel