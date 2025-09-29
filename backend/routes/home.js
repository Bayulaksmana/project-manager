import express from "express"
import { getHomeData } from "../controllers/homepage.js"

const route = express.Router()

route.get("/", getHomeData)


export default route