import express from "express";
import { signup } from "../controller/auth/signup.js";

const router = express.Router();

router.post("/signup", signup);

router.post("/login", (req, res) => {
  console.log("login api hitting in routes");
});

export default router;
