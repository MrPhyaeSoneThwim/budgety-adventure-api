const crypto = require("crypto");
const User = require("../models/user");
const unLink = require("../utils/unLink");
const Wallet = require("../models/wallet");
const Category = require("../models/category");
const catchAsync = require("express-async-handler");
const EmailService = require("../utils/emailService");
const categories = require("../data/categories");

const createSendOTP = async (user, res) => {
  const { otpCode, expiresIn, token } = user.createOTPtoken();
  await user.save({ validateBeforeSave: false });

  try {
    await new EmailService(user).sendOTP(
      "We've sent you an OTP code to verify your email address.",
      otpCode
    );

    // hide password and otp from response
    user.password = undefined;
    user.verifyOtpToken = undefined;
    user.verifyOtpExpires = undefined;

    return res.status(200).json({
      status: "success",
      message: "OTP has been sent to your email address.",
      data: {
        user,
        token,
        expiresIn,
      },
    });
  } catch (error) {
    user.verifyOtpToken = undefined;
    user.verifyOtpExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return res.status(500).json({
      status: "fail",
      message: "There was an error sending the email. Try again later",
    });
  }
};

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    return res.status(400).send({
      status: "fail",
      message: "Please provide email and password!",
    });
  }
  // 2) Check if user exists && password is correct
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return res.status(404).send({
      status: "fail",
      message: "No users information. Create an account to manage your daily transactions.",
    });
  }

  if (user.active) {
    if (!(await user.comparePassword(password, user.password))) {
      return res.status(401).send({
        status: "fail",
        message: "Incorrect email or password.",
      });
    }

    // hide password from response
    user.password = undefined;

    // generate token for authenticated user
    const token = user.signToken(user._id);

    return res.status(200).send({
      token,
      status: "success",
      data: {
        user,
      },
    });
  }
  return await createSendOTP(user, res);
});

exports.signup = catchAsync(async (req, res, next) => {
  const { email, password, passwordConfirm } = req.body;
  if (!email || !password || !passwordConfirm) {
    return res.status(400).json({
      status: "fail",
      message: "Please provide email address, password and confirm password.",
    });
  }

  const exists = await User.findOne({ email }).select("+password");

  if (exists) {
    if (!exists.active) {
      return await createSendOTP(exists, res);
    } else {
      return res.status(409).json({
        status: "fail",
        message: "Account already exists with the same email address.",
      });
    }
  }

  if (password !== passwordConfirm) {
    return res.status(400).json({
      status: "fail",
      message: "Passwords are not the same.",
    });
  }

  const user = await User.create({ email, password, passwordConfirm });
  return await createSendOTP(user, res);
});

exports.resendOTP = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.userId);
  return await createSendOTP(user, res);
});

exports.verifyOTP = catchAsync(async (req, res, next) => {
  const { otpCode, email } = req.body;
  if (!otpCode || !email) {
    return res.status(400).json({
      status: "fail",
      message: "Please provide OTP code and email address.",
    });
  }

  const hashedToken = crypto.createHash("sha256").update(req.body.otpCode).digest("hex");

  const user = await User.findOne({
    email,
    verifyOtpToken: hashedToken,
    verifyOtpExpires: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({
      status: "success",
      message: "OTP is invalid or has expired.",
    });
  }
  user.active = true;
  user.verifyOtpToken = undefined;
  user.verifyOtpExpires = undefined;
  await user.save({ validateBeforeSave: false });

  await Wallet.create({
    user: user._id,
    name: "Wallet",
    icon: "wallet-one",
    iconColor: "#ef4444",
    balance: 0,
  });

  categories.map(async (category) => {
    await Category.create({
      user: user._id,
      ...category,
    });
  });

  user.password = undefined;
  const token = user.signToken(user._id);
  res.status(200).json({
    token,
    status: "success",
    message: "Your account has been verified successfully.",
    data: {
      user,
    },
  });
});

exports.getMe = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    return res.status(404).json({
      status: "fail",
      message: "No users information.",
    });
  }
  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    return res.status(404).json({
      status: "fail",
      message: "No users information.",
    });
  }

  // check and remove existing one if user update avatar
  if (req.file && user.avatar && req.file.fieldname === "avatar") {
    unLink(`public/avatars/${user.avatar}`);
  }

  // replace name and avatar
  user.bio = req.body.bio;
  user.name = req.body.name;
  user.avatar = req.body.avatar;

  // save replaced properties as user document
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    status: "success",
    message: "Your profile has beed successfully updated.",
    data: {
      user,
    },
  });
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, password, passwordConfirm } = req.body;
  if (!currentPassword || !password || !passwordConfirm) {
    return res.status(400).json({
      status: "fail",
      message: "Current password, new password and confirm password are required.",
    });
  }

  if (currentPassword === password) {
    return res.status(400).json({
      status: "fail",
      message: "Current password and new password must be different.",
    });
  }

  const user = await User.findById(req.user._id).select("+password");

  // 2) Check if POSTed current password is correct
  if (!(await user.comparePassword(currentPassword, user.password))) {
    return res.status(400).json({
      status: "fail",
      message: "Requested password doesn't match with original one.",
    });
  }

  // 3) If so, update password
  user.password = password;
  user.passwordConfirm = passwordConfirm;
  await user.save();

  res.status(200).json({
    status: "success",
    message: "Password has been updated successfully.",
  });
});
