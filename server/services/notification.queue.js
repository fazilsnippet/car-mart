// file: queue/notification.queue.js
import { Queue } from "bullmq";


const redisConnection = {
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: Number(process.env.REDIS_PORT) || 6379,
  // ...(process.env.REDIS_USERNAME
  //   ? { username: process.env.REDIS_USERNAME }
  //   : {}),
  // ...(process.env.REDIS_PASSWORD
  //   ? { password: process.env.REDIS_PASSWORD }
  //   : {}),
};

export const notificationQueue = new Queue("notifications", {
  connection: redisConnection,
});