import { Server } from "socket.io";
import env from "./env.js";

let io = null;

export const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: env.CLIENT_URL || true,
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    // auto-join via auth handshake
    const authUserId = socket.handshake.auth?.userId;
    if (authUserId) {
      socket.join(`user:${authUserId}`);
    }

    // manual join (legacy / fallback)
    socket.on("join", (userId) => {
      if (userId) {
        const id = String(userId);
        socket.join(id);
        socket.join(`user:${id}`);
      }
    });

    // scoped join
    socket.on("join:user", (userId) => {
      if (userId) {
        socket.join(`user:${userId}`);
      }
    });

    socket.on("disconnect", () => {
      // no-op (can add logging later)
    });
  });

  return io;
};

export const getIo = () => {
  if (!io) {
    throw new Error("Socket.IO not initialized");
  }
  return io;
};

// alias for compatibility
export const getIO = getIo;

export const emitToUsers = (userIds = [], eventName, payload) => {
  if (!io || !Array.isArray(userIds) || userIds.length === 0) return;

  for (const userId of userIds) {
    if (!userId) continue;
    io.to(`user:${userId}`).emit(eventName, payload);
  }
};