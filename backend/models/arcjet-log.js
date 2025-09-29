import mongoose from "mongoose";

const arcjetLogSchema = new mongoose.Schema({
    email: String,
    requested: Number,
    decision: Object,
    createdAt: { type: Date, default: Date.now }
});

const ArcjetLog = mongoose.model("ArcjetLog", arcjetLogSchema);
export default ArcjetLog;