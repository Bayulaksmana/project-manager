import Carousel from "../models/carousel.js"

const getHomeData = async (req, res) => {
    try {
        const carousel = await Carousel.find().sort({ createdAt: -1 })
        return res.status(200).json(carousel)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "eror" })
    }
}

export { getHomeData }