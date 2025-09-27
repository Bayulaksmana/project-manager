import jwt from "jsonwebtoken"
import User from "../models/user.js"

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1]
        if (!token) {
            return res.status(401).json({ message: "Token tidak ditemukan, cek diwarung auth middleware" })
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findById(decoded.userId)
        if (!user) {
            return res.status(401).json({ message: "User tidak terdaftar, cek diwarung auth middleware" })
        }
        req.user = user
        next()
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Terjadi kerusakan backend -> auth-middleware" })
    }
}

export default authMiddleware