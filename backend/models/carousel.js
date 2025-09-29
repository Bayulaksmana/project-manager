import { Schema } from "mongoose"
import mongoose from "mongoose"

const carouselSchema = new Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Kader",
            required: true,
        },
        img: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        total: {
            type: Number,
        },
        description: {
            type: String,
        },
        website: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

const Carousel = mongoose.model("Daerah", carouselSchema)
export default Carousel