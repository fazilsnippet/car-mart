// file: routes/chat.routes.js
import express from "express";
import {
  startConversation,
  getMessages
} from "../controller/chat.controller.js";

const chatRouter = express.Router();

chatRouter.post("/start", startConversation);
chatRouter.get("/:conversationId/messages", getMessages);

export default chatRouter;