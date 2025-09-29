import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true, select: false },
    name: { type: String, required: true, trim: true },
    profilePicture: { type: String },
    isEmailVerified: { type: Boolean, default: false },
    lastLogin: { type: Date },
    is2FAEnabled: { type: Boolean, default: false },
    twoFAOtp: { type: String, select: false },
    twoFAOtpExpired: { type: Date, select: false },
    bio: { type: String, default: "" },
    role: { type: String, enum: ["admin", "member", "owner", "viewer"], default: "member" },
}, {
    timestamps: true
})

const User = mongoose.model("Kader", userSchema)
export default User
