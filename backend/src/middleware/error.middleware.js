export const errorMiddleware = (error, req, res, next) => {
  console.error("ERROR:", error);

  if (res.headersSent) {
    return next(error);
  }

  const statusCode = error.statusCode || 500;
  const message =
    error.message || "Something went wrong on the server";

  return res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV !== "production" && { stack: error.stack }),
  });
};