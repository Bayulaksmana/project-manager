import express from "express"
import authMiddleware from "../middleware/auth-middleware.js"
import { createPost, deletePost, getAllPost, getPostBySlug, getPostByTag, getStoryspaces, getTrendingPosts, incrementViewCount, likePost, restorePost, searchPosts, updatePost } from "../controllers/storyspace.js"

const router = express.Router()

const adminOnly = (req, res, next) => {
    if(req.user && req.user.role === 'admin') {
        next()
    } else {
        return res.status(403).json({ message: 'Access denied' })
    }
}
router.get("/get", getStoryspaces)
router.post("/", authMiddleware, adminOnly, createPost)
router.get("/", getAllPost)
router.get("/slug/:slug", getPostBySlug),
router.get("/tag/:tag", getPostByTag),
router.get("/search", searchPosts),
router.get("/trending", getTrendingPosts),
router.post("/:id/view", incrementViewCount),
router.post("/:id/like", authMiddleware, likePost),
router.put("/:id", authMiddleware, adminOnly, updatePost),
router.delete("/:id", authMiddleware, adminOnly, deletePost)
router.patch("/:id", authMiddleware, adminOnly, restorePost)


export default router