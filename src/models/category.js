const mongoose = require("mongoose");
const Transaction = require("./transaction");
const categorySchema = new mongoose.Schema({
  user: {
    ref: "User",
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "User belongs to the category is required"],
  },
  name: {
    type: String,
    required: [true, "Category must have a name"],
  },
  type: {
    type: String,
    required: [true, "Category type is required"],
    enum: {
      values: ["income", "expense"],
      message: "Category type must be either income or expense",
    },
  },
  icon: {
    type: String,
    required: [true, "Icon is required for the category"],
  },
  iconColor: {
    type: String,
    required: [true, "Color is required for the category icon"],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

categorySchema.pre("remove", async function (next) {
  const transactions = await Transaction.find({ category: this._id });
  if (transactions.length > 0) {
    await Transaction.deleteMany({ category: this._id });
  }
  next();
});

const Category = mongoose.model("Category", categorySchema);
module.exports = Category;
