// lib/sendMail.ts
"use server";
import nodemailer from "nodemailer";

export async function sendMail(to: string, subject: string, text: string) {
  // Create transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Send mail
  const info = await transporter.sendMail({
    from: `"VOCALX" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
  });

  return info;
}
