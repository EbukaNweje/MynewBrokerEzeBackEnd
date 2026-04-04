const InvestmentPlan = require('../models/plansModel');

// Create a new investment plan
exports.createPlan = async (req, res) => {
    try {
        const { planName, minimumDeposit, maximumDeposit, percentageInterest, durationDays, rio } = req.body;
        const newPlan = new InvestmentPlan({
            planName,
            minimumDeposit,
            maximumDeposit,
            percentageInterest,
            durationDays,
            rio
        });
        const plan = await newPlan.save();
        res.status(201).json({ message: 'Plan created successfully', data: plan });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all investment plans
exports.getAllPlans = async (req, res) => {
    try {
        const plans = await InvestmentPlan.find();
        res.status(200).json({ data: plans });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a single investment plan by ID
exports.getPlanById = async (req, res) => {
    try {
        const plan = await InvestmentPlan.findById(req.params.id);
        if (!plan) {
            return res.status(404).json({ message: 'Plan not found' });
        }
        res.status(200).json({ data: plan });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update an investment plan
exports.updatePlan = async (req, res) => {
    try {
        const { planName, minimumDeposit, maximumDeposit, percentageInterest, durationDays } = req.body;
        const updatedPlan = {
            planName,
            minimumDeposit,
            maximumDeposit,
            percentageInterest,
            durationDays
        };
        const plan = await InvestmentPlan.findByIdAndUpdate(req.params.id, updatedPlan, { new: true });
        if (!plan) {
            return res.status(404).json({ message: 'Plan not found' });
        }
        res.status(200).json({ message: 'Plan updated successfully', data: plan });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete an investment plan
exports.deletePlan = async (req, res) => {
    try {
        const plan = await InvestmentPlan.findByIdAndDelete(req.params.id);
        if (!plan) {
            return res.status(404).json({ message: 'Plan not found' });
        }
        res.status(200).json({ message: 'Plan deleted successfully', data: plan });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
