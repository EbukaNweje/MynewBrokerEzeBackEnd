const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true, // Unique email for each user
  },

  password: {
    type: String,
    required: true,
  },

  token: {
    type: String,
    required: true,
  },

  verify: {
    type: Boolean,
    default: true,
  },

  isAdmin: {
    // Role of user it will be (normal or admin )
    type: Boolean,
    default: true,
  },
  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
}

}, {timestamps: true});

module.exports = Admin = mongoose.model('Admin', AdminSchema )

