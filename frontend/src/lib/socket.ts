import { io, Socket } from "socket.io-client";

let socketInstance: Socket | null = null;

export const getSocket = () => {
  if (!socketInstance) {
    socketInstance = io(
      import.meta.env.VITE_API_ORIGIN || import.meta.env.VITE_API_BASE_URL,
      {
        withCredentials: true,
        transports: ["websocket"],
        autoConnect: true,
      }
    );
  }

  return socketInstance;
};

export default getSocket();