import mongoose, { Schema } from "mongoose";

const workspaceSchema = new Schema({
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true, },
    color: { type: String, default: "#FF5733" },
    owner: { type: Schema.Types.ObjectId, ref: "Kader", required: true },
    members: [
        {
            user: { type: Schema.Types.ObjectId, ref: "Kader" },
            role: {
                type: String,
                enum: ["admin", "member", "owner", "viewer"],
                default: "member"
            },
            joinedAt: { type: Date, default: Date.now }
        }
    ],
    projects: [{ type: Schema.Types.ObjectId, ref: "Projects" }]
}, {
    timestamps: true
})

const Workspace = mongoose.model("Workspace", workspaceSchema)
export default Workspace