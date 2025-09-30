import multer from "multer";
import path from "path";

// Konfigurasi penyimpanan
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // folder tujuan
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

// Filter file (misalnya hanya gambar jpg/png/jpeg)
const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const allowedTypes = [".jpg", ".jpeg", ".png", ".gif"];

    if (allowedTypes.includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error("Only images are allowed (jpg, jpeg, png, gif)"), false);
    }
};

// Inisialisasi multer
const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 2 * 1024 * 1024 }, // maksimal 2 MB
});

export default upload;
