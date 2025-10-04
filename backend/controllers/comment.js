import { recordActivity } from "../libs/index.js"
import CommnentPost from "../models/comment-post.js"
import Post from "../models/storyspace.js"

const addComment = async (req, res) => {
    try {
        const { postId } = req.params
        const { content, parentComment, sticker, emoji, gif } = req.body
        const post = await Post.findById(postId)
        if (!post) return res.status(404).json({ message: 'Postingan tidak berjalan semestinya' })
        const comment = await CommnentPost.create({
            post: postId,
            author: req.user._id,
            content,
            sticker: sticker || null,
            emoji: emoji && Array.isArray(emoji) ? emoji : [],
            gif: gif || null,
            parentComment: parentComment || null,
        })
        await comment.populate('author', 'name email profilePicture')
        await Post.findByIdAndUpdate(postId, { $inc: { comments: 1 } }, { new: true })
        await recordActivity(req.user._id, "created_comment", "Storyspace", comment._id, {
            description: `${comment.author.name} (${comment.author.email}) Comment: ${comment.content}`,
        })
        res.status(201).json({ message: "Komentar tidak jelek, berhasil ditambahkan", comment })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Komentar mu jelek, sering ngelamun jorok -> controller -> comment.js" })
    }
}
const getCommentByPost = async (req, res) => {
    try {
        const { postId } = req.params
        const comments = await CommnentPost.find({ post: postId }).populate('author', 'name email profilePicture').populate('post', 'title imgUrl').sort({ createdAt: -1 })
        const commentMap = {}
        comments.forEach(comment => {
            comment = comment.toObject()
            comment.replies = []
            commentMap[comment._id] = comment
        })
        const nestedComments = []
        comments.forEach(comment => {
            if (comment.parentComment) {
                const parent = commentMap[comment.parentComment]
                if (parent) {
                    parent.replies.push(commentMap[comment._id])
                }
            } else {
                nestedComments.push(commentMap[comment._id])
            }
        })
        res.status(200).json({ message: "Komentar jelek berhasil ditampilkan", nestedComments })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Memuat komentas motivasi gagal, komentar jelek banyak! cek -> controller -> comment.js" })
    }
}
const getAllComment = async (req, res) => {
    try {
        const comments = await CommnentPost.find().populate('author', 'name email profilePicture').populate('post', 'title imgUrl').sort({ createdAt: -1 })
        const commentMap = {}
        comments.forEach(comment => {
            comment = comment.toObject()
            comment.replies = []
            commentMap[comment._id] = comment
        })
        const nestedComments = []
        comments.forEach(comment => {
            if (comment.parentComment) {
                const parent = commentMap[comment.parentComment]
                if (parent) {
                    parent.replies.push(commentMap[comment._id])
                }
            } else {
                nestedComments.push(commentMap[comment._id])
            }
        })
        res.status(200).json({ message: "Komentar mungkin jelek semua, tapi ini dia", nestedComments })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Semua komentar disini jelek! cek -> controller -> comment.js" })
    }
}
const deleteComment = async (req, res) => {
    try {
        const comment = await CommnentPost.findById(req.params.postId).populate('author', 'name email').populate('post', 'title imgUrl comments')
        if (!comment) return res.status(404).json({ message: 'Komentar ini hilang entah kemana' })
        const deletedReplies = await CommnentPost.deleteMany({ parentComment: comment._id });
        const totalDeleted = 1 + deletedReplies.deletedCount;
        await CommnentPost.deleteOne({ _id: comment._id })
        if (comment.post) {
            await Post.findByIdAndUpdate(
                comment.post._id,
                { $inc: { comments: -totalDeleted } },
                { new: true }
            );
        }
        recordActivity(req.user._id, "deleted_comment", "Storyspace", comment._id,
            { description: `${comment.author.name} (${comment.author.email}) Menghapus: ${comment.content}` }
        );
        res.status(200).json({
            message: `Komentar berhasil dibumi hanguskan (${totalDeleted} komentar jelek dihapus)!`
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Gagal menghapus komentar jelek, pastikan Anda hebat! cek -> controller -> comment.js" })
    }
}

export { addComment, getCommentByPost, getAllComment, deleteComment }