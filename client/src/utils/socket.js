import { io } from "socket.io-client";
import { chatApi } from "../redux/features/chats/chatApi"; // import your API slice
import { store } from "../app/store"; // import Redux store
import { baseApi } from "../redux/api/baseApi"; // import baseApi for token refresh
let socket;

export const connectSocket = (userId) => {
  if (socket) {
    if (socket.connected) {
      socket.emit("joinUser", { userId });
    }
    return socket;
  }

  const socketUrl =
    import.meta.env.VITE_SOCKET_URL ?? import.meta.env.REACT_APP_SOCKET_URL;

  socket = io(socketUrl, {
    transports: ["websocket", "polling"],
    withCredentials: true,
    reconnection: true,
  });

  socket.on("connect", () => {
    console.log("✅ Socket connected:", socket.id);
    socket.emit("joinUser", { userId });
  });

  socket.on("reconnect", () => {
    console.log("🔄 Socket reconnected:", socket.id);
    socket.emit("joinUser", { userId });
  });

 
  socket.on("disconnect", (reason) => {
  if (reason === "io server disconnect") {
    // try refreshing token via API
    store.dispatch(baseApi.endpoints.getMe.initiate())
      .unwrap()
      .then(() => connectSocket(userId)); // reconnect
  }
});


  socket.on("connect_error", (error) => {
    console.error("❌ Socket connection error:", error.message);
  });

  return socket;
};

export const joinConversation = (conversationId) => {
  if (socket?.connected) {
    socket.emit("joinConversation", { conversationId });
  }
  return socket;
};

// ✅ Merge new messages directly into RTK Query cache
export const listenForMessages = () => {
  if (!socket) return;

  socket.on("newMessage", ({ message, conversationId }) => {
    console.log("📩 New message received:", message);

    // Update getMessages cache
    store.dispatch(
      chatApi.util.updateQueryData(
        "getMessages",
        { conversationId, page: 1, limit: 50 },
        (draft) => {
          if (!draft.data) draft.data = [];
          draft.data.push(message); // prepend since sorted DESC
        }
      )
    );

    // Update conversations list (lastMessage + updatedAt)
    store.dispatch(
      chatApi.util.updateQueryData(
        "getConversations",
        { page: 1, limit: 50 },
        (draft) => {
          const conv = draft.data?.find((c) => c._id === conversationId);
          if (conv) {
            conv.lastMessage = message;
            conv.updatedAt = new Date().toISOString();
          }
        }
      )
    );
  });
};
