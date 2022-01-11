const userRoutes = require("./user.route.js");
const categoryRoutes = require("./category.route.js");
const walletRoutes = require("./wallet.route.js");
const transactionRoutes = require("./transaction.route.js");

module.exports = (app) => {
  app.use("/api/users", userRoutes);
  app.use("/api/wallets", walletRoutes);
  app.use("/api/transactions", transactionRoutes);
  app.use("/api/categories", categoryRoutes);

  app.all("*", (req, res, next) => {
    res.status(404).json({
      status: "fail",
      message: "No routes defined",
    });
  });
};
