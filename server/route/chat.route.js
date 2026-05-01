// file: routes/chat.routes.js
import express from "express";
import {
  startConversation,
  sendMessage,
  getMessages,
  getConversations
} from "../controller/chat.controller.js";
import { verifyJWT } from "../middleware/jwt.middleware.js";

const chatRouter = express.Router();

chatRouter.post("/start", verifyJWT, startConversation);
chatRouter.post("/message", verifyJWT, sendMessage);
chatRouter.get("/messages/:conversationId", verifyJWT, getMessages);
// chatRouter.get("/:conversationId/messages", verifyJWT, getMessages);
// chatRouter.get("/", verifyJWT, getConversations);
chatRouter.get("/conversations", verifyJWT, getConversations);

export default chatRouter;