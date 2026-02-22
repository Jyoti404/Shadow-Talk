import path from "path";
import dotenv from "dotenv";

// Load .env from project root (Next.js may run from different cwd)
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SENDER_EMAIL,
    pass: process.env.SENDER_PASSWORD,
  },
});