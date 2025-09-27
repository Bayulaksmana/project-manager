import mongoose from "mongoose";

const verificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Kader",
        required: true
    },
    token: {
        type: String,
        required: true
    },
    expiresAt: {
        type: Date,
        required: true,
    }
}, {
    timestamps: true
})

const Verification = mongoose.model("Verication", verificationSchema)

export default Verification