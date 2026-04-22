import { io, Socket } from "socket.io-client";

let socketInstance: Socket | null = null;

const getBaseUrl = () =>
  import.meta.env.VITE_API_ORIGIN ||
  import.meta.env.VITE_API_BASE_URL;

export const getSocket = (): Socket => {
  if (!socketInstance) {
    socketInstance = io(getBaseUrl(), {
      withCredentials: true,
      transports: ["websocket"],
      autoConnect: false,
      auth: {
        userId: undefined,
      },
    });
  }

  return socketInstance;
};

export const attachSocketUser = (userId?: string) => {
  const socket = getSocket();

  socket.auth = {
    userId,
  };

  if (!socket.connected) {
    socket.connect();
  }

  if (userId) {
    socket.emit("join:user", userId);
  }
};

export default getSocket;