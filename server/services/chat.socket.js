// file: sockets/chat.socket.js
import { Server } from "socket.io";
import { Message } from "../models/Message.model.js";
import { canSendMessage } from "../utils/ratelimiter.js";
import { notificationQueue } from "../services/notification.queue.js";

const onlineUsers = new Map();

export const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "https://car-mart-client.onrender.com",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    // JOIN
    socket.on("join", ({ userId }) => {
      onlineUsers.set(userId, socket.id);
    });

    // SEND MESSAGE
    socket.on("sendMessage", async (data) => {
      const { conversationId, sender, text, receiverId, userId } = data;

      if (!canSendMessage(userId)) {
        socket.emit("error", "Too many messages");
        return;
      }

      const message = await Message.create({
        conversation: conversationId,
        sender,
        text
      });

      const receiverSocket = onlineUsers.get(receiverId);

      if (receiverSocket) {
        io.to(receiverSocket).emit("receiveMessage", message);
      } else {
        await notificationQueue.add("new-message", {
          userId: receiverId,
          message: text,
           conversationId: conversationId
        });
      }

      socket.emit("receiveMessage", message);

      // AUTO MESSAGE
      if (sender === "user") {
        const autoReply = await Message.create({
          conversation: conversationId,
          sender: "admin",
          text: "Thanks! We'll reply soon."
        });

        socket.emit("receiveMessage", autoReply);
      }
    });

    // TYPING
    socket.on("typing", ({ receiverId }) => {
      const receiverSocket = onlineUsers.get(receiverId);
      if (receiverSocket) {
        io.to(receiverSocket).emit("typing");
      }
    });

    socket.on("stopTyping", ({ receiverId }) => {
      const receiverSocket = onlineUsers.get(receiverId);
      if (receiverSocket) {
        io.to(receiverSocket).emit("stopTyping");
      }
    });

    // READ RECEIPTS
    socket.on("markAsRead", async ({ conversationId }) => {
      await Message.updateMany(
        { conversation: conversationId, read: false },
        { $set: { read: true } }
      );

      io.emit("messagesRead", { conversationId });
    });

    socket.on("disconnect", () => {
      for (let [userId, sockId] of onlineUsers.entries()) {
        if (sockId === socket.id) {
          onlineUsers.delete(userId);
        }
      }
    });
  });

  return io;
};