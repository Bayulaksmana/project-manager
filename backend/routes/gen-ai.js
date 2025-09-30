import express from "express";
import { generateComment, generateStory, generateStoryPost, generateSummary } from "../controllers/ai-controller.js";

const router = express.Router()

router.post("/generate", generateStory)
router.post("/generate-story", generateStoryPost)
router.post("/generate-reply", generateComment)
router.post("/generate-summary", generateSummary)

export default router