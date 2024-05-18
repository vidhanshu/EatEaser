import { PropsWithChildren, createContext, useContext, useEffect, useState } from "react";
import io, { type Socket } from "socket.io-client";
import useAuthStore from "../stores/auth-store";

const SocketContext = createContext<{
  socket: Socket | null;
  isConnected: Boolean;
}>({
  socket: null,
  isConnected: false,
});

export const SocketContextProvider = ({ children }: PropsWithChildren) => {
  const [socketInstance, setSocketInstance] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState<Boolean>(false);
  const userId = useAuthStore((store) => store.user?._id);

  useEffect(() => {
    if (!userId) return;

    setSocketInstance(io(import.meta.env.VITE_SERVER_URL, { query: { userId }, transports: ["websocket"] }));
  }, [userId]);

  useEffect(() => {
    if (!socketInstance) return;
    socketInstance.on("connect", () => {
      setIsConnected(true);
    });
    socketInstance.on("disconnect", () => {
      setIsConnected(false);
    });
    return () => {
      socketInstance.off("connect");
      socketInstance.off("disconnect");
      socketInstance.close();
    };
  }, [socketInstance]);

  console.log("[SOCKET_INSTANCE]", socketInstance, isConnected);

  return (
    <SocketContext.Provider
      value={{
        socket: socketInstance,
        isConnected,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocketContext = () => useContext(SocketContext);
