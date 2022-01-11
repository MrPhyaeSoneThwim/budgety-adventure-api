const express = require("express");
const protect = require("../middlewares/protect");
const user = require("../controllers/user.controller.js");

const { uploadAvatar } = require("../middlewares/upload");
const { resizeAvatar } = require("../middlewares/resize");

const router = express.Router();

router.post("/login", user.login);
router.post("/signup", user.signup);
router.post("/verify-otp", user.verifyOTP);
router.post("/resend-otp/:userId", user.resendOTP);

router.use(protect);
router.get("/get-me", user.getMe);
router.put("/update-me", uploadAvatar, resizeAvatar, user.updateMe);
router.put("/update-password", user.updatePassword);

module.exports = router;
