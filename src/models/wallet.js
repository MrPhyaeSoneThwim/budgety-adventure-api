const mongoose = require("mongoose");
const Transaction = require("./transaction");
const walletSchema = new mongoose.Schema({
  user: {
    ref: "User",
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "User belongs to the wallet is required"],
  },
  name: {
    type: String,
    required: [true, "Wallet must have a name"],
  },
  icon: {
    type: String,
    required: [true, "Please provide an icon for the wallet"],
  },
  iconColor: {
    type: String,
    required: [true, "Please select a color for the wallet icon"],
  },
  balance: {
    type: Number,
    required: [true, "Please provide the balance amount"],
  },
});

walletSchema.pre("remove", async function (next) {
  const transactions = await Transaction.find({ wallet: this._id });
  if (transactions.length > 0) {
    await Transaction.deleteMany({ wallet: this._id });
  }
  next();
});

const Wallet = mongoose.model("Wallet", walletSchema);
module.exports = Wallet;
