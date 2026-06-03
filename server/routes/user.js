import express from "express";
import { profileUpdate } from "../controller/auth/userUpdate/profileUpdate.js";

const router = express.Router();

router.patch("/updateProfile", profileUpdate);

export default router;
