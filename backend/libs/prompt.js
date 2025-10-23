// const generateStoryPrompt = (topic) => `generate a short story about ${topic}

// For each sentence in the story, provide a relevant image description in Indonesian language.
// - Judul harus bernilai positif, humanis dan berkebudayaan (minimal 10 kata dari topik yang diajukan)
// - Deskripsi maksimal 200 kata dengan isi yang mencerminkan topik secara detail, dengan muatan nilai Culture dan Positif di Dunia modern
// - gaya bahasa yang casual, modern, positif word, penuh optimistik
// - 4 Tags yang relevan
// - Content maksimal 500 kata memuat seluruh pandangan dari topik berisi dasein dan da solen
// - berikan gambar dengan ukuran kecil sebagai kesimpulan dari topik

// Berikan respon dalam format JSON dengan struktur berikut ini:
// [
//     {
//         "title": "",
//         "slug": "",
//         "imgUrl":"",
//         "category": ["", "", ""]
//         "description": "",
//         "content":""
//         "tags": ["", "", "", ""]
//     }
// ]

// Important: Do Not Add any extra text outside the JSON format. only return valid JSON response.`

const generateStoryPrompt = (topic) => `
Kamu adalah AI penulis kreatif. Buatkan saya **3 ide cerita singkat** berdasarkan topik berikut: "${topic}"

Setiap ide harus dalam format:
{
  "title": "Judul sangat hegemonic minimal 10 kata",
  "imgUrl": "URL gambar kecil yang representatif dengan topik",
  "description": "1 kutipan dengan nama dari para tokoh dunia, filsuf atau pemikir dunia",
  "content": "Berisi 100-200 kata sesuai topik, buat menarik dengan kedalaman pikiran, analisis saintifik dengan sudut pandang yang modern serta futuristik",
  "tags": ["tag1", "tag2", "tag3", "tag4"],
  "tone": [""]
}

Keluarkan output hanya dalam format JSON valid.
Jangan tambahkan teks lain, jangan gunakan backtick, markdown, atau komentar.
`;

const generateStoryPostPrompt = (title, tone) => {
    return `
AI Kreatif, berikan saya contentnya saja yang berjudul "${title}" dan nuansa tulisan yang "${tone}".
content memiliki pengantar ciamik, penuh kematangan analisa dan isi tulisan yang kuat serta gaya penulisan serta bahasa yang enak dibaca

Keluarkan output hanya dalam format JSON valid.
Jangan tambahkan teks lain, jangan gunakan backtick, markdown, atau komentar. 
`}

const generateCommentPrompt = (comment) => {
    const authorName = comment.author.name
    const content = comment.content
    return `Ai hebat berikan komentar dengan ${authorName} yang disesuaikan dengan isi: "${content}". The comment should be engaging and relevant to the post. Limit the comment to 20 words.`
}
const generateSummaryPrompt = (content) => (
    `You are an AI assistant. Provide a concise summary of the following content in Indonesian language, capturing the main points and essence of the text.

    Instructions:
    - Read the story post content below.
    - Generate a short, catchy, SEO-Friendly title (max 12 words).
    - title in Indonesian language
    - Generate a brief summary that highlights the key aspects 
    - Write the summary and content in Indonesian language
    - Create a detailed content section that elaborates on the summary 
    - Ensure the content is clear and easy to understand.
    - image url sesuai content yang di minta dalam link
    - under that heading, list 4 relevant hashtags in Indonesian language or skills the reader will learn in **bullet points** using markdown (\`-\`).

    Return the response in JSON format with the following structure:
    {
        "title": "",
        "slug":"",
        "imgUrl":"",
        "summary": "",
        "content": "",
        "tag": ["", "", "", ""]
    }
    only return valid JSON response. Do Not Add any extra text outside the JSON format.

    story post content:
    ${content}
    `
)

export { generateStoryPrompt, generateStoryPostPrompt, generateCommentPrompt, generateSummaryPrompt }