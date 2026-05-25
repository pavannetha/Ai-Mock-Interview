import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
// import jsonwebtoken from "jsonwebtoken";
// import cookieParser from "cookie-parser";

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

const app = express();

app.listen(process.env.PORT, () => {
  console.log("server is running at 4000 ");
});
