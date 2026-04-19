import { getIO } from "../config/socket.js";

export const emitToUser = (userId, event, data) => {
  if (!userId) return;
  const io = getIO();
  io.to(String(userId)).emit(event, data);
};

export const emitBatchToUsers = (userIds, event, dataBuilder) => {
  const io = getIO();

  for (const userId of userIds) {
    io.to(String(userId)).emit(
      event,
      typeof dataBuilder === "function" ? dataBuilder(userId) : dataBuilder
    );
  }
};