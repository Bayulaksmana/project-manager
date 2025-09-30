import { recordActivity } from "../libs/index.js"
import Post from "../models/storyspace.js"

const createPost = async (req, res) => {
    try {
        const { title, content, imgUrl, tags, isDraft, generatedByAI } = req.body
        const slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
        const newPost = new Post({
            title,
            slug,
            content,
            imgUrl,
            tags,
            isDraft,
            generatedByAI,
            author: req.user._id,
        })
        await newPost.save()
        await recordActivity(req.user._id, "created_story", "Storyspace", newPost._id, {
            description: `Create story ${newPost.title}`,
        })
        return res.status(201).json({ newPost, message: 'Postingan berhasil ditambahkan, Anda mojago!' })
    } catch (error) {
        return res.status(500).json({ message: 'Lagi kacau di backend -> storyspace.js / controller', error: error.message })
    }
}
const updatePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate('author', 'name email')
        if (!post) return res.status(404).json({ message: 'Postingan ini ajaib jadi goib' })
        if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') { return res.status(403).json({ message: "Anda terdeteksi belum tervaksin omicondro" }) }
        const updateData = req.body
        if (updateData.title) {
            updateData.slug = updateData.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
        }
        if (updateData.isDraft === false && post.isDraft === true) {
            updateData.publishedAt = new Date()
        }
        const changedFields = {};
        Object.keys(updateData).forEach((key) => {
            if (post[key]?.toString() !== updateData[key]?.toString()) {
                changedFields[key] = {
                    from: post[key],
                    to: updateData[key],
                };
            }
        });
        const updatedPost = await Post.findByIdAndUpdate(req.params.id, updateData, { new: true })
        if (Object.keys(changedFields).length > 0) {
            const description = `Update story dengan perubahan: ${Object.entries(changedFields)
                .map(([field, { from, to }]) => `${field} dari "${from}" → "${to}"`)
                .join(", ")}`;
            await recordActivity(
                req.user._id,
                "updated_story",
                "Storyspace",
                post._id,
                { description }
            );
        }
        return res.status(200).json({ updatedPost, message: 'Postingan berhasil diupdate, Anda keren!' })
    } catch (error) {
        return res.status(500).json({ message: 'Lagi kacau di backend -> storyspace.js / controller', error: err.message })
    }
}
const getAllPost = async (req, res) => {
    const status = req.query.status || 'published';
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;
    let filter = {};
    if (status === "published") {
        filter = { isDraft: false, isDeleted: false };
    } else if (status === "draft") {
        filter = { isDraft: true, isDeleted: false };
    } else if (status === "deleted") {
        filter = { isDeleted: true };
    } else if (status === "all") {
        // tampilkan semua, tanpa filter
        filter = {};
    } else {
        // default -> hanya yang belum dihapus
        filter = { isDeleted: false };
    }
    const posts = await Post.find(filter)
        .populate("author", "name email")
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit);
    const [totalCount, allCount, publishedCount, draftCount] = await Promise.all([
        Post.countDocuments({}), // semua
        Post.countDocuments({ isDraft: false, isDeleted: false }),
        Post.countDocuments({ isDraft: true, isDeleted: false }),
        Post.countDocuments({ isDeleted: true })
    ]);

    res.status(200).json({ posts, page, totalPages: Math.ceil(totalCount / limit), totalCount, counts: { all: totalCount, published: allCount, draft: draftCount } });
    try {
    } catch (error) {
        return res.status(500).json({ message: 'Lagi kacau di backend -> storyspace.js / controller', error: err.message })
    }
}
const getPostBySlug = async (req, res) => {
    const post = await Post.findOne({ slug: req.params.slug }).populate("author", "name email")
    if (!post) return res.status(404).json({ message: 'Postingan ini ajaib jadi goib' })
    res.status(200).json({ post })
    try {
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Lagi kacau di backend -> storyspace.js / controller', error: err.message })
    }
}
const getPostByTag = async (req, res) => {
    try {
        const posts = await Post.find({ tags: req.params.tag, isDraft: false, isDeleted: false }).populate("author", "name email").sort({ createdAt: -1 })
        res.status(200).json({ posts })
    } catch (error) {
        return res.status(500).json({ message: 'Lagi kacau di backend -> storyspace.js / controller', error: err.message })
    }
}
const searchPosts = async (req, res) => {
    try {
        const q = req.query.q;
        const posts = await Post.find({
            isDraft: false,
            isDeleted: false,
            $or: [
                { title: { $regex: q, $options: 'i' } },
                { desc: { $regex: q, $options: 'i' } },
                { content: { $regex: q, $options: 'i' } },
                { tags: { $regex: q, $options: 'i' } },
            ]
        }).populate("author", "name email").sort({ createdAt: -1 })
        res.status(200).json({ posts })
    } catch (error) {
        return res.status(500).json({ message: 'Lagi kacau di backend -> storyspace.js / controller', error: error.message })
    }
}
const getTrendingPosts = async (req, res) => {
    try {
        const post = await Post.find({ isDraft: false, isDeleted: false }).sort({ views: -1 }).limit(5).populate("author", "name email")
        res.status(200).json({ post })
    } catch (error) {
        return res.status(500).json({ message: 'Lagi kacau di backend -> storyspace.js / controller', error: err.message })
    }
}
const incrementViewCount = async (req, res) => {
    try {
        await Post.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } }, { new: true })
        res.status(200).json({ message: 'View count bertambah' })
    } catch (error) {
        return res.status(500).json({ message: 'Lagi kacau di backend -> storyspace.js / controller', error: err.message })
    }
}
const likePost = async (req, res) => {
    try {
        await Post.findByIdAndUpdate(req.params.id, { $inc: { likes: 1 } }, { new: true })
        res.status(200).json({ message: 'Like bertambah' })
    } catch (error) {
        return res.status(500).json({ message: 'Lagi kacau di backend -> storyspace.js / controller', error: err.message })
    }
}
const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate('author', 'name email')
        if (!post) return res.status(404).json({ message: 'Postingan ini ajaib jadi goib' })
        post.isDeleted = true;
        post.deletedAt = new Date();
        await post.save();
        await recordActivity(req.user._id, "deleted_story", "Storyspace", post._id, {
            description: `Dia kira sudah di hapus permanent. Judulnya: ${post.title}`,
        });
        return res.status(200).json({ message: 'Postingan hilang dari dunia ini, Nolapat!' })
    } catch (error) {
        return res.status(500).json({ message: 'Lagi kacau di backend -> storyspace.js / controller', error: err.message })
    }
}
const restorePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: "Postingan tidak ditemukan" });
        }
        // restore
        post.isDeleted = false;
        post.deletedAt = null;
        await post.save();
        await recordActivity(req.user._id, "restored_story", "Storyspace", post._id, {
            description: `Anda dibayar berapa untuk me-Restore story ini : ${post.title}`,
        });
        res.status(200).json({ message: "Story berhasil direstore kembali" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Terjadi kesalahan server" });
    }
};
const getStoryspaces = (req, res) => {
    try {
    } catch (error) {
        return res.status(500).json({ message: 'Lagi kacau di backend -> storyspace.js / controller', error: err.message })
    }
}
export { createPost, getAllPost, getPostBySlug, getPostByTag, searchPosts, getTrendingPosts, incrementViewCount, likePost, updatePost, deletePost, getStoryspaces, restorePost }