const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const createdOn = DateTime.now().toLocaleString({
  weekday: "short",
  month: "short",
  day: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

const transferSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  charge: {
    type: Number,
    default: 0,
  },
  totalDeducted: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["completed", "failed"],
    default: "completed",
  },
  date: {
    type: String,
    default: createdOn,
  },
});

const transferModel = mongoose.model("transfer", transferSchema);

module.exports = transferModel;
