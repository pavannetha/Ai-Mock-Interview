import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import authRouter from "./routes/auth.js";
// import jsonwebtoken from "jsonwebtoken";
// import cookieParser from "cookie-parser";

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("DB connected");
  })
  .catch((err) => {
    console.log(err.message);
  });

app.use("/auth", authRouter);

app.listen(process.env.PORT, () => {
  console.log("server is running at 4000 ");
});
