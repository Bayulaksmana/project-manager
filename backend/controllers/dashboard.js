import CommnentPost from "../models/comment-post.js"
import Post from "../models/storyspace.js"
import User from "../models/user.js"

const getDashboardSummary = async (req, res) => {
    try {
        const [totalPosts, drafts, published, totalComments, aiGenerated, totalUsers] = await Promise.all([
            Post.countDocuments(),
            Post.countDocuments({ isDraft: 'true' }),
            Post.countDocuments({ isDraft: 'false' }),
            CommnentPost.countDocuments(),
            Post.countDocuments({ isAiGenerated: true }),
            User.countDocuments()
        ])
        const totalViewsAgg = await Post.aggregate([
            { $group: { _id: null, total: { $sum: "$views" } } }
        ])
        const totalLikesAgg = await Post.aggregate([
            { $group: { _id: null, total: { $sum: "$likes" } } }
        ])
        const views = totalViewsAgg[0]?.total || 0
        const likes = totalLikesAgg[0]?.total || 0
        const trendingPosts = await Post.find({ isDraft: false, isDeleted: false }).select('title imgUrl views likes').sort({ views: -1, likes: -1 }).limit(5)
        const recentComments = await CommnentPost.find().populate('post', 'title imgUrl').populate('author', 'username profilePicture').sort({ createdAt: -1 }).limit(5)
        const user = await User.find().sort({ createdAt: -1 }).limit(5).select('name profilePicture email role isEmailVerified createdAt')
        const tagUsage = await Post.aggregate([
            { $unwind: "$tags" },
            { $group: { _id: "$tags", count: { $sum: 1 } } },
            { $project: { tag: "$_id", count: 1, _id: 0 } },
            { $sort: { count: -1 } },
        ])
        res.json({stats:{totalPosts, drafts, published, views, likes, totalComments, aiGenerated, totalUsers}, trendingPosts, recentComments, user, tagUsage})
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Terjadi baku pukul di serer -> dashboard.js' })
    }
}

export { getDashboardSummary }