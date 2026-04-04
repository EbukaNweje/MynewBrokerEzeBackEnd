const { validationResult } = require("express-validator");
const AddWallet = require("../models/AddWallet");

exports.CreateWallet = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { walletName, walletAddress, coin } = req.body;

    const newAddress = new AddWallet({
      walletAddress: walletAddress,
      walletName: walletName,
      coin: coin,
    });

    await newAddress.save();

    res.status(201).json({
      message: "Wallet Address Created successfully",
      data: newAddress,
    });
  } catch (err) {
    next(err);
  }
};

exports.getAllWalletAddress = async (req, res, next) => {
  try {
    const WalletAddress = await AddWallet.find();
    res.status(200).json({ data: WalletAddress });
  } catch (err) {
    next(err);
  }
};

exports.getOneWalletAddress = async (req, res) => {
  try {
    const wallet = await AddWallet.findById(req.params.id);
    if (!wallet) {
      return res.status(404).json({ message: "Wallet Address not found" });
    }
    res.status(200).json({ data: wallet });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateWalletAddress = async (req, res) => {
  try {
    const { walletAddress, walletName, coin } = req.body;
    const updatedwallet = {
      walletAddress,
      walletName,
      coin,
    };
    const newWallet = await AddWallet.findByIdAndUpdate(
      req.params.id,
      updatedwallet,
      { new: true }
    );
    if (!newWallet) {
      return res.status(404).json({ message: "Wallet Address not found" });
    }
    res.status(200).json({
      message: "Wallet Adddress updated successfully",
      data: newWallet,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteWalletAddress = async (req, res) => {
  try {
    const wallet = await AddWallet.findByIdAndDelete(req.params.id);
    if (!wallet) {
      return res.status(404).json({ message: "wallet Address not found" });
    }
    res
      .status(200)
      .json({ message: "wallet Adddress deleted successfully", data: wallet });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
