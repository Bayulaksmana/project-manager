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
Kamu adalah AI penulis kreatif. Buat **4 ide cerita pendek** berdasarkan topik berikut: "${topic}"

Setiap ide harus dalam format:
{
  "title": "Judul inspiratif minimal 10 kata",
  "slug": "slug-kebanyakan-kecil-tanpa-spasi",
  "imgUrl": "URL gambar kecil representatif",
  "category": ["kategori1", "kategori2", "kategori3"],
  "description": "Deskripsi maksimal 200 kata, gaya casual, positif, dan penuh optimisme.",
  "content": "Isi cerita 400–500 kata dengan nilai budaya modern dan refleksi humanis.",
  "tags": ["tag1", "tag2", "tag3", "tag4"]
}

Keluarkan output hanya dalam format JSON valid.
Jangan tambahkan teks lain, jangan gunakan backtick, markdown, atau komentar.
`;

const generateStoryPostPrompt = (post) => {
    const title = post.title || "Untitled"
    const content = post.content || "This is a new post!"
    return `Create a social media post based on the following details:
- Title: ${title}
- Content: ${content}
The post should be engaging and concise, suitable for platforms like Instagram or Facebook. Include 3 relevant hashtags and suggest an image description in Indonesian language that complements the post content.

Return the response in JSON format with the following structure: `}

const generateCommentPrompt = (comment) => {
    const authorName = comment.authorName || "User"
    const content = comment.content || "This is a new post!"
    return `Write a comment as ${authorName} for the following post content: "${content}". The comment should be engaging and relevant to the post. Limit the comment to 20 words.`
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