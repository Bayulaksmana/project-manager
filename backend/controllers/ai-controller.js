import { GoogleGenAI } from "@google/genai";
import { generateCommentPrompt, generateStoryPrompt, generateSummaryPrompt } from "../libs/prompt.js";
import User from "../models/user.js";
import { tryParseJSONFromText } from "../libs/rawtex.js";


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
        const prompt =
            `AI Kreatif, berikan saya tulisan dengan judul "${title}" dan nuansa tulisan yang "${tone}".
    Tulisan yang memiliki pengantar ciamik, penuh kematangan analisa serta kuat gaya bahasa yang enak dibaca`;
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash-lite",
            contents: prompt
        })
        const rawTex = response.text
        const cleanedText = rawTex
            .replace(/```json|```/g, "")
            .replace(/\r/g, "")
            .replace(/\u0000/g, "")
            .replace(/[\x00-\x09\x0B\x0C\x0E-\x1F\x7F]/g, "")
            .replace(/\u2028|\u2029/g, "")
            .replace(/[*_`#\#'->]/g, "")
            .trim();
        let parsed;
        try {
            parsed = JSON.parse(cleanedText);
        } catch (e) {
            console.error("Gagal parse JSON:", e.message);
            parsed = cleanedText;
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
        const rawTex = response.text ?? ""
        const cleanedText = rawTex
            .replace(/```json|```/g, "")
            .replace(/\r/g, "")
            .replace(/\u0000/g, "")
            .replace(/[\x00-\x09\x0B\x0C\x0E-\x1F\x7F]/g, "")
            .replace(/\u2028|\u2029/g, "")
            .trim();
        let parsed;
        try {
            parsed = JSON.parse(cleanedText);
            if (typeof parsed === "string") parsed = JSON.parse(parsed);
            if (!Array.isArray(parsed)) parsed = [parsed];
        } catch (error) {
            const maybe = tryParseJSONFromText(rawTex);
            if (maybe) {
                parsed = Array.isArray(maybe) ? maybe : [maybe];
            } else {
                console.error("Gagal parse JSON (robust): saving raw text as fallback. error:", (error).message);
                parsed = [{ text: cleanedText }];
            }
        }
        generateCounter.set(userId, count + 1);
        res.status(200).json({ message: `Generate ${topics} berhasil`, parsed, sisaLimit: 2 - (count + 1) })
    } catch (error) {
        console.error("🚨 Error di generateStoryPost:", error);
        return res.status(500).json({
            message: "AI sedang ke mars nyari wangsit -> Controller AI",
            error: error.message,
        })
    }
}
const generateComment = async (req, res) => {
    try {
        const { author, content } = req.body
        if (!content) { return res.status(400).json({ message: "Please tambahkan prompt pencarian" }) }
        const prompt = generateCommentPrompt({ author, content })
        const result = await ai.models.generateContent({
            model: "gemini-2.0-flash-lite",
            contents: prompt
        })
        const rawText = result.text
        res.status(200).json({ message: "Komentar berhasil di generated AI~😎", reply: rawText })
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