import express from "express";
import authenticateUser from "../middleware/auth-middleware.js";
import { changePassword, getUserProfile, updateUserProfile, } from "../controllers/user.js";
import { z } from "zod";
import { validateRequest } from "zod-express-middleware";

const router = express.Router();

router.get("/", authenticateUser, getUserProfile);

router.put("/", authenticateUser, validateRequest({
    body: z.object({ name: z.string(), profilePicture: z.string().optional(), }),
}), updateUserProfile);

router.put("/change-password", authenticateUser, validateRequest({
    body: z.object({ currentPassword: z.string(), newPassword: z.string(), confirmPassword: z.string(), }),
}), changePassword);

export default router;