import { Request, Response } from "express";
import bcrypt from "bcryptjs";

import { Admin } from "../models/Admin";
import { sendVerificationEmail, sendResetPasswordEmail } from "../mailService";

import jwt, { Secret, SignOptions } from 'jsonwebtoken';

export const generateToken = (payload: any, expiresIn: number = 3600): string => {
  const secret = process.env.JWT_SECRET as Secret;

  if (!secret) {
    throw new Error('JWT_SECRET is not defined');
  }

  const options: SignOptions = { expiresIn };

  return jwt.sign(payload, secret, options);
};
const handleError = (res: Response, error: any, defaultMessage: string) => {
  console.error(`Error: ${defaultMessage}:`, error);
  const status = error.status || 500;
  const message = error.message || defaultMessage;
  res.status(status).json({ message });
};

const createVerificationToken = async (admin: Admin) => {
  const verificationCode = generateToken({id:admin.id,role:'Admin'});
  const verificationToken = generateToken({ adminId: admin.id, code: verificationCode });

  admin.verificationCode = verificationCode;
  admin.verificationToken = verificationToken;
  await admin.save();

  return { verificationCode, verificationToken };
};

// Controller functions
export const signUp = async (req: Request, res: Response): Promise<any> => {
  try {
    const { name, email, password } = req.body;

    const existingAdmin = await Admin.findOne({ where: { email } });
    if (existingAdmin) {
      throw { status: 400, message: "Admin with this email already exists" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = await Admin.create({
      name,
      email,
      password: hashedPassword,
      isVerified: false
    });

    const { verificationToken } = await createVerificationToken(newAdmin);
    await sendVerificationEmail(newAdmin);

    res.status(201).json({ verificationToken });
  } catch (error) {
    handleError(res, error, "An error occurred during signup");
  }
};

export const verifyEmail = async (req: Request, res: Response): Promise<any> => {
  try {
    const { code, verificationToken } = req.body;
    const decoded: any = jwt.verify(verificationToken, process.env.JWT_SECRET as string);

    const admin = await Admin.findOne({ 
      where: { 
        id: decoded.adminId,
        verificationToken 
      } 
    });

    if (!admin) throw { status: 404, message: "Admin not found" };
    if (admin.verificationCode !== code) throw { status: 400, message: "Wrong verification code" };

    admin.isVerified = true;
    admin.verificationToken = null;
    await admin.save();

    const loginToken = generateToken(
      { adminId: admin.id, email: admin.email, name: admin.name },
    );

    res.json({ loginToken });
  } catch (error) {
    handleError(res, error, "Invalid token");
  }
};

export const login = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ where: { email } });

    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      throw { status: 400, message: "Invalid credentials" };
    }

    if (!admin.isVerified) {
      const { verificationToken } = await createVerificationToken(admin);
      await sendVerificationEmail(admin);
      return res.status(409).json({
        message: "Email not verified",
        verificationToken
      });
    }

    const loginToken = generateToken(
      { adminId: admin.id, email: admin.email, name: admin.name },
     
    );

    res.status(200).json({ loginToken });
  } catch (error) {
    handleError(res, error, "An error occurred during login");
  }
};

export const resendVerificationToken = async (req: Request, res: Response) => {
  try {
    const { verificationToken } = req.body;
    if (!verificationToken) throw { status: 400, message: "Verification token is required" };

    const decoded: any = jwt.verify(verificationToken, process.env.JWT_SECRET as string);
    const admin = await Admin.findOne({ where: { id: decoded.adminId, verificationToken } });

    if (!admin) throw { status: 404, message: "Admin not found" };

    const newToken = await createVerificationToken(admin);
    await sendVerificationEmail(admin);

    res.status(200).json({ verificationToken: newToken.verificationToken });
  } catch (error) {
    handleError(res, error, "An error occurred during token resend");
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) throw { status: 400, message: "Email is required" };

    const admin = await Admin.findOne({ where: { email } });
    if (!admin) throw { status: 404, message: "Admin not found" };

    const resetToken = generateToken({ adminId: admin.id });
    admin.forgotPasswordToken = resetToken;
    await admin.save();

    await sendResetPasswordEmail(admin, resetToken);
    res.json({ message: "Reset link sent to email" });
  } catch (error) {
    handleError(res, error, "An error occurred during password reset request");
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { password, resetToken } = req.body;
    if (!password || !resetToken) throw { status: 400, message: "Missing required fields" };

    const decoded: any = jwt.verify(resetToken, process.env.JWT_SECRET as string);
    const admin = await Admin.findOne({
      where: {
        id: decoded.adminId,
        forgotPasswordToken: resetToken
      }
    });

    if (!admin) throw { status: 404, message: "Admin not found" };

    admin.password = await bcrypt.hash(password, 10);
    admin.forgotPasswordToken = null;
    await admin.save();

    res.json({ message: "Password reset successful" });
  } catch (error) {
    handleError(res, error, "An error occurred during password reset");
  }
};