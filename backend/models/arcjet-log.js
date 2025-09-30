import mongoose from "mongoose";

const arcjetLogSchema = new mongoose.Schema({
    email: String,
    requested: Number,
    decision: Object,
}, {
    timestamps: true
});

const ArcjetLog = mongoose.model("ArcjetLog", arcjetLogSchema);
export default ArcjetLog;