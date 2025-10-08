// lib/mailer.ts
import nodemailer from "nodemailer";

const FROM = process.env.EMAIL_FROM ?? "no-reply@example.com";

export async function sendVerificationEmail(to: string, link: string) {
  const testAccount = await nodemailer.createTestAccount();
  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: { user: testAccount.user, pass: testAccount.pass },
  });

  const info = await transporter.sendMail({
    from: FROM,
    to,
    subject: "Verify your email",
    text: `Click here to verify your email: ${link}`,
    html: `<p>Click <a href="${link}">here</a> to verify your email.</p>`,
  });

  console.log("Preview URL:", nodemailer.getTestMessageUrl(info));
}
