import { ZodError } from "zod";

export const validate = (schema) => {
  return async (req, res, next) => {
    try {
      const parsed = await schema.parseAsync({
        body: req.body ?? {},
        params: req.params ?? {},
        query: req.query ?? {},
      });

      req.validated = parsed;
      next();
    } catch (error) {
      console.error("VALIDATION ERROR:", error);

      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: error.issues.map((issue) => ({
            path: issue.path.join("."),
            message: issue.message,
          })),
        });
      }

      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: [
          {
            path: "unknown",
            message: error.message || "Unknown validation error",
          },
        ],
      });
    }
  };
};