import mongoose from "mongoose";
import { user } from "../../models/userModel.js";
import bcrypt from "bcryptjs";

export async function signup(req, res) {
  const { name, email, age, phone, password } = req.body;
  try {
    //check whether user exist in valid user collection
    const isValid = await mongoose.connection
      .collection(process.env.VALID_USER_COLLECTION)
      .findOne({ email });
    if (!isValid) {
      return res.status(400).json({ message: "user does not exist" });
    }
    const userAlreadyExist = await user.findOne({ email });
    // chexk whether user exist alredy in user collection
    console.log(userAlreadyExist);
    if (userAlreadyExist) {
      return res
        .status(400)
        .json({ message: "user already exist in user collection" });
    }
    // password hashing using bcrypt
    req.body.password = await bcrypt.hash(password, 10);
    const newUser = await user.create(req.body);
    res.status(201).json({ message: "ok", newUser });
  } catch (error) {
    console.log(error.message);
  }
}
