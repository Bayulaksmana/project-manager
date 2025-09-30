import express from "express"
import authMiddleware from "../middleware/auth-middleware.js"
import { addComment, deleteComment, getAllComment, getCommentByPost } from "../controllers/comment.js"

const router = express.Router()

router.post("/:postId", authMiddleware, addComment)
router.get("/:postId", getCommentByPost)
router.get("/", getAllComment)
router.delete("/:postId", authMiddleware, deleteComment)


export default router