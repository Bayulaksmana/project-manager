import express from "express"
import { validateRequest } from "zod-express-middleware"
import { emailSchema, loginSchema, registerSchema, resetPasswordSchema, verifyEmailSchema } from "../libs/validate-schema.js"
import { loginUser, registerUser, resetPasswordRequest, verifyEmail, verifyResetTokenPassword } from "../controllers/auth-controller.js"
import upload from "../middleware/upload-middleware.js"

const   router = express.Router()
router.post("/register", validateRequest
    ({ body: registerSchema, }),
    registerUser
)
router.post("/login", validateRequest
    ({ body: loginSchema, }),
    loginUser
)
router.post("/verify-email", validateRequest
    ({ body: verifyEmailSchema, }),
    verifyEmail
)
router.post("/reset-password-request", validateRequest
    ({ body: emailSchema, }),
    resetPasswordRequest
)
router.post("/reset-password", validateRequest
    ({ body: resetPasswordSchema, }),
    verifyResetTokenPassword
)

router.post("/upload-image", upload.single("image"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
    }
    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
    res.status(200).json({ imageUrl });
    console.log(imageUrl);
})

export default router

