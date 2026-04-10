import { io } from "socket.io-client";

let socket;

export const connectSocket = (userId) => {
  if (socket?.connected) {
    socket.emit("join", { userId });
    return socket;
  }

  const socketUrl = import.meta.env.VITE_SOCKET_URL ?? import.meta.env.REACT_APP_SOCKET_URL;
  socket = io(socketUrl || "", {
    transports: ["websocket", "polling"],
    withCredentials: true,
    reconnection: true,
  });

  socket.on("connect", () => {
    console.log("✅ Socket connected:", socket.id);
    socket.emit("join", { userId });
  });

  socket.on("connect_error", (error) => {
    console.error("❌ Socket connection error:", error.message);
  });

  return socket;
};

export const getSocket = () => socket;