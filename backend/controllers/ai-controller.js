import { GoogleGenAI } from "@google/genai";
import { generateCommentPrompt, generateStoryPrompt, generateSummaryPrompt } from "../libs/prompt.js";
import User from "../models/user.js";


const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });
const generateCounter = new Map();

const generateStory = async (req, res) => {
    try {
        const { title, tone, userId } = req.body;
        const user = await User.findById(userId)
        if (!title || !tone) {
            return res.status(400).json({ message: "Lengkapi data Title dan Tone untuk generate AI" });
        }
        const count = generateCounter.get(user) || 0;
        if (count >= 2) {
            return res.status(429).json({
                message: "Limit tercapai, tiap user hanya bisa generate 2x"
            });
        }
        const prompt = `Write a markdown-formatted blog post titled "${title}". Use a "${tone}" tone.
    Include an Introduction, subheading, tags if relevant, and a conclusion pisahkan judulnya, tags, dan isinya`;
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash-lite",
            contents: prompt
        })
        const rawTex = response.text
        const cleanedText = rawTex
            .replace(/```json\s*/gi, "")
            .replace(/```/g, "")
            .replace(/\\"/g, '"')
            .replace(/\\t/g, " ")
            .replace(/[*_`#\#'->]/g, "")
            .replace(/\s{2,}/g, " ")
            .trim();
        let parsed;
        try {
            parsed = JSON.parse(cleanedText);
        } catch (e) {
            console.error("Gagal parse JSON:", e.message);
            parsed = cleanedText; // fallback biar tetap ada data mentah
        }
        generateCounter.set(userId, count + 1);
        res.status(200).json({ message: `Judul ${title} dengan gaya ${tone} berhasil di generate AI`, parsed, sisaLimit: 2 - (count + 1) })
    } catch (error) {
        return res.status(500).json({ message: "AI sedang sibuk lagi ngejar Roket -> Controller AI", error: error.message })
    }
}
const generateStoryPost = async (req, res) => {
    try {
        const { topics, userId } = req.body
        const user = await User.findById(userId)
        if (!topics) { return res.status(403).json({ message: "Pastikan objek topik merupakan string" }) }
        const count = generateCounter.get(user) || 0;
        if (count >= 2) {
            return res.status(429).json({
                message: "Limit tercapai, tiap user hanya bisa generate 2x"
            });
        }
        const prompt = generateStoryPrompt(topics)
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash-lite",
            contents: prompt
        })
        const rawTex = response.text
        const cleanedText = rawTex
            .replace(/^```json\s*/, "")
            .replace(/```$/g, "")
            .replace(/\\n/g, "\n")
            .replace(/```/g, "")
            .trim();
        let parsed;
        try {
            parsed = JSON.parse(cleanedText);
        } catch (e) {
            console.error("Gagal parse JSON:", e.message);
            parsed = cleanedText; // fallback biar tetap ada data mentah
        }
        generateCounter.set(userId, count + 1);
        res.status(200).json({ message: `Generate ${topics} berhasil`, rawTex, parsed, sisaLimit: 2 - (count + 1) })
    } catch (error) {
        return res.status(500).json({ message: "AI sedang ke mars nyari wangsit -> Controller AI", error: error.message })
    }
}
const generateComment = async (req, res) => {
    try {
        const { author, content } = req.body
        if (!content) { return res.statu(400).json({ message: "Please tambahkan prompt pencarian" }) }
        const prompt = generateCommentPrompt({ author, content })
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash-lite",
            contents: prompt
        })
        let rawTex = response.text
        res.status(200).json(rawTex)
    } catch (error) {
        return res.status(500).json({ message: "AI tidak membantu orang malas mikir -> Controller AI", error: error.message })
    }
}
const generateSummary = async (req, res) => {
    try {
        const { content } = req.body
        if (!content) { return res.status(400).json({ message: "Pastikan konten prompt terisi huruf atau angka!" }) }
        const prompt = generateSummaryPrompt(content)
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash-lite",
            contents: prompt
        })
        let rawTex = response.text
        const cleanedText = rawTex
            .replace(/^```json\s*/, "")
            .replace(/```$/, "")
            .trim()
        const data = JSON.parse(cleanedText)
        res.status(200).json(data)
    } catch (error) {
        return res.status(500).json({ message: "AI sedang tidak berada di kediaman -> Controller AI", error: error.message })
    }
}

export { generateStory, generateStoryPost, generateComment, generateSummary }