import jwt from "jsonwebtoken";
import { Server } from "socket.io";
import { Conversation } from "../models/Conversation.model.js";
import { Message } from "../models/Message.model.js";
import { canSendMessage } from "../utils/ratelimiter.js";
export const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CORS_ORIGIN,
      credentials: true,
    },
  });



io.use((socket, next) => {
  try {
    const cookies = socket.handshake.headers.cookie;
    if (!cookies) return next(new Error("Unauthorized"));

    const accessToken = cookies
      .split(";")
      .map(c => c.trim())
      .find(c => c.startsWith("accessToken="))
      ?.split("=")[1];

    if (!accessToken) return next(new Error("Unauthorized"));

    // ✅ verify the token
    const payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

    // ✅ attach user to socket
    socket.user = { _id: payload.userId };

    next();
  } catch (err) {
    next(new Error("Unauthorized"));
  }
});



 io.on("connection", (socket) => {
  const userId = socket.user?._id;
  if (!userId) {
    socket.disconnect();
    return;
  }
   

    // ✅ JOIN CONVERSATION ROOM
    socket.on("joinConversation", async ({ conversationId }) => {
      const conversation = await Conversation.findById(conversationId);

      if (!conversation) return;

      const isParticipant = conversation.participants.some(
        (id) => id.toString() === userId
      );

      if (!isParticipant) return;

      socket.join(conversationId.toString());
    });

    // ✅ SEND MESSAGE (aligned with backend rules)
    socket.on("sendMessage", async ({ conversationId, text }) => {
      try {
        // if (!canSendMessage(userId)) {
        //   socket.emit("error", "Too many messages");
        //   return;
        // }

        const conversation = await Conversation.findById(conversationId);

        if (!conversation) return;

        const isParticipant = conversation.participants.some(
          (id) => id.toString() === userId
        );

        if (!isParticipant) return;

        const message = await Message.create({
          conversation: conversationId,
          sender: userId,
          text,
        });

        // ✅ update conversation
        conversation.lastMessage = message._id;
        conversation.updatedAt = new Date();

        conversation.participants.forEach((id) => {
          const strId = id.toString();
          if (strId !== userId) {
            const current = conversation.unreadCounts.get(strId) || 0;
            conversation.unreadCounts.set(strId, current + 1);
          }
        });

        await conversation.save();

        const populatedMessage = await message.populate(
          "sender",
          "name avatar"
        );

        // 🔥 emit to room (both participants)
        io.to(conversationId.toString()).emit("newMessage", {
          message: populatedMessage,
          conversationId,
        });

      } catch (err) {
        socket.emit("error", "Message failed");
      }
    });

    // ✅ TYPING
    socket.on("typing", ({ conversationId }) => {
      socket.to(conversationId).emit("typing", { userId });
    });

    socket.on("stopTyping", ({ conversationId }) => {
      socket.to(conversationId).emit("stopTyping", { userId });
    });

    // ✅ READ RECEIPTS (scoped)
    socket.on("markAsRead", async ({ conversationId }) => {
      const conversation = await Conversation.findById(conversationId);

      if (!conversation) return;

      const isParticipant = conversation.participants.some(
        (id) => id.toString() === userId
      );

      if (!isParticipant) return;

      await Message.updateMany(
        {
          conversation: conversationId,
          sender: { $ne: userId },
          read: false,
        },
        { $set: { read: true } }
      );

      conversation.unreadCounts.set(userId, 0);
      await conversation.save();

      io.to(conversationId.toString()).emit("messagesRead", {
        conversationId,
        userId,
      });
    });

    socket.on("disconnect", () => {
      // nothing needed (rooms auto cleaned)
    });
  });

  return io;
};