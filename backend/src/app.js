import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";

import env from "./config/env.js";
import prisma from "./config/db.js";

import authRoutes from "./routes/auth.routes.js";
import problemRoutes from "./routes/problem.routes.js";
import submissionRoutes from "./routes/submission.routes.js";
import executionRoutes from "./routes/execution.routes.js";

import { notFoundMiddleware } from "./middleware/notFound.middleware.js";
import { errorMiddleware } from "./middleware/error.middleware.js";

const app = express();

app.set("trust proxy", 1);

app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  })
);

app.use(helmet());
app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(cookieParser());
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

app.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "AlgoForge API running",
  });
});

app.get("/health", async (req, res, next) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    return res.status(200).json({
      success: true,
      message: "AlgoForge API healthy",
      env: env.NODE_ENV,
    });
  } catch (error) {
    next(error);
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/problems", problemRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/execution", executionRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;