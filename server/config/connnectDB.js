import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
if (!process.env.MONGODB_URI) {
  throw new Error("please provide a MONGODB_URI in env file");
}

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("connection established");
  } catch (error) {
    console.log("mongodb connection failed", error);
    process.exit(1);
  }
}

export default connectDB;
