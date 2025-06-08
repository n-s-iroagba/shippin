import nodemailer from 'nodemailer';
import { Admin } from './models/Admin';


const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  auth: {
    user: "hauteequity@gmail.com",
    pass: "cprf immt omzt espd",
  },
  logger: true, // Enable logger
  debug: true, // Enable debug output
});

// Generate stylish email template
const generateEmailTemplate = (title: string, message: string) => {
  return `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
    <h2 style="color: #333; text-align: center;">${title}</h2>
    <p style="font-size: 16px; color: #555; text-align: center;">${message}</p>
  </div>
  `;
};

export const sendVerificationEmail = async (user: Admin) => {
  try {
    const emailContent = generateEmailTemplate(
      "Verify Your Email",
      `Your verification code is: <strong>${user.verificationCode}</strong>`
    );

    await transporter.sendMail({
      from: `"Netly Logistics" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Verify Your Email",
      html: emailContent,
    });
  } catch (e) {
    console.error(e);
    throw new Error("Failed to send verification email");
  }
};


export const sendForgotPasswordMail = async (user: Admin, resetToken: string) => {
  try {
    const resetLink = `${process.env.CLIENT_URL}/admin/reset-password/${resetToken}`;
    const emailContent = generateEmailTemplate(
      "Reset Your Password",
      `To reset your password, click the link below:<br><br>
      <a href="${resetLink}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
        Reset Password
      </a>`
    );

    await transporter.sendMail({
      from: `"Netly Logistics" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Reset Your Password",
      html: emailContent,
    });
  } catch (e) {
    console.error(e);
    throw new Error("Failed to send password reset email");
  }
};

export const sendCustomMail = async (
  email: string,
  data: any
) => {
  try {
    const emailContent = generateEmailTemplate(data.subject, data.message);

    await transporter.sendMail({
      from: `"Netly Logistics" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: data.subject,
      html: emailContent,
    });
  } catch (e) {
    console.error(e);
    throw new Error("Failed to send custom email");
  }
};

export const sendResetPasswordEmail = async (user: Admin, resetToken: string) => {
  try {
    const resetLink = `${process.env.CLIENT_URL}/admin/reset-password/${resetToken}`;
    const emailContent = generateEmailTemplate(
      "Reset Your Password",
      `Click the following link to reset your password: <br><br>
      <a href="${resetLink}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
        Reset Password
      </a>`
    );

    await transporter.sendMail({
      from: `"Netly Logistics" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Reset Your Password",
      html: emailContent,
    });
  } catch (e) {
    console.error(e);
    throw new Error("Failed to send password reset email");
  }
};
