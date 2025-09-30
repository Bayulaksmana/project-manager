import express from "express"
import authRoutes from "./auth.js"
import workspaceRoutes from "./workspace.js"
import storyspaceRoutes from "./storyspace.js"
import projectRoutes from "./project.js"
import taskRoutes from "./task.js"
import userRoutes from "./user.js";
import aiRoutes from "./gen-ai.js";
import homeRoutes from "./home.js";
import commentRoutes from "./comment.js";
import dashboardRoutes from "./dashboard.js";

const router = express.Router()

router.use("/auth", authRoutes)
router.use("/workspaces", workspaceRoutes)
router.use("/storyspaces", storyspaceRoutes)
router.use("/projects", projectRoutes)
router.use("/tasks", taskRoutes)
router.use("/users", userRoutes);
router.use("/homepage", homeRoutes);
router.use("/ai", aiRoutes)
router.use("/comment", commentRoutes)
router.use("/dashboard", dashboardRoutes)


export default router

