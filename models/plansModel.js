const mongoose = require('mongoose');

const InvestmentPlanSchema = new mongoose.Schema({
    planName: {
        type: String,
        required: true,
        unique: true
    },
    minimumDeposit: {
        type: Number,
        required: true
    },
    maximumDeposit: {
        type: Number,
        required: true
    },
    percentageInterest: {
        type: Number,
        required: true
    },
    durationDays: {
        type: Number,
        required: true
    },

    rio: {
        type: Number,
    },
    
    investment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Invest'
    }
}, { timestamps: true });

const plansModel = mongoose.model('InvestmentPlan', InvestmentPlanSchema);

module.exports = plansModel
