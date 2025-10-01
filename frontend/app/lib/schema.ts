import { ProjectStatus } from "@/types";
import { z } from "zod";


export const signInSchema = z.object({
    email: z.email("Email anda salah bener!"),
    password: z.string().min(8, "Password must be at least 8 characters long")
});
export const signUpSchema = z.object({
    name: z.string().min(3, "Must be original name, at least 3 characters"),
    email: z.email("Email anda tidak sesuai formatnya loh!"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
    confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
    profilePicture: z.string(),
    adminAccessToken: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Password do not match",
});
export const resetPasswordSchema = z
    .object({
        newPassword: z.string().min(8, "Ingat! Password musti delapan karakter yah."),
        confirmPassword: z.string().min(1, "Tak ada hilal, silahkan di isi kolomnya")
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        path: ["confirmPassword"],
        message: "Pastikan musti sama itu password!",
    });
export const forgotPasswordSchema = z.object({
    email: z.email("Tak terlihat ada huruf, angka atau simbol yang di input ini."),
})
export const workspaceSchema = z.object({
    name: z.string().min(3, "Nama harus 3 karakter minimal loh yaa.."),
    color: z.string().min(3, "Warna minimal 3 karakter loh yaa.."),
    description: z.string().optional(),
})
export const storyspaceSchema = z.object({
    title: z.string().min(3, "Nama harus 3 karakter minimal loh yaa.."),
    conten: z.string().min(3, "Warna minimal 3 karakter loh yaa.."),
    description: z.string().optional(),
})
export const projectSchema = z.object({
    title: z.string().min(3, "Judul mestinya 3 karakter yah.."),
    description: z.string().optional(),
    status: z.enum(ProjectStatus),
    startDate: z.string().min(10, "Pilih tanggal mulai"),
    dueDate: z.string().min(10, "Pilih tanggal deathline"),
    members: z.
        array(
            z.object({
                user: z.string(),
                role: z.enum(["manager", "contributor", "viewer"])
            })).optional(),
    tags: z.string().optional()
})
export const createTaskSchema = z.object({
    title: z.string().min(3, "Judul mestinya 3 karakter yah.."),
    description: z.string().optional(),
    status: z.enum(["To Do", "In Progress", "Done"]),
    priority: z.enum(["Low", "Medium", "High"]),
    dueDate: z.string().min(10, "Pilih tanggal deathline"),
    assignees : z.array(z.string()).min(1, "Tugas perlu di tambahkan")
})
export const inviteMemberSchema = z.object({
    email: z.email(),
    role: z.enum(["admin", "member", "viewer"]),
});

export const changePasswordSchema = z.object({
    currentPassword: z
        .string()
        .min(1, { message: "Current password is required" }),
    newPassword: z.string().min(8, { message: "New password is required" }),
    confirmPassword: z
        .string()
        .min(8, { message: "Confirm password is required" }),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});


export const profileSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    profilePicture: z.string().optional(),
});