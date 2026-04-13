const errorHandler = (err, req, res, next) => {
  // Helpful default status for unexpected server errors.
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal server error",
  });
};

module.exports = { errorHandler };
