import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import session from "express-session";
import passport from "./config/passport.js";
import cookieRoutes from "./routes/cookie.routes.js";


import env from "./config/env.js";
import prisma from "./config/db.js";

import authRoutes from "./routes/auth.routes.js";
import problemRoutes from "./routes/problem.routes.js";
import submissionRoutes from "./routes/submission.routes.js";
import executionRoutes from "./routes/execution.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import userRoutes from "./routes/user.routes.js";
import aiRoutes from "./routes/ai.routes.js";
import dailyQuestionRoutes from "./routes/dailyQuestion.routes.js";
import exportRoutes from "./routes/export.routes.js";
import billingRoutes from "./routes/billing.routes.js";
import webhookRoutes from "./routes/webhook.routes.js";
import contestRoutes from "./routes/contest.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import leaderboardRoutes from "./routes/leaderboard.routes.js";
import roadmapRoutes from "./routes/roadmap.routes.js";
import learningPathRoutes from "./routes/learningPath.routes.js";
import bookmarkRoutes from "./routes/bookmark.routes.js";
import problemNoteRoutes from "./routes/problemNote.routes.js";
import ragChatRoutes from "./routes/ragChat.routes.js";
import gamificationRoutes from "./routes/gamification.routes.js";
import discussionRoutes from "./routes/discussion.routes.js";
import problemReviewRoutes from "./routes/problem.review.routes.js";

import { notFoundMiddleware } from "./middleware/notFound.middleware.js";
import { errorMiddleware } from "./middleware/error.middleware.js";


const app = express();

app.set("trust proxy", 1);

// CORS
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  })
);

// Security + logs
app.use(helmet());
app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(cookieParser());

// Sessions + passport
app.use(
  session({
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: env.NODE_ENV === "production" ? "none" : "lax",
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());


app.use("/api/cookies", cookieRoutes);


// Razorpay webhook MUST come BEFORE json parser
app.use(
  "/api/webhooks/razorpay",
  express.raw({
    type: "application/json",
    limit: "2mb",
    verify: (req, _res, buf) => {
      req.rawBody = buf.toString("utf8");
    },
  }),
  webhookRoutes
);

// Body parsers
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

// Health routes
app.get("/", (_req, res) => {
  return res.status(200).json({
    success: true,
    message: "AlgoForge API running",
  });
});

app.get("/health", async (_req, res, next) => {
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

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/problems", problemRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/execution", executionRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/daily-question", dailyQuestionRoutes);
app.use("/api/export", exportRoutes);
app.use("/api/billing", billingRoutes);
app.use("/api/contests", contestRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/roadmap", roadmapRoutes);
app.use("/api/learning-paths", learningPathRoutes);
app.use("/api/bookmarks", bookmarkRoutes);
app.use("/api/problem-notes", problemNoteRoutes);
app.use("/api/rag-chat", ragChatRoutes);
app.use("/api/gamification", gamificationRoutes);
app.use("/api/discussions", discussionRoutes);
app.use("/api/problem-reviews", problemReviewRoutes);

// Errors
app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app; 