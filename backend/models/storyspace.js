import mongoose, { Schema } from "mongoose"

const postSchema = new Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        img: {
            type: String,
        },
        title: {
            type: String,
            required: true,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
        },
        desc: {
            type: String,
        },
        category: {
            type: String,
            default: "general"
        },
        content: {
            type: String,
            required: true,
        },
        isFeatured: {
            type: Boolean,
            default: false,
        },
        visit: {
            type: Number,
            default: 0,
        },
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
    },
    { timestamps: true }
);

const Post = mongoose.model("Posts", postSchema)
export default Post