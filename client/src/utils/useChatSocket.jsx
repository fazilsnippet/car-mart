// src/features/chat/socketSync.js
import { connectSocket } from "../../socket";
import { store } from "../../store";
import { chatApi } from "./chatApi";

let currentUserId = null;

export const initChatSocket = (userId) => {
  if (!userId) return;
  currentUserId = userId;
  const socket = connectSocket(userId);

  socket.on("newMessage", ({ message, conversationId }) => {
    // update messages cache for that conversation (append if missing)
    try {
      store.dispatch(
        chatApi.util.updateQueryData(
          "getMessages",
          { conversationId, page: 1, limit: 50 },
          (draft) => {
            if (!draft.data) draft.data = [];
            const exists = draft.data.some((m) => m._id === message._id);
            if (!exists) draft.data.push(message);
            draft.data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
          }
        )
      );
    } catch (e) {}

    // update conversations list (lastMessage, updatedAt, unreadCounts)
    try {
      store.dispatch(
        chatApi.util.updateQueryData(
          "getConversations",
          { page: 1, limit: 50 },
          (draft) => {
            if (!draft.data) return;
            const idx = draft.data.findIndex((c) => c._id === conversationId);
            if (idx !== -1) {
              draft.data[idx].lastMessage = message;
              draft.data[idx].updatedAt = message.createdAt;
              if (message.sender !== currentUserId) {
                draft.data[idx].unreadCounts = draft.data[idx].unreadCounts || {};
                draft.data[idx].unreadCounts[currentUserId] =
                  (draft.data[idx].unreadCounts[currentUserId] || 0) + 1;
              }
            } else {
              // optional: prepend a new conversation placeholder
            }
            draft.data.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
          }
        )
      );
    } catch (e) {}
  });
};
