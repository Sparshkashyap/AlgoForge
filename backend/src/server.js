import http from "http";
import app from "./app.js";
import env from "./config/env.js";
import prisma from "./config/db.js";
import { initSocket } from "./config/socket.js";
import { bootstrapNotificationSchedulers } from "./queues/notification.queue.js";
import { seedBadgesService } from "./services/badge.service.js";

import "./workers/execution.worker.js";
import "./workers/notification.worker.js";
import "./workers/payment.worker.js";

const startServer = async () => {
  try {
    await prisma.$connect();
    console.log("PostgreSQL connected");

    await seedBadgesService();
    console.log("Badge seed completed");

    await bootstrapNotificationSchedulers();
    console.log("Background schedulers initialized");

    const httpServer = http.createServer(app);
    initSocket(httpServer);

    httpServer.listen(env.PORT, () => {
      console.log(`Server running on port ${env.PORT}`);
    });

    // graceful shutdown (you were missing this — bad in prod)
    const shutdown = async () => {
      console.log("Shutting down server...");
      await prisma.$disconnect().catch(() => {});
      process.exit(0);
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
  } catch (error) {
    console.error("Server start error:", error);
    await prisma.$disconnect().catch(() => {});
    process.exit(1);
  }
};

startServer();