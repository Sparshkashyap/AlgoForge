import { useEffect } from "react";
import { getSocket } from "@/lib/socket";
import { useAuth } from "@/context/AuthContext";

export const useRealtimeUserChannel = () => {
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.id) return;

    const socket = getSocket();

    socket.emit("join:user", user.id);

    return () => {
      // no-op
    };
  }, [user?.id]);
};