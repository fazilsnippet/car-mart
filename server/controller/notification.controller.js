// file: controllers/notification.controller.js
import { notificationQueue } from "../services/notification.queue.js";
import { Notification } from "../models/Notification.model.js";

export const sendBroadcast = async (req, res) => {
  const { title, message } = req.body;

  await notificationQueue.add("broadcast", { title, message });

  res.json({ success: true });
};

// file: controllers/notification.controller.js

export const getUserNotifications = async (req, res) => {
  try {
    const userId = req.user._id; // from auth middleware

    const notifications = await Notification.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(20); // pagination later

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};