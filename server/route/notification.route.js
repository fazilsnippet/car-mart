// file: routes/notification.routes.js
import express from "express";
import { verifyJWT } from "../middleware/jwt.middleware.js";
import { sendBroadcast , getUserNotifications,getUnreadCount, markAsRead} from "../controller/notification.controller.js";

const notificationRouter = express.Router();

// 🔹 Admin → All Users (Broadcast)
notificationRouter.post("/broadcast", sendBroadcast);
notificationRouter.get("/",verifyJWT, getUserNotifications);
notificationRouter.get("/unread-count", verifyJWT, getUnreadCount);
notificationRouter.patch("/:id/read", verifyJWT, markAsRead);
export default notificationRouter;

