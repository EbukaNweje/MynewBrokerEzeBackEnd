const mongoose = require('mongoose');
const {DateTime} = require('luxon')


const createdOn = DateTime.now().toLocaleString({weekday:"short",month:"short",day:"2-digit", year:"numeric", hour:"2-digit",minute:"2-digit"})

const InvestSchema = new mongoose.Schema({
    plan: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'InvestmentPlan',
    },
    transactionType:{
        type:String,
        default:"Invest"
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    amount: {
        type: Number,
        required: true
    },
    Date:{
        type:String,
        default:createdOn
    },
    endDate:{
        type:String
    },
}, { timestamps: true });

const investModel = mongoose.model('Invest', InvestSchema);

module.exports = investModel
