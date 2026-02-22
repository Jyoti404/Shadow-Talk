import { ApiResponse } from '@/types/ApiResponse';
import { transporter } from "@/lib/nodemailer";
import { customerMailTemplate } from "../../emails/customEmailTemplate";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    if (!process.env.SENDER_EMAIL || !process.env.SENDER_PASSWORD) {
      console.error("Missing SENDER_EMAIL or SENDER_PASSWORD in .env");
      return { success: false, message: "Email not configured. Add SENDER_EMAIL and SENDER_PASSWORD to .env" };
    }

    const htmlContent = customerMailTemplate(username, verifyCode);

    await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Ghosty Shadow Talk, Verification Code",
      text: "Your service is successfully booked, Happy!",
      html: htmlContent,
    });

    return { success: true, message: 'Verification email sent successfully.' };

  } catch (emailError) {
    console.error('Error sending verification email:', emailError);
    return { success: false, message: 'Failed to send verification email.' };
  }
}
