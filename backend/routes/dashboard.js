import express from "express"
import authMiddleware from "../middleware/auth-middleware.js"
import { getDashboardSummary } from "../controllers/dashboard.js"

const router = express.Router()


const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next()
    } else {
        return res.status(403).json({ message: 'Access denied' })
    }
}

router.get("/", authMiddleware, getDashboardSummary)


export default router