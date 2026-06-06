import express from "express";
import { liveInterview } from "../controller/auth/interview/liveInterview.js";

const router = express.Router();

router.post("/liveInterview", liveInterview);

export default router;
