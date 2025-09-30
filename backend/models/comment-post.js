import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Posts", required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "Kader", required: true },
    content: { type: String, required: true, trim: true },
    parentComment: { type: mongoose.Schema.Types.ObjectId, ref: "CommentPost", default: null },
    sticker: { type: String, default: null }, // URL atau nama stiker
    emoji: [{ type: String }], // array emoji (misalnya ["😂", "🔥"])
    gif: { type: String, default: null }, // URL GIF
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
},{
    timestamps: true
})

const CommnentPost = mongoose.model("CommentPost", commentSchema)
export default CommnentPost
