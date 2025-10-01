import User from "../models/user.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import Verification from "../models/verification.js"
import { sendEmail } from "../libs/send-email.js"
import aj from "../libs/arcjet.js"
import ArcjetLog from "../models/arcjet-log.js"


const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" })
}
const registerUser = async (req, res) => {
    try {
        const { email, name, password, profilePicture, adminAccessToken } = req.body
        const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
        if (!emailRegex.test(email)) {
            return res.status(403).json({ message: "E-mail is invalid format, must be @email.com" })
        }
        if (!passwordRegex.test(password)) {
            return res.status(403).json({ message: "Password should be 6 to 20 character long with a numeric, 1 lowercase, 1 uppercase letters" })
        }

        const clientIp = req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || req.ip || req.socket?.remoteAddress || "127.0.0.1";
        const userAgent = req.headers["user-agent"] || "PostmanRuntime/7.45.0";
        const decision = await aj.protect(
            { email },
            { requested: 1 },
            { ip: clientIp, ua: userAgent, env: process.env.ARCJET_ENV || "development" }
        );
        await ArcjetLog.create({ email, requested: 1, decision });
        if (decision.isDenied()) { res.writeHead(403, { "Content-Type": "application/json" }); return res.end(JSON.stringify({ message: "Invalid email address, Please try again!" })); }
        if (decision.conclusion === "DENY") { return res.status(429).json({ error: "Terlalu ngetes mas! Kurang-Kurangin.." }); }
        const existingUser = await User.findOne({ email })
        if (existingUser) { return res.status(400).json({ message: "Email sudah terdaftar, gunakan email yang lain!" }) }
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt)
        let role = "member";
        if (adminAccessToken && adminAccessToken === process.env.ADMIN_ACCESS_TOKEN) {
            role = "admin"
        }
        const newUser = await User.create({
            email,
            password: hashPassword,
            name,
            profilePicture,
            role,
        })
        const verificationToken = jwt.sign(
            { userId: newUser._id, purpose: "email-verification" },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        )
        await Verification.create({
            userId: newUser._id,
            token: verificationToken && generateToken(newUser._id),
            expiresAt: new Date(Date.now() + 1 * 60 * 60 * 1000)
        })
        const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`
        const emailBody = `
<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
    <!-- Logo -->
    <div style="text-align: center; margin-bottom: 20px;">
    <a href="https://kpmibm-r.com" target="_blank">
        <img src="https://yourwebsite.com/logo.png" alt="Your Website Logo" style="height: 50px;" />
    </a>
    </div>

    <!-- Heading -->
    <h2 style="text-align: center; color: #2c3e50;">Verify Your Email</h2>

    <!-- Body -->
    <p>Hello,</p>
    <p>Thank you for signing up with <strong>YourWebsite</strong>. Please verify your email address by clicking the button below:</p>

    <!-- Button -->
    <div style="text-align: center; margin: 30px 0;">
    <a href="${verificationLink}" 
        style="background-color: #4f46e5; color: #fff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block;">
        Verify Email
    </a>
    </div>

    <!-- Backup link -->
    <p>If the button doesn’t work, copy and paste this link into your browser:</p>
    <p><a href="${verificationLink}" style="color: #4f46e5;">${verificationLink}</a></p>

    <!-- Footer -->
    <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;" />
    <p style="font-size: 12px; color: #777; text-align: center;">
    This email was sent by <a href="https://yourwebsite.com" style="color: #4f46e5; text-decoration: none;">YourWebsite</a> to verify your account.<br/>
    If you didn’t sign up, you can safely ignore this email.
    </p>
    <p style="font-size: 12px; color: #aaa; text-align: center;">© ${new Date().getFullYear()} YourWebsite. All rights reserved.</p>
</div>
`;
        const emailSubject = "Verify your email address.."
        const isEmailSent = await sendEmail(email, emailSubject, emailBody)
        if (!isEmailSent) {
            return res.status(500).json({
                message: "Gagal mengirim email verifikasi anda"
            })
        }

        return res.status(201).json({
            message: "Tautan telah di kirim ke alamat email, silahkan verifikasi akun anda.",
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            profilePicture: newUser.profilePicture,
            bio: newUser.bio,
            role,
            token: generateToken(newUser._id)
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server mengalami kegaduhan di auth-controller fungsi registerUser" })
    }
}
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email }).select("+password")
        if (!user) {
            return res.status(400).json({ message: "Email tidak terdaftar, Silahkan coba lagi" })
        }
        if (!user.isEmailVerified) {
            const existingVerification = await Verification.findOne({ userId: user._id })
            if (existingVerification && existingVerification.expiresAt > new Date()) {
                return res.status(400).json({ message: "Email not verified, Please check your spam email for verification link." })
            } else {
                await Verification.findByIdAndDelete(existingVerification._id)
                const verificationToken = jwt.sign(
                    { userId: user._id, purpose: "email-verification" },
                    process.env.JWT_SECRET,
                    { expiresIn: "1h" }
                )
                await Verification.create({
                    userId: user._id,
                    token: verificationToken,
                    expiresAt: new Date(Date.now() + 1 * 60 * 60 * 1000)
                })
                const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`
                const emailBody = `<p>Click <a href="${verificationLink}" classname="underline" >Here</a> to verify your email</p>`
                const emailSubject = "Verify your email address.."
                const isEmailSent = await sendEmail(email, emailSubject, emailBody)
                if (!isEmailSent) {
                    return res.status(500).json({
                        message: "Gagal mengirim email verifikasi anda"
                    })
                }
                res.status(201).json({
                    message: "Tautan telah di kirim ke alamat email, silahkan verifikasi akun anda."
                })
            }
        }
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Password tidak sesuai, Silahkan coba lagi" })
        }
        const token = jwt.sign(
            { userId: user._id, purpose: "login" },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        )
        user.lastLogin = new Date()
        await user.save()
        const userData = user.toObject()
        delete userData.password
        res.status(200).json({
            message: "Login Successful",
            token,
            user: userData,
        })
    } catch (error) {
        return res.status(500).json({ message: "Internal server mengalami kejang di auth-controller fungsi loginUser", error })
    }
}
const verifyEmail = async (req, res) => {
    try {
        const { token } = req.body
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        if (!payload) {
            return res.status(401).json({ message: "Unauthorization : Token tidak ditemukan, coba cari diwarung atau di auth-controller fungsi verifyEmail" })
        }
        const { userId, purpose } = payload
        if (purpose !== "email-verification") {
            return res.status(401).json({ message: "Email coba diverifikasi" })
        }
        const verification = Verification.findOne({
            userId,
            token,
        })
        if (!verification) {
            return res.status(401).json({ message: "Unauthorization : Email belum di verifikasi, cek link verify di email spam anda." })
        }
        const isTokenExpired = verification.expiresAt < new Date()
        if (isTokenExpired) {
            return res.status(401).json({ message: "Token sudah usang, silahkan hubungi administrator" })
        }
        const user = await User.findById(userId)
        if (!user) {
            return res.status(401).json({ message: "Akun tidak terverifikasi, silahkan daftarkan akun anda" })
        }
        if (user.isEmailVerified) {
            return res.status(400).json({ message: "Email sudah di Verifikasi" })
        }
        user.isEmailVerified = true
        await user.save()
        await Verification.findByIdAndDelete(verification._id)
        return res.status(200).json({ message: "Email berhasil di Verifikasi." })
    } catch (error) {
        return res.status(500).json({ message: "Internal server mengalami musibah di auth-controller => verifyEmail", error })
    }
}
const resetPasswordRequest = async (req, res) => {
    try {
        const { email } = req.body
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: "User tidak ditemukan di dunia ini" })
        }
        if (!user.isEmailVerified) {
            return res.status(400).json({ message: "Email tidak terverivikasi loh, silahkan kontak administrator" })
        }
        const existingVerification = await Verification.findOne({ userId: user._id })
        if (existingVerification && existingVerification.expiresAt > new Date()) {
            return res.status(400).json({ message: "Reset password anda sudah dikirim via email." })
        }
        if (existingVerification && existingVerification.expiresAt < new Date()) {
            await Verification.findByIdAndDelete(existingVerification._id)
        }
        const resetPasswordToken = jwt.sign(
            { userId: user._id, purpose: "reset-password" },
            process.env.JWT_SECRET,
            { expiresIn: "15m" }
        )
        await Verification.create({
            userId: user._id,
            token: resetPasswordToken,
            expiresAt: new Date(Date.now() + 15 * 60 * 1000)
        })
        const resetPasswordLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetPasswordToken}`
        // const emailBody = `<p>Click <a href="${resetPasswordLink}">Here</a> to reset your account password </p>`
        const emailBody = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <title>Reset Password Account</title>
</head>
<body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color:#f4f6f8; color:#333;">
    <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="padding: 30px 0;">
    <tr>
        <td align="center">
        <table border="0" cellpadding="0" cellspacing="0" width="600" style="background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.1);">

            <!-- Logo -->
            <tr style="background:#00BC7D;">
            <td align="center" style="padding:20px;">
                <img src="https://imagekit.io/public/share/absholuted/a7665f3c489e24925571c83dc57245cbe1b02b5800ae0479cf5712a61474a0558490526413f3784ecbbc7644cebce88bc47402e86b0926f21776903e9455251ae71914a70af2d2277d6e388654db1d1b" alt="KPMIBM-R" width="80" style="display:block;" />
            </td>
            </tr>

            <!-- Intro -->
            <tr>
            <td style="padding: 30px 40px 10px 40px; font-size:16px; line-height:24px; color:#333;">
                <p>Halo,</p>
                <p>Kami menerima permintaan untuk mereset password akun Anda. Jika benar, silakan klik tombol di bawah ini untuk melanjutkan proses reset.</p>
            </td>
            </tr>

            <!-- Button -->
            <tr>
            <td align="center" style="padding:20px;">
                <a href="${resetPasswordLink}"
                style="background:#00BC7D; color:#ffffff; text-decoration:none; padding:12px 24px; border-radius:8px; font-weight:bold; display:inline-block;">
                Reset Password
                </a>
            </td>
            </tr>
            <!-- Closing -->
            <tr>
            <td style="padding: 20px 40px 30px 40px; font-size:14px; line-height:24px; color:#555;">
                <p>Jika Anda tidak meminta reset password, abaikan email ini. Password Anda akan tetap aman.</p>
                <p>Terima kasih, <br/>Tim Support</p>
            </td>
            </tr>
        </table>
        </td>
    </tr>
    </table>
</body>
</html>`;
        const emailSubject = "Reset password account KPMIBM-R"
        const isEmailSent = await sendEmail(email, emailSubject, emailBody)
        if (!isEmailSent) {
            return res.status(500).json({ message: "Gagal mengirim link reset password" })
        }
        res.status(200).json({ message: "Link reset password dikirim ke email anda." })
    } catch (error) {
        res.status(500).json({ message: "Internal server kacau balau di auth-controller.js => resetPasswordRequest()", error })
    }
}
const verifyResetTokenPassword = async (req, res) => {
    try {
        const { token, newPassword, confirmPassword } = req.body
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        if (!payload) {
            return res.status(401).json({ message: "Unauthorization : password reset not be completed" })
        }
        const { userId, purpose } = payload
        if (purpose !== "reset-password") {
            return res.status(401).json({ message: "Unauthorization: Reset tidak dapat dilakukan" })
        }
        const verification = await Verification.findOne({
            userId,
            token,
        })
        if (!verification) {
            return res.status(401).json({ message: "Unauthorized : Tidak dapat memverifikasi akun" })
        }
        const isTokenExpired = verification.expiresAt < new Date()
        if (isTokenExpired) {
            return res.status(401).json({ message: "Token sudah usang loh, jangan di paksa" })
        }
        const user = await User.findById(userId)
        if (!user) {
            return res.status(401).json({ message: "User ditemukan sedang terkapar kaku" })
        }
        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: "Password tidak sama, coba yang bener." })
        }
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(newPassword, salt)
        user.password = hashPassword
        await user.save()
        await Verification.findByIdAndDelete(verification._id)
        res.status(200).json({ message: "Password berhasil di ganti oli" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server rusak parah di auth-controller.js => verifyResetTokenPassword" })
    }
}

export { registerUser, loginUser, verifyEmail, resetPasswordRequest, verifyResetTokenPassword }