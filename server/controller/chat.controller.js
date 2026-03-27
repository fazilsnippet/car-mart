// file: controllers/chat.controller.js
import { Conversation } from "../models/Conversation.model.js";
import { Message } from "../models/Message.model.js";

export const startConversation = async (req, res) => {
  const { carId } = req.body;
  const userId = req.user._id;

  let convo = await Conversation.findOne({ user: userId, car: carId });

  if (!convo) {
    convo = await Conversation.create({ user: userId, car: carId });
  }

  res.json(convo);
};

export const getMessages = async (req, res) => {
  const messages = await Message.find({
    conversation: req.params.conversationId
  }).sort({ createdAt: 1 });

  res.json(messages);
};