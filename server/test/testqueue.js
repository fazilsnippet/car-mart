// file: test/testQueue.js
import { notificationQueue } from "../services/notification.queue.js";

// Test price-drop notification
await notificationQueue.add("price_drop", {
  carId: "69c15e76d8c41d8bb1e61fa7", // Use the same carId from your example
  newPrice: 177 // Lower price to trigger notification
});

console.log("✅ Price-drop job added to queue");