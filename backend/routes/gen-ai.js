import express from "express";
import { getAiData } from "../controllers/ai-controller.js";

const router = express.Router()

router.get("/", getAiData)

export default router