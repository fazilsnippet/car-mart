// routes/test.route.js
import express from "express";
import { notificationQueue } from "../services/notification.queue.js";

const testRouter = express.Router();

testRouter.post("/test-notification", async (req, res) => {
  try {
    const { userId, message,carId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "userId required" });
    }

    await notificationQueue.add("new-message", {
      userId,
      message: message || "Test message from Postman",
carId,
    });

    return res.json({ success: true, message: "Job added to queue" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to add job" });
  }
});

export default testRouter;