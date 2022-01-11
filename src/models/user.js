const crypto = require("crypto");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const validator = require("validator");
const otpGenerator = require("otp-generator");
const userSchema = new mongoose.Schema({
  name: String,
  bio: String,
  email: {
    type: String,
    required: [true, "User must have an email address"],
    validate: [validator.isEmail, "Please provide a valid email address"],
  },
  avatar: String,
  password: {
    type: String,
    select: false,
    required: [true, "Password is required"],
  },
  passwordConfirm: {
    type: String,
    required: [true, "Password confirm is required"],
    validate: {
      validator: function (value) {
        return this.password === value;
      },
      message: "Passwords are not the same",
    },
  },
  verifyOtpToken: String,
  verifyOtpExpires: Date,
  active: {
    type: Boolean,
    default: false,
  },
});

userSchema.methods.comparePassword = async function (password, hash) {
  return await bcrypt.compare(password, hash);
};

userSchema.methods.signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

userSchema.methods.createOTPtoken = function () {
  const otpCode = otpGenerator.generate(5, {
    digits: true,
    specialChars: false,
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
  });

  const token = crypto.createHash("sha256").update(otpCode).digest("hex");

  this.verifyOtpToken = token;
  const expiresIn = Date.now() + 10 * 60 * 1000;
  this.verifyOtpExpires = expiresIn;

  return { otpCode, expiresIn, token };
};

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete confirm password from properties
  this.passwordConfirm = undefined;
  next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;
