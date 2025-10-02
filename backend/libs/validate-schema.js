import z from "zod";

const registerSchema = z.object({
    name: z.string().min(3, "Name is required"),
    email: z.string().email("Email anda pasti palsu."),
    password: z.string().min(8, "Password must be at least 8 characters long"),
    profilePicture: z.string().url("Profile picture harus berupa URL yang valid").optional(),
})
const loginSchema = z.object({
    email: z.string().email("Email tidak cocok dengan anda"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
})
const verifyEmailSchema = z.object({
    token: z.string().min(1, "Token diperlukan saat akses aplikasi.")
})
const emailSchema = z.object({
    email: z.string().email("Email tidak sesuai format dunia"),
})
const inviteMemberSchema = z.object({
    email: z.string().email("Invalid email address"),
    role: z.enum(["admin", "member", "viewer"]),
});
const tokenSchema = z.object({
    token: z.string().min(1, "Token is required"),
});
const resetPasswordSchema = z.object({
    token: z.string().min(1, "Token sangat dibutuhkan"),
    newPassword: z.string().min(8, "Password must be at least 8 characters long"),
    confirmPassword: z.string().min(1, "Input wrong, please password must be match")
})
const workspaceSchema = z.object({
    name: z.string().min(1, "Masukan nama ruang kerja anda."),
    color: z.string().min(1, "Pilihlah warna anda."),
    description: z.string().optional()
})
const projectSchema = z.object({
    title: z.string().min(3, "Masukan judul kamu"),
    description: z.string().optional(),
    status: z.enum([
        "Planning",
        "In Progress",
        "On Hold",
        "Completed",
        "Cancelled",
    ]),
    startDate: z.string(),
    dueDate: z.string().optional(),
    tags: z.string().optional(),
    members: z.array(
        z.object({
            user: z.string(),
            role: z.enum(["manager", "contributor", "viewer"])
        })
    ).optional()
})
const taskSchema = z.object({
    title: z.string().min(3, "Judul mestinya 3 karakter yah.."),
    description: z.string().optional(),
    status: z.enum(["To Do", "In Progress", "Done"]),
    priority: z.enum(["Low", "Medium", "High"]),
    dueDate: z.string().min(1, "Pilih tanggal deathline"),
    assignees: z.array(z.string()).min(1, "Tugas perlu di tambahkan")
})

export { registerSchema, loginSchema, verifyEmailSchema, emailSchema, resetPasswordSchema, workspaceSchema, projectSchema, taskSchema, tokenSchema, inviteMemberSchema }