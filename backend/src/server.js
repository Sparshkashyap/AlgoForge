import app from "./app.js";
import env from "./config/env.js";
import prisma from "./config/db.js";

const startServer = async () => {
  try {
    await prisma.$connect();
    console.log("PostgreSQL connected");

    app.listen(env.PORT, () => {
      console.log(`Server running on port ${env.PORT}`);
    });
  } catch (error) {
    console.error("Server start error:", error);
    process.exit(1);
  }
};

startServer();