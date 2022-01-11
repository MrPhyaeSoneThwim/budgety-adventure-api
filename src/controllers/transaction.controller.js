const _ = require("lodash");
const months = require("../data/months");
const Transaction = require("../models/transaction");
const catchAsync = require("express-async-handler");
const { transactionFields } = require("../utils/fields");

exports.addTransaction = catchAsync(async (req, res, next) => {
  const transaction = await Transaction.create(
    _.assign({ user: req.user._id }, _.pick(req.body, transactionFields))
  );

  res.status(201).json({
    status: "success",
    message: "Transaction has been created.",
    data: {
      transaction,
    },
  });
});

exports.getTransactions = catchAsync(async (req, res, next) => {
  const { status, createdAt } = req.query;
  const { walletId } = req.params;

  const query = { user: req.user._id };

  if (createdAt) {
    query.createdAt = new Date(createdAt);
  }

  if (walletId) {
    query.wallet = walletId;
  }

  if (status && (status === "income" || status === "expense")) {
    query.status = status;
  }

  const transactions = await Transaction.find(query);

  if (!transactions.length > 0) {
    return res.status(404).json({
      status: "fail",
      message: "No transactions information.",
    });
  }
  res.status(200).json({
    status: "success",
    data: {
      transactions,
    },
  });
});

exports.getTransaction = catchAsync(async (req, res, next) => {
  const transaction = await Transaction.findById(req.params.id);
  res.status(200).json({
    status: "success",
    data: {
      transaction,
    },
  });
});

exports.updateTransaction = catchAsync(async (req, res, next) => {
  const transaction = await Transaction.findByIdAndUpdate(
    req.params.id,
    _.pick(req.body, transactionFields),
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    status: "success",
    message: "Transaction has been successfully updated.",
    data: {
      transaction,
    },
  });
});

exports.deleteTransaction = catchAsync(async (req, res, next) => {
  const transaction = await Transaction.findById(req.params.id);
  if (!transaction) {
    return res.status(404).json({
      status: "fail",
      message: "No transaction information.",
    });
  }
  await transaction.remove();
  res.status(200).json({
    status: "success",
    message: "Transaction has been deleted.",
  });
});

exports.getMonthlyStats = catchAsync(async (req, res, next) => {
  const { month, year } = req.params;
  if (!month || !year) {
    return res.status(400).json({
      status: "fail",
      message: "Please provide month and year for statsitics.",
    });
  }

  const stats = await Transaction.aggregate([
    {
      $project: {
        user: 1,
        status: 1,
        amount: 1,
        month: { $month: "$createdAt" },
        year: { $year: "$createdAt" },
      },
    },
    {
      $match: { month: month * 1, year: year * 1, user: req.user._id },
    },
    {
      $group: {
        _id: 0,
        results: { $push: "$$ROOT" },
      },
    },
    { $project: { _id: 0 } },
    {
      $addFields: {
        incomes: {
          $filter: {
            input: "$results",
            as: "result",
            cond: {
              $eq: ["$$result.status", "income"],
            },
          },
        },
        expenses: {
          $filter: {
            input: "$results",
            as: "result",
            cond: {
              $eq: ["$$result.status", "expense"],
            },
          },
        },
      },
    },
    { $project: { results: 0 } },
    {
      $group: {
        _id: 0,
        income: { $sum: { $sum: "$incomes.amount" } },
        expense: { $sum: { $sum: "$expenses.amount" } },
      },
    },
    { $project: { _id: 0 } },
  ]);

  if (!stats.length > 0) {
    return res.status(404).json({
      status: "fail",
      message: "No monthly statstics.",
    });
  }

  // calcualte percentage and difference for income & expense
  const income = stats[0].income;
  const expense = stats[0].expense;

  const total = income + expense;
  const difference = income - expense;
  const incomeRate = _.round((income / total) * 100, 2);
  const expenseRate = _.round((expense / total) * 100, 2);

  res.status(200).json({
    status: "success",
    data: {
      stats: {
        income,
        expense,
        incomeRate,
        expenseRate,
        difference,
      },
    },
  });
});

exports.getAnnualStats = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1; // 2021
  if (!year) {
    return res.status(400).json({
      status: "fail",
      message: "Please provide year for annual statistics.",
    });
  }

  const stats = await Transaction.aggregate([
    {
      $unwind: "$createdAt",
    },
    {
      $match: {
        user: req.user._id,
        createdAt: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: "$createdAt" },
        transactions: { $push: "$$ROOT" },
      },
    },
    { $addFields: { month: "$_id" } },
    { $project: { _id: 0 } },
    {
      $addFields: {
        incomes: {
          $filter: {
            input: "$transactions",
            as: "transactions",
            cond: {
              $eq: ["$$transactions.status", "income"],
            },
          },
        },
        expenses: {
          $filter: {
            input: "$transactions",
            as: "transactions",
            cond: {
              $eq: ["$$transactions.status", "expense"],
            },
          },
        },
      },
    },
    {
      $group: {
        _id: "$month",
        income: { $sum: { $sum: "$incomes.amount" } },
        expense: { $sum: { $sum: "$expenses.amount" } },
      },
    },
    { $addFields: { month: "$_id" } },
    { $project: { _id: 0 } },
  ]);

  if (!stats.length > 0) {
    return res.status(404).json({
      status: "fail",
      message: "No statistics for requested year.",
    });
  }

  const annualStats = _.map(months, function (monthObj) {
    const match = _.find(stats, { month: monthObj.month });
    const monthName = monthObj.name;
    return match
      ? { month: monthObj.month, monthName, expense: match.expense, income: match.income }
      : { month: monthObj.month, monthName, income: 0, expense: 0 };
  });

  res.status(200).json({
    status: "success",
    data: {
      stats: annualStats,
    },
  });
});
