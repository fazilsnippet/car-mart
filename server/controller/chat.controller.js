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
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }
//     if (!req.user || !req.user._id) {
//   return res.status(401).json({
//     success: false,
//     message: "Unauthorized user"
//   });
// }



    // ❌ Prevent admin from starting conversation
    if (isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Admins cannot start conversations"
      });
    }

    if (!carId || !mongoose.Types.ObjectId.isValid(carId)) {
      return res.status(400).json({
        success: false,
        message: "Valid carId is required"
      });
    }

    const carExists = await Car.exists({
      _id: carId,
      lifecycleStatus: "ACTIVE"
    });
    
    if (!carExists) {
      return res.status(404).json({
        success: false,
        message: "Car not found or inactive"
      });
    }
    
    
    // ✅ UPSERT CONVERSATION
   const ADMIN_ID = process.env.ADMIN_ID;

const uniqueKey = `${userId}_${carId}`;

const conversation = await Conversation.findOneAndUpdate(
  { uniqueKey },
  {
    $set: {
      updatedAt: new Date()
    },
    $setOnInsert: {
      uniqueKey,
      car: carId,
      participants: [userId, ADMIN_ID],
      unreadCounts: {
        [userId.toString()]: 0,
        [ADMIN_ID]: 0
      }
    }
  },
  {
    new: true,
    upsert: true
  }
);

false
return res.status(200).json({
  success: true,
  data: conversation
});

} catch (error) {
  return res.status(500).json({
      success: false,
      message: error.message
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
        message: "Valid conversationId is required"
      });
    }

    if (!trimmedText) {
      return res.status(400).json({
        success: false,
        message: "Message text is required"
      });
    }

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found"
      });
    }

    const isAdmin = req.user.role === "admin";

    // ✅ CORRECT PARTICIPANT CHECK
   const isParticipant = conversation.participants?.some(
  (id) => id.toString() === req.user._id.toString()
);


    if (!isAdmin && !isParticipant) {
      return res.status(403).json({
        success: false,
        message: "Not authorized"
      });
    }

    // ✅ REAL SENDER (USER ID)
    const message = await Message.create({
      conversation: conversationId,
      sender: req.user._id,
      text: trimmedText
    });

    // ✅ UPDATE CONVERSATION
    conversation.lastMessage = message._id;
    conversation.updatedAt = new Date();

    // =========================
    // 🔥 UNREAD COUNT UPDATE
    // =========================
    const participants = conversation.participants || [];

    participants.forEach((participantId) => {
      if (participantId.toString() !== req.user._id.toString()) {
        const current =
          conversation.unreadCounts?.get(participantId.toString()) || 0;

        conversation.unreadCounts.set(
          participantId.toString(),
          current + 1
        );
      }
    });
console.log("participants:", conversation.participants);
    await conversation.save();

    return res.status(201).json({
      success: true,
      data: message
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
      
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
        message: "Invalid conversationId"
      });
    }

    const conversation = await Conversation.findById(conversationId)
      .select("participants")
      .lean();

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found"
      });
    }

    const isAdmin = req.user.role === "admin";

    // ✅ CORRECT PARTICIPANT CHECK
    const isParticipant = conversation.participants?.some(
      (id) => id.toString() === req.user._id.toString()
    );

    if (!isAdmin && !isParticipant) {
      return res.status(403).json({
        success: false,
        message: "Not authorized"
      });
    }

    const skip = (page - 1) * limit;

    // ✅ FETCH MESSAGES
    const [messages, total] = await Promise.all([
      Message.find({ conversation: conversationId })
        .sort({ createdAt: -1 }) // latest first (efficient)
        .skip(skip)
        .limit(limit)
        .lean(),

      Message.countDocuments({ conversation: conversationId })
    ]);

    // ✅ REVERSE FOR CHAT UI (old → new)
    const formattedMessages = messages.reverse();

    res.json({
      success: true,
      data: formattedMessages,
      pagination: {
        page,
        limit,
        total,
        hasMore: skip + limit < total
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
