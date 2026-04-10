import { ZodError } from "zod";

export const errorMiddleware = (err, req, res, next) => {
  console.error("ERROR:", err);

  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: err.issues[0]?.message || "Validation error",
    });
  }

  return res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};