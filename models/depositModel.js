const mongoose = require("mongoose")
const {DateTime} = require('luxon')

const createdOn = DateTime.now().toLocaleString({weekday:"short",month:"short",day:"2-digit", year:"numeric", hour:"2-digit",minute:"2-digit"})


const depositSchema = new mongoose.Schema({
    transactionType:{
        type:String,
        default:"Deposit"
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    amount:{
        type:Number,
        required: true
    },
    coin:{
        type:String,
        enum: ["BTC", "ETH"]
    },
    total:{
        type:Number
    },
    status:{
        type:String,
        enum: ['pending', 'confirmed'],
        default: 'pending'
    },
    depositDate:{
        type:String,
        default:createdOn
    }
})

const depositModel = mongoose.model("deposit",depositSchema)

module.exports = depositModel