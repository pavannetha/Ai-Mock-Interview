import mongoose from "mongoose";
import { MAX } from "uuid";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    min: 6,
  },
  age: {
    type: Number,
    min: 14,
    max: 70,
  },
  phone: {
    type: String,
  },
});

export const user = mongoose.model("User", userSchema);
