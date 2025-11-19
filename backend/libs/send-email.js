import sgMail from "@sendgrid/mail"
import dotenv from "dotenv"

dotenv.config()
sgMail.setApiKey(process.env.SEND_GRID_API)

const fromEmail = process.env.FROM_EMAIL
export const sendEmail = async (to, subject, html) => {
    const msg = {
        to,
        from: `Mosagol <${fromEmail}>`,
        subject,
        html
    }
    try {
        await sgMail.send(msg, {
            headers: { "User-Agent": "Mosagol-Server/1.0" }
        });
        console.log("✅ Email verification sent successfully");
        return true;
    } catch (error) {
        console.error("❌ Error sending email verification:", error.response?.body || error);
        return false;
    }
}
