import cors from "cors"
import dotenv from "dotenv"
import express from "express"
import mongoose from "mongoose"
import morgan from "morgan"
import routes from "./routes/index.js"

dotenv.config()
const server = express()
server.disable("etag")
server.use(cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: ["Content-Type", "Authorization"],
}))
server.use(morgan("dev"))
mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("Akses ke database sukses.✅ on MonggoDB Cluster"))
    .catch((err) => console.log("Akses ke database Error. ❌ on server lines 18 DB:", err))
server.use(express.json())
const PORT = process.env.PORT

server.get("/", async (req, res) => {
    try {
        res.status(200).json({
            message: "Dega Nion Don Moyokapit Project API",
        })
    } catch (error) {
        res.status(500).json({
            message: "Terjadi masalah di server, harap periksa segera!",
            error: error.message
        })
    }
})

server.use("/api-v1", routes)

// error middleware
server.use((err, req, res, next) => {
    console.log(err.stack)
    res.status(500).json({ message: "Internal Server Erorr! Pastikan server jalan di VM" })
})
// not found middleware
server.use((req, res) => {
    res.status(404).json({
        message: "Url endpoint tidak tersedia di server! Periksa routingan yang ada.."
    })
})

server.listen(PORT, () => {
    console.log(`Server is runing men ✅ on http://localhost:${PORT}`)
})