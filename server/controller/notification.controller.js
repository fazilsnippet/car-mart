// file: controllers/notification.controller.js
import { notificationQueue } from "../services/notification.queue.js";
import { Notification } from "../models/Notification.model.js";

export const sendBroadcast = async (req, res) => {
  const { title, message } = req.body;

  await notificationQueue.add("broadcast", { title, message });

  res.json({ success: true });
};

// file: controllers/notification.controller.js

export const getUserNotifications = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const pageNum = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limitNum = Math.max(parseInt(req.query.limit, 10) || 20, 1);

    const [notifications, unreadCount] = await Promise.all([
      Notification.find({ user: userId })
        .select("title message read type data createdAt")
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum)
        .lean(),

      Notification.countDocuments({
        user: userId,
        read: false,
      }),
    ]);

    res.status(200).json({
      success: true,
      data: notifications,
      unreadCount,
      page: pageNum,
    });

  } catch (error) {
    next(error);
  }
};

export const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user._id;

    const count = await Notification.countDocuments({
      user: userId,
      read: false
    });

    res.json({ success: true, count });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await Notification.findOneAndUpdate(
      { _id: id, user: req.user._id },
      { read: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    res.json({ success: true });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};