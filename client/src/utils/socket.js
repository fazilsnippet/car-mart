import { io } from "socket.io-client";

let socket;

export const connectSocket = (userId) => {
  socket = io("http://localhost:8001", {
    transports: ["websocket"]
  });

  socket.on("connect", () => {
    console.log("✅ Socket connected:", socket.id);

    // 👇 IMPORTANT: register user
    socket.emit("join", { userId });
  });

  return socket;
};

export const getSocket = () => socket;