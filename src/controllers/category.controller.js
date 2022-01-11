const _ = require("lodash");
const Category = require("../models/category");
const Transaction = require("../models/transaction");
const catchAsync = require("express-async-handler");
const { categoryFields } = require("../utils/fields");

exports.addCategory = catchAsync(async (req, res, next) => {
  const category = await Category.create(
    _.assign({ user: req.user._id }, _.pick(req.body, categoryFields))
  );
  res.status(201).json({
    status: "success",
    message: "Category has been created successfully.",
    data: {
      category,
    },
  });
});

exports.getCategories = catchAsync(async (req, res, next) => {
  const query = { user: req.user._id };
  const { type } = req.query;
  if (type && type !== "all") {
    query.type = type;
  }

  const categories = await Category.find(query).sort({ type: 1, createdAt: -1 });

  if (!categories.length > 0) {
    return res.status(404).json({
      status: "fail",
      message: "No categories information.",
    });
  }

  res.status(200).json({
    status: "success",
    data: {
      categories,
    },
  });
});

exports.getCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    return res.status(404).json({
      status: "fail",
      message: "No category inofrmation.",
    });
  }

  const transactions = await Transaction.find({ category: category._id });

  const amount = _.reduce(
    transactions,
    function (initialValue, transaction) {
      return initialValue + transaction.amount;
    },
    0
  );

  res.status(200).json({
    status: "success",
    data: {
      category: {
        ...category._doc,
        amount,
      },
    },
  });
});

exports.deleteCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    return res.status(404).json({
      status: "fail",
      message: "No category inofrmation.",
    });
  }

  await category.remove();
  res.status(200).json({
    status: "success",
    message: "Category has been deleted successfully.",
  });
});

exports.updateCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findByIdAndUpdate(
    req.params.id,
    _.pick(req.body, categoryFields),
    { new: true, runValidators: true }
  );

  res.status(200).json({
    status: "success",
    message: "Category has been updated successfully.",
    data: {
      category,
    },
  });
});

exports.getCategoryStats = catchAsync(async (req, res, next) => {
  const { month, year, type } = req.params;

  if (!month || !year || !type) {
    return res.status(404).json({
      status: "fail",
      message: "Please provide year, month and category type.",
    });
  }

  const stats = await Transaction.aggregate([
    {
      $match: {
        status: type,
        user: req.user._id,
      },
    },
    {
      $project: {
        amount: 1,
        category: 1,
        month: { $month: "$createdAt" },
        year: { $year: "$createdAt" },
      },
    },
    { $match: { month: month * 1, year: year * 1 } },
    {
      $group: {
        _id: "$category",
        amount: { $sum: "$amount" },
      },
    },
  ]);
  if (!stats.length > 0) {
    return res.status(404).json({
      status: "fail",
      message: `No ${type} statistics.`,
    });
  }

  const transactions = await Promise.all(
    stats.map(async (stat) => {
      const category = await Category.findById(stat._id);
      return {
        _id: category._id,
        amount: stat.amount,
        name: category.name,
        icon: category.icon,
        iconColor: category.iconColor,
      };
    })
  );

  const total = _.reduce(
    transactions,
    function (initialValue, transaction) {
      return initialValue + transaction.amount;
    },
    0
  );

  let statsList = transactions.map((transaction) => {
    const percent = _.round((transaction.amount / total) * 100, 2);
    return {
      percent,
      total: total,
      ...transaction,
    };
  });

  let categoryStats = [...statsList];

  if (statsList.length > 3) {
    // seperate statsList into chunk to get percent, amount & color for the last category(others)
    const resultsArray = _.chunk(statsList, 2);

    // get total, percentage and color for the last category(others)
    const lastResultTotal = resultsArray[1][0].amount + resultsArray[1][0].amount;
    const lastResultPercent = resultsArray[1][0].percent + resultsArray[1][0].percent;

    // format the last category(others)
    const lastResult = {
      total: total,
      name: "Others",
      amount: lastResultTotal,
      percent: lastResultPercent,
      iconColor: resultsArray[1][0].iconColor,
    };

    // merge existing top 3 statsList and final statsList into orginal statsList
    categoryStats = [...resultsArray[0], lastResult];
  }

  res.status(200).json({
    status: "success",
    data: {
      statsList,
      stats: {
        total,
        categoryStats,
      },
    },
  });
});
