const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    confirmPassword: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
    },

    pin: {
      type: String,
      default: "",
    },

    inviteCode: {
      code: {
        type: String,
        required: true,
      },

      bonusAmount: {
        type: Number,
      },

      userInvited: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
    },

    referralCode: {
      type: String,
    },

    referralCount: {
      type: Number,
      default: 0,
    },

    WalletInfo: {
      WalletName: {
        type: String,
        default: "",
      },
      WalletAddress: {
        type: String,
        default: "",
      },
    },

    status: {
      type: String,
      enum: ["active", "blocked"],
      default: "active",
    },

    isSubscribed: {
      type: Boolean,
      default: false,
    },

    isLogin: {
      type: String,
      enum: ["active", "inactive"],
      default: "inactive",
    },

    userEmailVerify: {
      type: Boolean,
      default: false,
    },

    notification: {
      type: Boolean,
      default: false,
    },

    token: {
      type: String,
      required: true,
    },

    accountBalance: {
      type: Number,
      default: 0.0,
    },

    totalInvestment: {
      type: Number,
      default: 0.0,
    },

    totalProfit: {
      type: Number,
      default: 0.0,
    },

    bonus: {
      type: Number,
      default: 0.0,
    },

    tradingAccounts: {
      type: Number,
      default: 0.0,
    },

    ref: {
      type: String,
      default: 0.0,
    },

    totalDeposit: {
      type: Number,
      default: 0.0,
    },

    totalWithdrawal: {
      type: Number,
      default: 0.0,
    },

    withdrawCode: {
      type: String,
    },

    verify: {
      type: Boolean,
      default: false,
    },

    isAdmin: {
      type: Boolean,
      default: false,
    },
    investmentPlan: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "userplan",
      },
    ],
    Transactions: {
      deposits: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "deposit",
        },
      ],
      withdrawals: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "withdraw",
        },
      ],
      investments: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Invest",
        },
      ],
      interests: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Interest",
        },
      ],
    },
  },
  { timestamps: true },
);

module.exports = User = mongoose.model("User", UserSchema);
