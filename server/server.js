import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import authRouter from "./routes/auth.js";
import userRouter from "./routes/user.js";
import interviewRouter from "./routes/interviewRouter.js";
import { authmiddleware } from "./middlewares/authmiddleware.js";
import http from "http";
import { Server } from "socket.io";
import interviewSocket from "./socket/interviewSoket.js";
import jwt from "jsonwebtoken";
import { rejects } from "assert";
import { error } from "console";
import multer from "multer";
import fs from "fs";
import path from "path";
import { pipeline } from "stream/promises";
import { Readable, Transform } from "stream";
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
app.use("/user", authmiddleware, userRouter);
app.use("/interview", authmiddleware, interviewRouter);

//create a io middleware to get the userId and add in socket object

// create new server for socket.io
const server = http.createServer(app);

// create new intance for the socket.io by providing the server
const io = new Server(server, {
  cors: "*",
  methods: ["GET", "POST"],
});
io.use((socket, next) => {
  const token = socket.handshake.auth?.token;

  if (!token) {
    return next(new Error("Token not provided"));
  }

  try {
    const userData = jwt.verify(token, process.env.JWT_SECRETKEY);
    socket.userId = userData.userId;
    next();
  } catch (err) {
    console.log(err.message, "error while extracting token");
    next(new Error("Invalid token"));
  }
});

// once server is establised exicute the callback
io.on("connection", (socket) => {
  console.log(socket.userId, "userId in socket");

  interviewSocket(socket);
});

// change app to server

server.listen(process.env.PORT, () => {
  console.log(`server is running at ${process.env.PORT} `);
});
