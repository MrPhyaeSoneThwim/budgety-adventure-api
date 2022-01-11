module.exports = (app) => {
  app.use((error, req, res, next) => {
    error.statusCode = error.statusCode || 500;
    error.status = error.status || "error";

    if (error.name === "TokenExpiredError") {
      error.message = "Please login again to fetch data!";
    }

    return res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
    });
  });
};
