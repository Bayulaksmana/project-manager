import express from "express"
import authMiddleware from "../middleware/auth-middleware.js"
import { getStoryspaces } from "../controllers/storyspace.js"

const router = express.Router()

router.get("/", authMiddleware, getStoryspaces)

export default router