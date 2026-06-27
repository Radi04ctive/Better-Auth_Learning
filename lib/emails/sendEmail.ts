import { transporter, account } from "./etherealMailService";

export async function sendEmail({ to, subject, html, text }: { to: string, subject: string, html: string, text: string }) {
    return transporter.sendMail({
        from: `"better-auth app" <${account.user}>`,
        to,
        subject,
        text,
        html
    });

    // console.log("Message sent: %s", info.messageId);
    // console.log("Preview: %s", nodemailer.getTestMessageUrl(info));
}

