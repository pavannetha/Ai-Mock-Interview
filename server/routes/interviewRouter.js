import express from "express";
import { liveInterview } from "../controller/auth/interview/liveInterview.js";
import { Interview } from "../models/Interview.js";
import { history } from "../controller/auth/interview/history.js";

const router = express.Router();

router.post("/liveInterview", liveInterview);

router.get("/history", history);

export default router;
