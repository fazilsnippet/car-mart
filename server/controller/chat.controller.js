import mongoose from "mongoose";
import { Car } from "../models/Car.model.js";
import { Conversation } from "../models/Conversation.model.js";
import { Message } from "../models/Message.model.js";

export const startConversation = async (req, res) => {
  try {
    const { carId } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    if (!carId || !mongoose.Types.ObjectId.isValid(carId)) {
      return res.status(400).json({
        success: false,
        message: "Valid carId is required"
      });
    }

    const carExists = await Car.exists({ _id: carId, lifecycleStatus: "ACTIVE" });

    if (!carExists) {
      return res.status(404).json({
        success: false,
        message: "Car not found or inactive"
      });
    }

    // const convo = await Conversation.findOneAndUpdate(
    //   { user: userId, car: carId },
    //   { $setOnInsert: { user: userId, car: carId } },
    //   { new: true, upsert: true }
    // );

    const convo = await Conversation.findOneAndUpdate(
  { user: userId, car: carId },
  { $set: { lastMessageAt: new Date() }, $setOnInsert: { user: userId, car: carId } },
  { returnDocument: "after", upsert: true }
);

    return res.status(200).json(convo);
  } catch (error) {
    if (error?.code === 11000) {
      const convo = await Conversation.findOne({
        user: req.user?._id,
        car: req.body?.carId
      });

      if (convo) {
        return res.status(200).json(convo);
      }
    }

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const sendMessage = async (req, res) => {
  const session = await mongoose.startSession();

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

    session.startTransaction();

    const conversation = await Conversation.findById(conversationId).session(session);

    if (!conversation) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: "Conversation not found"
      });
    }

    const isAdmin = req.user.role === "admin";

    if (!isAdmin && conversation.user.toString() !== req.user._id.toString()) {
      await session.abortTransaction();
      return res.status(403).json({
        success: false,
        message: "Not authorized to send messages in this conversation"
      });
    }

    const sender = isAdmin ? "admin" : "user";

    const [message] = await Message.create(
      [
        {
          conversation: conversationId,
          sender,
          text: trimmedText
        }
      ],
      { session }
    );

    await Conversation.findByIdAndUpdate(
      conversationId,
      {
        lastMessage: message._id,
        updatedAt: new Date()
      },
      { session }
    );

    await session.commitTransaction();

    return res.status(201).json({
      success: true,
      data: message
    });
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }

    return res.status(500).json({
      success: false,
      message: error.message
    });
  } finally {
    session.endSession();
  }
};
export const getConversations = async (req, res) => {
  try {
    const userId = req.user._id;
    const isAdmin = req.user.role === "admin";

    const conversations = await Conversation.find(
      isAdmin ? {} : { user: userId }
    )
      .populate("user", "name email")
      .populate("car", "title price images")
      .populate("lastMessage", "text sender createdAt")
      .sort({ updatedAt: -1 })
      .lean();

    return res.json({
      success: true,
      data: conversations
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

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;

    if (!mongoose.Types.ObjectId.isValid(conversationId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid conversationId"
      });
    }

    const conversation = await Conversation.findById(conversationId).lean();

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found"
      });
    }

    const isAdmin = req.user.role === "admin";

    if (!isAdmin && conversation.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized"
      });
    }

    const skip = (page - 1) * limit;

    const messages = await Message.find({ conversation: conversationId })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: messages,
      page,
      limit
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
