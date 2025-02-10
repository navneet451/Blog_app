import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import postRoutes from "./routes/post.route.js";
import commentRoutes from "./routes/comment.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();
const app = express();
const PORT = 3000;
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "https://blog-app-2-hh1j.onrender.com", credentials: true }));

app.use("/api", userRoutes);
app.use("/api", authRoutes);
app.use("/api", postRoutes);
app.use("/api/comment", commentRoutes);

app.use((err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    seccess: false,
    statusCode,
    message,
  });
});

main()
  .then((res) => {
    console.log("Connected! to mongo_DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  // console.log(process.env.MONGO_URL);
  await mongoose.connect(process.env.MONGO_URL);
}

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
