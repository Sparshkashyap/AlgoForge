export const errorMiddleware = (error, req, res, next) => {
  console.error(error);

  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal server error";

  return res.status(statusCode).json({
    success: false,
    message,
    errors: error.errors || null
  });
};