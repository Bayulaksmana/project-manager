import mongoose, { Schema } from "mongoose"

const postSchema = new Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User"},
        imgUrl: { type: String, default: null },
        title: { type: String, required: true, },
        slug: { type: String, required: true, unique: true, },
        desc: { type: String, },
        category: { type: String, default: "general" },
        content: { type: String, required: true, },
        isFeatured: { type: Boolean, default: false, },
        visit: { type: Number, default: 0, },
        author: { type: Schema.Types.ObjectId, ref: "Kader", required: true },
        tags: [{ type: String }],
        isDraft: { type: Boolean, default: false },
        views: { type: Number, default: 0 },
        likes: { type: Number, default: 0 },
        dislikes: { type: Number, default: 0 },
        comments: { type: Number, default: 0 },
        generatedImages: [{ type: String }],
        generatedByAI: { type: Boolean, default: false },
        isDeleted: { type: Boolean, default: false },
        deletedAt: { type: Date, default: null },
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