import mongoose from "mongoose";
import { Car } from "../models/Car.model.js";
import { Conversation } from "../models/Conversation.model.js";
import { Message } from "../models/Message.model.js";

export const startConversation = async (req, res) => {
  try {
    const userId = req.user?._id;
    const isAdmin = req.user?.role === "admin";
    const { carId } = req.body;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Admins cannot start conversations",
      });
    }

    if (!carId || !mongoose.Types.ObjectId.isValid(carId)) {
      return res.status(400).json({
        success: false,
        message: "Valid carId is required",
      });
    }

    const carExists = await Car.exists({
      _id: carId,
      lifecycleStatus: "ACTIVE",
    });

    if (!carExists) {
      return res.status(404).json({
        success: false,
        message: "Car not found or inactive",
      });
    }

    const ADMIN_ID = process.env.ADMIN_ID;

    if (!mongoose.Types.ObjectId.isValid(ADMIN_ID)) {
      throw new Error("Invalid ADMIN_ID");
    }

    const uniqueKey = `${userId}_${carId}`;

    const conversation = await Conversation.findOneAndUpdate(
      { uniqueKey },
      {
        $set: { updatedAt: new Date() },
        $setOnInsert: {
          uniqueKey,
          car: carId,
          participants: [userId], // only user
          adminId: ADMIN_ID,
          unreadCounts: {
            [userId.toString()]: 0,
            [ADMIN_ID]: 0,
          },
        },
      },
      { new: true, upsert: true }
    );

    return res.status(200).json({
      success: true,
      data: conversation,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const sendMessage = async (req, res) => {
  try {
    const { conversationId, text } = req.body;
    const trimmedText = text?.trim();

    if (!conversationId || !mongoose.Types.ObjectId.isValid(conversationId)) {
      return res.status(400).json({
        success: false,
        message: "Valid conversationId is required",
      });
    }

    if (!trimmedText) {
      return res.status(400).json({
        success: false,
        message: "Message text is required",
      });
    }

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    const userId = req.user._id.toString();
    const ADMIN_ID = process.env.ADMIN_ID;

    const isAdmin = userId === ADMIN_ID;
    const isParticipant = conversation.participants.some(
      (id) => id.toString() === userId
    );

    // 🔥 strict access control
    if (!isAdmin && !isParticipant) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    const message = await Message.create({
      conversation: conversationId,
      sender: req.user._id,
      text: trimmedText,
    });

    // update conversation
    conversation.lastMessage = message._id;
    conversation.updatedAt = new Date();

    // 🔥 unread count (object-safe)
    const allReceivers = [
      ...conversation.participants.map((id) => id.toString()),
      ADMIN_ID,
    ];

    allReceivers.forEach((id) => {
      if (id !== userId) {
        const current = conversation.unreadCounts?.[id] || 0;
        conversation.unreadCounts[id] = current + 1;
      }
    });

    await conversation.save();

    // 🔥 SOCKET EMIT (CRITICAL)
    const io = req.app.get("io");

    io.to(conversationId.toString()).emit("newMessage", {
      message,
      conversationId,
    });

    return res.status(201).json({
      success: true,
      data: message,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const getConversations = async (req, res) => {
  try {
    const userId = req.user._id;
    const isAdmin = req.user.role === "admin";

    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit, 10) || 20, 50);
    const skip = (page - 1) * limit;

    // ✅ FILTER
    const filter = isAdmin
      ? {}
      : { participants: userId };

    const [conversations, total] = await Promise.all([
      Conversation.find(filter)
        .populate("participants", "name email") // replaces user
        .populate("car", "title price images")
        .populate("lastMessage", "text sender createdAt")
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      Conversation.countDocuments(filter)
    ]);

    return res.json({
      success: true,
      data: conversations,
      pagination: {
        page,
        limit,
        total,
        hasMore: skip + limit < total
      }
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit, 10) || 20, 50);

    if (!mongoose.Types.ObjectId.isValid(conversationId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid conversationId",
      });
    }

    const conversation = await Conversation.findById(conversationId)
      .select("participants")
      .lean();

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    const isAdmin = req.user.role === "admin";

    const isParticipant = conversation.participants?.some(
      (id) => id.toString() === req.user._id.toString()
    );

    if (!isAdmin && !isParticipant) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    const skip = (page - 1) * limit;

    const messages = await Message.find({ conversation: conversationId })
      .sort({ createdAt: -1 }) // 🔥 KEEP DESC
      .skip(skip)
      .limit(limit)
      .lean();

    res.json({
      success: true,
      data: messages, // ✅ FIXED
      pagination: {
        page,
        limit,
        hasMore: messages.length === limit, // ✅ better than count
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
