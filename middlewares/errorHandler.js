module.exports = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let errorMessage = err.message || "Something went wrong";

  if (err.name === "CastError") {
    statusCode = 400;
    errorMessage = `Invalid ${err.path}: ${err.value}`;
  }

  if (err.name === "ValidationError") {
    statusCode = 422;
    errorMessage = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
  }

  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    errorMessage = "Invalid or expired token";
  }

  res.status(statusCode).json({
    message: errorMessage,
    statusCode: statusCode,
    success: false,
  });
};
