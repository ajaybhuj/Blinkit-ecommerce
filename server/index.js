import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";
import connectDB from "./config/connnectDB.js";
import userRouter from "./routes/user.route.js";
const app = express();
app.use(
  cors({
    credentials: true,
    origin: process.env.FRONTEND_URL,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(morgan());
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);
const PORT = process.env.PORT || 8080;

app.get("/", (req, res) => {
  res.json({
    message: "server is running ",
  });
});
app.use("/api/user", userRouter);
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`server is running on ${PORT}`);
  });
});
