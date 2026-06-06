import express from "express";
import { profileUpdate } from "../controller/auth/userUpdate/profileUpdate.js";
import { authmiddleware } from "../middlewares/authmiddleware.js";

const router = express.Router();

router.patch("/updateProfile", authmiddleware, profileUpdate);

export default router;
