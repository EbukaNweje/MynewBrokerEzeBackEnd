const Admin = require("../models/Admin");
const bcrypt = require("bcrypt");
const createError = require("../utilities/error");
const jwt = require("jsonwebtoken")
const {validationResult } = require('express-validator');
const depositModel = require('../models/depositModel');
const userModel = require('../models/User');
const withdrawModel = require("../models/withdrawModel");

exports.register = async (req, res, next)=>{
    try{
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array()});
      }
      const { email } = req.body;

      User.findOne({ email }, async (err, user) => {
        // console.log(user)
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        if (user) { 
            return next(createError(400, "email already in use"))
        } 
        else if(!user){
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);
            
         const newUser = new Admin({ 
            password:hash,
            email: req.body.email,
         })
         const token = jwt.sign({id:newUser._id, isAdmin:newUser.isAdmin}, process.env.JWT, {expiresIn: "15m"})
         newUser.token = token

         await newUser.save()

         res.status(201).json({
            message: "User has been created.",
            data: newUser
        })
        }

      })
      
    }catch(err){
        next(err)
    }
}


exports.login = async (req, res, next)=>{
    try{
        const Users = await Admin.findOne({email: req.body.email})
        if(!Users) return next(createError(404, "User not found!"))

        const isPasswordCorrect = await bcrypt.compare(req.body.password, Users.password)
        if(!isPasswordCorrect) return next(createError(400, "Wrong password or username"))

        const token1 = jwt.sign({id:Users._id, isAdmin:Users.isAdmin}, process.env.JWT, {expiresIn: "1d"})
        Users.token = token1

        await Users.save()

        const {token, password, ...otherDetails} = Users._doc

        //  res.cookie("access_token", token, {
        //     httpOnly: true, 
        //  })

         res.status(200).json({...otherDetails})
    }catch(err){
        next(err)
    }
}



// Controller function to confirm deposits
exports.confirmDeposit = async (req, res) => {
    try {
        // Extract deposit ID from request parameters
        const { depositId } = req.params;

        // Find the deposit in the database
        const deposit = await depositModel.findById(depositId);
        if (!deposit) {
            return res.status(404).json({ message: 'Deposit not found' });
        }

        // Check if the deposit is already confirmed
        if (deposit.status === 'confirmed') {
            return res.status(400).json({ message: 'Deposit is already confirmed' });
        }

        // Find the user associated with the deposit
        const user = await userModel.findById(deposit.user);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update the deposit status to 'confirmed'
        deposit.status = 'confirmed';
        await deposit.save();

        // // Update the user's account balance
        user.accountBalance += parseFloat(deposit.amount);
        await user.save();
        user.totalDeposit += parseFloat(deposit.amount);
        await user.save();

        // Return success response
        res.status(200).json({ message: 'Deposit confirmed successfully' });
    } catch (err) {
        // Handle errors
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};





// Controller function to confirm deposits
exports.confirmWithdraw = async (req, res) => {
    try {
        // Extract withdraw ID from request parameters
        const { withdrawId } = req.params;

        // Find the withdraw in the database
        const withdraw = await withdrawModel.findById(withdrawId);
        if (!withdraw) {
            return res.status(404).json({ message: 'withdrawal not found' });
        }

        // Check if the withdraw is already confirmed
        if (withdraw.status === 'confirmed') {
            return res.status(400).json({ message: 'withdrawal is already confirmed' });
        }

        // Find the user associated with the withdraw
        const user = await userModel.findById(withdraw.user);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update the withdraw status to 'confirmed'
        withdraw.status = 'confirmed';
        await withdraw.save();

        // // Update the user's account balance
        user.accountBalance += parseFloat(withdraw.amount);
        await user.save();
        user.totalWithdrawal += parseFloat(withdraw.amount);
        await user.save();

        // Return success response
        res.status(200).json({ message: 'withdrawal confirmed successfully' });
    } catch (err) {
        // Handle errors
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.trunOnUserNotification = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.notification = !user.notification;
        await user.save();
        res.status(200).json({ message: user.notification ? "User notification truned on" : "User notification truned off" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};


