import dotenv from "dotenv";
import { createServer } from "http";
import connectDB from './db/index.js'
import app from "./app.js"
import { initSocket } from "./services/chat.socket.js";
import "./services/notication.worker.js"  // Import worker to start it
dotenv.config({
  path: "./.env"
});

connectDB()
  .then(() => {
    const port = process.env.PORT || 8001;
    const server = createServer(app);

    initSocket(server);

    server.listen(port, () => {
      console.log(`Server is running at ${port}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB connection failed...", err);
  });