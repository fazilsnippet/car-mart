import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import mongoose from "mongoose";
import { DB_NAME } from "../constans.js";

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017";
  const dbName = process.env.DB_NAME || "car-mart";

  try {
    const connectionInstance = await mongoose.connect(`${uri}/${dbName}`);
    console.log(`mongo db connected successfully ${connectionInstance.connection.host}`);
  } catch (error) {
    console.error(error, "connection failed");
    process.exit(1);
  }
};

export default connectDB;