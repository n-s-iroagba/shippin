import nodemailer from 'nodemailer';
import { Admin } from './models/Admin';

const transporter = nodemailer.createTransport({
  host: "mail.netlylogistics.com",
  port: 465,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
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


export const sendForgotPasswordMail = async (user: Admin) => {
  try {
    const emailContent = generateEmailTemplate(
      "Change YO",
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

export const sendCustom = async (
  email: string,
  data: { subject: string; message: string }
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
