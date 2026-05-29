import express from "express";
import { signup } from "../controller/auth/signup.js";
import { login } from "../controller/auth/login.js";

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

export default router;
