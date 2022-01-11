const express = require("express");
const protect = require("../middlewares/protect");
const transaction = require("../controllers/transaction.controller.js");

const router = express.Router({ mergeParams: true });

router.use(protect);
router.get("/annual-stats/year/:year", transaction.getAnnualStats);
router.get("/monthly-stats/year/:year/month/:month", transaction.getMonthlyStats);
router.route("/").post(transaction.addTransaction).get(transaction.getTransactions);
router
  .route("/:id")
  .get(transaction.getTransaction)
  .put(transaction.updateTransaction)
  .delete(transaction.deleteTransaction);

module.exports = router;
