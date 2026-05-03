// file: queue/notification.queue.js
import { Queue } from "bullmq";


const redisConnection = {
  host: process.env.REDIS_HOST ,
  port: Number(process.env.REDIS_PORT) 
};

export const notificationQueue = new Queue("notifications", {
  connection: redisConnection,
});