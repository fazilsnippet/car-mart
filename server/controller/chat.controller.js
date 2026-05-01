import mongoose from "mongoose";
import { Car } from "../models/Car.model.js";
import { Conversation } from "../models/Conversation.model.js";
import { Message } from "../models/Message.model.js";


export const startConversation = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { carId } = req.body;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (req.user.role === "admin") {
      return res.status(403).json({
        success: false,
        message: "Admins cannot start conversations",
      });
    }

    if (!carId || !mongoose.Types.ObjectId.isValid(carId)) {
      return res.status(400).json({
        success: false,
        message: "Valid carId is required to start conversation",
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

    let conversation;

    try {
      conversation = await Conversation.findOneAndUpdate(
        { uniqueKey },
        {
          $set: { updatedAt: new Date() },
          $setOnInsert: {
            uniqueKey,
            car: carId,
            participants: [userId, ADMIN_ID],
            unreadCounts: new Map([
              [userId.toString(), 0],
              [ADMIN_ID.toString(), 0],
            ]),
          },
        },
        { new: true, upsert: true }
      );
    } catch (err) {
      // 🔥 handle race condition
      if (err.code === 11000) {
        conversation = await Conversation.findOne({ uniqueKey });
      } else {
        throw err;
      }
    }

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

// export const sendMessage = async (req, res) => {
//   try {
//     const { conversationId, text } = req.body;
//     const trimmedText = text?.trim();

//     if (!conversationId || !mongoose.Types.ObjectId.isValid(conversationId)) {
//       return res.status(400).json({
//         success: false,
//         message: "Valid conversationId is required",
//       });
//     }

//     if (!trimmedText) {
//       return res.status(400).json({
//         success: false,
//         message: "Message text is required",
//       });
//     }

//     const conversation = await Conversation.findById(conversationId);

//     if (!conversation) {
//       return res.status(404).json({
//         success: false,
//         message: "Conversation not found",
//       });
//     }

//     const userId = req.user._id.toString();

//     // ✅ strict participant check (admin included)
//     const isParticipant = conversation.participants.some(
//       (id) => id.toString() === userId
//     );

//     if (!isParticipant) {
//       return res.status(403).json({
//         success: false,
//         message: "Not authorized",
//       });
//     }

//     const message = await Message.create({
//       conversation: conversationId,
//       sender: req.user._id,
//       text: trimmedText,
//     });

//     // ✅ update conversation metadata
//     conversation.lastMessage = message._id;
//     conversation.updatedAt = new Date();

//     // ✅ safe Map handling
//     if (!conversation.unreadCounts) {
//       conversation.unreadCounts = new Map();
//     }

//     conversation.participants.forEach((id) => {
//       const strId = id.toString();
//       if (strId !== userId) {
//         const current = conversation.unreadCounts.get(strId) || 0;
//         conversation.unreadCounts.set(strId, current + 1);
//       }
//     });

//     await conversation.save();

//     // ✅ populate sender (better UX)
//     const populatedMessage = await message.populate("sender", "name avatar");

//     // 🔥 SOCKET EMIT
//     const io = req.app.get("io");
//     // io.to(conversationId.toString()).emit("newMessage", {
//     //   message: populatedMessage,
//     //   conversationId,
//     // });
//     io.to(conversationId.toString()).emit("newMessage", populatedMessage);

//     return res.status(201).json({
//       success: true,
//       data: populatedMessage,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };



const ADMIN_ID = process.env.ADMIN_ID; // ✅ single source of truth

// export const sendMessage = async (req, res) => {
//   try {
//     const { carId, conversationId, text } = req.body;

//     const senderId = req.user._id.toString();
//     const trimmedText = text?.trim();

//     // =========================
//     // VALIDATION
//     // =========================
//     if (!trimmedText) {
//       return res.status(400).json({
//         success: false,
//         message: "Message text is required",
//       });
//     }

//     if (!ADMIN_ID) {
//       return res.status(500).json({
//         success: false,
//         message: "Admin ID not configured",
//       });
//     }

//     if (senderId === ADMIN_ID.toString()) {
//       return res.status(400).json({
//         success: false,
//         message: "Admin cannot initiate chat",
//       });
//     }

//     // =========================
//     // RESOLVE carId SAFELY
//     // =========================
//     let finalCarId = carId;

//     if (!finalCarId && conversationId) {
//       const convo = await Conversation.findById(conversationId).select("car");
//       finalCarId = convo?.car;
//     }

//     if (!finalCarId || !mongoose.Types.ObjectId.isValid(finalCarId)) {
//       return res.status(400).json({
//         success: false,
//         message: "Valid carId is required",
//       });
//     }

//     // =========================
//     // BUILD PARTICIPANTS
//     // =========================
//     const participants = [senderId, ADMIN_ID.toString()].sort();
//     const uniqueKey = `${participants.join("_")}_${finalCarId}`;

//     // =========================
//     // FIND OR CREATE CONVERSATION
//     // =========================
//     let conversation = await Conversation.findOne({ uniqueKey });

//     if (!conversation) {
//       conversation = await Conversation.create({
//         participants,
//         car: finalCarId,
//         uniqueKey,
//         unreadCounts: {
//           [senderId]: 0,
//           [ADMIN_ID]: 0,
//         },
//       });
//     }

//     // =========================
//     // CREATE MESSAGE
//     // =========================
//     const message = await Message.create({
//       conversation: conversation._id,
//       sender: senderId,
//       text: trimmedText,
//     });

//     conversation.lastMessage = message._id;
//     conversation.updatedAt = new Date();

//     await conversation.save();

//     const populatedMessage = await message.populate(
//       "sender",
//       "name avatar"
//     );

//     // =========================
//     // SOCKET
//     // =========================
//     const io = req.app.get("io");
//     io.to(conversation._id.toString()).emit(
//       "newMessage",
//       populatedMessage
//     );

//     return res.status(201).json({
//       success: true,
//       data: {
//         message: populatedMessage,
//         conversationId: conversation._id,
//       },
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };




export const sendMessage = async (req, res) => {
  try {
    const { carId, conversationId, text } = req.body;

    const senderId = req.user._id;
    const adminId = process.env.ADMIN_ID;

    const trimmedText = text?.trim();

    // =========================
    // VALIDATION
    // =========================
    if (!trimmedText) {
      return res.status(400).json({
        success: false,
        message: "Message text is required",
      });
    }

    let receiverId;
    let conversation;

    // =========================
    // EXISTING CONVERSATION FLOW
    // =========================
    if (conversationId) {
      conversation = await Conversation.findById(conversationId);

      if (!conversation) {
        return res.status(404).json({
          success: false,
          message: "Conversation not found",
        });
      }

      // determine receiver dynamically
      receiverId = conversation.participants.find(
        (p) => p.toString() !== senderId.toString()
      );

    } else {
      // =========================
      // NEW / FIND CONVERSATION
      // =========================

      // decide receiver based on role
      if (req.user.role === "admin") {
        return res.status(400).json({
          success: false,
          message: "Admin cannot start conversation without conversationId",
        });
      }

      receiverId = adminId;

      conversation = await Conversation.findOne({
        car: carId || null,
        participants: { $all: [senderId, receiverId] },
      });

      if (!conversation) {
        conversation = await Conversation.create({
          participants: [senderId, receiverId],
          car: carId || null,
          unreadCounts: {
            [receiverId]: 1,
            [senderId]: 0,
          },
        });
      }
    }

    // =========================
    // CREATE MESSAGE
    // =========================
    const message = await Message.create({
      conversation: conversation._id,
      sender: senderId,
      text: trimmedText,
    });

    // =========================
    // UPDATE CONVERSATION
    // =========================
    conversation.lastMessage = message._id;
    conversation.updatedAt = new Date();

    // increment unread for receiver
    conversation.unreadCounts.set(
      receiverId.toString(),
      (conversation.unreadCounts.get(receiverId.toString()) || 0) + 1
    );

    await conversation.save();

    // =========================
    // POPULATE ONLY IF NEW
    // =========================
    let populatedConversation = null;

    if (!conversationId) {
      populatedConversation = await Conversation.findById(conversation._id)
        .populate("participants", "name")
        .populate("car", "title images")
        .lean();
    }

    // =========================
    // RESPONSE
    // =========================
    return res.status(201).json({
      success: true,
      message: {
        _id: message._id,
        text: message.text,
        sender: message.sender,
        createdAt: message.createdAt,
      },
      conversation: populatedConversation, // null if existing
    });

  } catch (error) {
    console.error("SendMessage Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to send message",
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


const userId = req.user._id.toString();
const isAdmin = req.user.role === "admin";

const isParticipant = conversation.participants.some(
  (id) => id.toString() === userId
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

export const markAsRead = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user._id.toString();

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    const isParticipant = conversation.participants.some(
      (id) => id.toString() === userId
    );

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    conversation.unreadCounts.set(userId, 0);

    await conversation.save();

    return res.status(200).json({
      success: true,
      message: "Marked as read",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};