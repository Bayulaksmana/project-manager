import Post from "../models/storyspace.js"

const getStoryspaces = async (req, res) => {
    try {
        const storyspace = await Post.find().sort({ createdAt: -1 })
        res.status(201).json(storyspace)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server mengalami kekacauan di backend controllers -> getStoryspace -> storyspace.js" })
    }
}

export { getStoryspaces }