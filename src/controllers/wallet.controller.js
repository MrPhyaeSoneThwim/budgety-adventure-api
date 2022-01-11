const _ = require("lodash");
const Wallet = require("../models/wallet");
const Transaction = require("../models/transaction");
const catchAsync = require("express-async-handler");
const { walletFields } = require("../utils/fields");

exports.addWallet = catchAsync(async (req, res, next) => {
  const wallet = await Wallet.create(
    _.assign({ user: req.user._id }, _.pick(req.body, walletFields))
  );

  res.status(201).json({
    status: "success",
    message: "Wallet has been created successfully.",
    data: {
      wallet,
    },
  });
});

exports.getWalletStats = catchAsync(async (req, res, next) => {
  const type = req.params.type;
  const wallet = await Wallet.findById(req.params.walletId);

  const typeArr = ["stats", "detail"];

  if (!_.includes(typeArr, type)) {
    return res.status(400).json({
      status: "fail",
      message: "Type must be either stats | detail.",
    });
  }

  if (!wallet) {
    return res.status(404).json({
      status: "fail",
      message: "No wallet found.",
    });
  }
  const transactions = await Transaction.find({
    wallet: req.params.walletId,
  });
  const statistics = await Transaction.aggregate([
    { $match: { wallet: wallet._id } },
    { $group: { _id: "$status", total: { $sum: "$amount" } } },
  ]);

  if (!statistics.length > 0 && type === "stats") {
    return res.status(404).json({
      status: "fail",
      message: "No statistics for current wallet.",
    });
  }

  const income = _.find(statistics, { _id: "income" });
  const expense = _.find(statistics, { _id: "expense" });

  const incomeAmount = income && income.total ? income.total : 0;
  const expenseAmount = expense && expense.total ? expense.total : 0;

  const total = incomeAmount + expenseAmount;

  // data required to display inside the chart
  const difference = incomeAmount - expenseAmount;
  const incomeRate = _.round((incomeAmount / total) * 100, 2);
  const expenseRate = _.round((expenseAmount / total) * 100, 2);

  // remained balance calculated from balance, income and expense
  const remain = wallet.balance + difference;

  const stats = {
    _id: wallet._id,
    icon: wallet.icon,
    name: wallet.name,
    income: incomeAmount,
    expense: expenseAmount,
    incomeRate: incomeRate,
    difference: difference,
    balance: wallet.balance,
    expenseRate: expenseRate,
    remain: remain ? remain : 0,
    iconColor: wallet.iconColor,
  };

  let data = {};
  data.stats = stats;

  if (type === "stats") {
    data.transactions = transactions;
  }

  res.status(200).json({
    data,
    status: "success",
  });
});

exports.getWallets = catchAsync(async (req, res, next) => {
  const wallets = await Wallet.find({ user: req.user._id });

  if (!wallets.length > 0) {
    return res.status(404).json({
      status: "fail",
      message: "No wallets information",
    });
  }

  const walletStats = await Promise.all(
    wallets.map(async (wallet) => {
      /**
       * retrieve required attributes
       * for wallet statistics
       */
      let { _id } = wallet;
      const transactions = await Transaction.find({ wallet: _id });

      /**
       * calculate wallet balance with
       * related transactions
       */
      if (transactions.length > 0) {
        let balance = _.reduce(
          transactions,
          function (walletBalance, transaction) {
            const { status, amount } = transaction;
            /**
             * calculate wallet balance depending
             * on the transaction status(income/expense)
             */
            return status === "income" ? walletBalance + amount : walletBalance - amount;
          },
          wallet.balance
        );
        return { ...wallet._doc, balance };
      } else {
        return wallet._doc;
      }
    })
  );

  res.status(200).json({
    status: "success",
    data: {
      wallets: walletStats,
    },
  });
});

exports.getWallet = catchAsync(async (req, res, next) => {
  const wallet = await Wallet.findById(req.params.id);
  if (!wallet) {
    return res.status(404).json({
      status: "fail",
      message: "No wallet information",
    });
  }
  res.status(200).json({
    status: "success",
    data: {
      wallet,
    },
  });
});

exports.updateWallet = catchAsync(async (req, res, next) => {
  const wallet = await Wallet.findByIdAndUpdate(req.params.id, _.pick(req.body, walletFields), {
    new: true,
    runValidators: true,
  });

  const transactions = await Transaction.find({ wallet: wallet._id });

  /**
   * calculate wallet balance with
   * related transactions
   */
  if (transactions.length > 0) {
    let balance = _.reduce(
      transactions,
      function (walletBalance, transaction) {
        const { status, amount } = transaction;
        /**
         * calculate wallet balance depending
         * on the transaction status(income/expense)
         */
        return status === "income" ? walletBalance + amount : walletBalance - amount;
      },
      wallet.balance
    );
    return res.status(200).json({
      status: "success",
      message: "Wallet has been updated successfully.",
      data: {
        wallet: { ...wallet._doc, balance },
      },
    });
  } else {
    return res.status(200).json({
      status: "success",
      message: "Wallet has been updated successfully.",
      data: {
        wallet: wallet._doc,
      },
    });
  }
});

exports.deleteWallet = catchAsync(async (req, res, next) => {
  const wallet = await Wallet.findById(req.params.id);
  if (!wallet) {
    return res.status(404).json({
      status: "fail",
      message: "No wallet information",
    });
  }

  await wallet.remove();
  res.status(200).json({
    status: "success",
    message: "Wallet has been deleted.",
  });
});
