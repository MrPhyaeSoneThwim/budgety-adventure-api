const moment = require("moment");
const mongoose = require("mongoose");
const transactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    required: [true, "User belongs to transactions is required"],
    ref: "User",
  },
  wallet: {
    type: mongoose.Schema.ObjectId,
    required: [true, "Wallet belongs to transactions is required"],
    ref: "Wallet",
  },
  category: {
    type: mongoose.Schema.ObjectId,
    required: [true, "Catgory must be specified"],
    ref: "Category",
  },
  amount: {
    type: Number,
    required: [true, "Transaction amount is required"],
  },
  status: {
    type: String,
    required: [true, "Transaction status is required"],
    enum: {
      values: ["income", "expense"],
      message: "Transaction status must be either income or expense",
    },
  },
  createdAt: {
    type: Date,
    default: moment(new Date()).format("YYYY-MM-DD"),
  },
});

transactionSchema.pre(/^find/, function (next) {
  this.populate({ path: "category", select: "-__v -user" }).populate({
    path: "wallet",
    select: "-_v -user",
  });
  next();
});

transactionSchema.pre("save", function (next) {
  this.createdAt = moment(this.createdAt).format("YYYY-MM-DD");
  next();
});

const Transaction = mongoose.model("Transaction", transactionSchema);
module.exports = Transaction;
