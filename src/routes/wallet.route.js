const express = require("express");
const router = express.Router();
const protect = require("../middlewares/protect");
const transactionRoutes = require("./transaction.route.js");
const wallet = require("../controllers/wallet.controller.js");

router.use(protect);

// get a list of transactions for specific wallet using wallet id
router.use("/:walletId/transactions", transactionRoutes);

router.route("/").get(wallet.getWallets).post(wallet.addWallet);
router.get("/get-stats/:walletId/type/:type", wallet.getWalletStats);
router.route("/:id").get(wallet.getWallet).put(wallet.updateWallet).delete(wallet.deleteWallet);

module.exports = router;
