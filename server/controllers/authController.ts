import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Admin } from "../models/Admin";
import dotenv from "dotenv";
import { sendVerificationEmail } from "../mailService";

dotenv.config();

export const signUp = async (req: Request, res: Response): Promise<any> => {
  try {
    const { name, email, password } = req.body;

    const existingAdmin = await Admin.findOne({ where: { email } });
    if (existingAdmin)
      return res.status(400).json({ message: "Admin already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = await Admin.create({
      name,
      email,
      password: hashedPassword,
      isVerified: false,
    });

    const verificationToken = jwt.sign(
      { AdminId: newAdmin.id },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "1h",
      }
    );

    const verificationCode = Math.floor(100000 + Math.random() * 900000);
    newAdmin.verificationCode = String(verificationCode);
    newAdmin.verificationToken = verificationToken;
    await newAdmin.save();
    await sendVerificationEmail(newAdmin)

    res.status(201).json(verificationToken);
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error", error });
  }
};

export const verifyEmail = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { token,code } = req.body;
    console.log('verifying email')

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
    const admin = await Admin.findByPk(decoded.AdminId);
    if (!admin)
      return res.status(400).json({ message: "Invalid or expired token" });

    admin.isVerified = true;
    await admin.save();

    const loginToken = jwt.sign(
      { adminId: admin.id },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "1d",
      }
    );

    res.json(loginToken);
  } catch (error) {
    console.error(error)
    res.status(400).json({ message: "Invalid token" });
  }
};



export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    if (typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ message: "Invalid input format" });
    }

    if (!email.includes('@')) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const admin = await Admin.findOne({ where: { email } });
    if (!admin) return res.status(400).json({ message: "Invalid credentials" });

    if (!admin.isVerified)
      return res
        .status(400)
        .json({ message: "Please verify your email first" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { adminId: admin.id },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "1d",
      }
    );

    res.json( token );
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error", error });
  }
};

export const resendVerificationToken = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const admin = await Admin.findOne({ where: { email } });
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    if (admin.isVerified)
      return res.status(400).json({ message: "Admin already verified" });

    const verificationToken = jwt.sign(
      { AdminId: admin.id },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );

    const verificationCode = Math.floor(100000 + Math.random() * 900000);
    admin.verificationToken = verificationToken;
    admin.verificationCode = String(verificationCode);
    await admin.save();

    await sendVerificationEmail(admin);

    res.status(200).json({ message: "Verification email resent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const admin = await Admin.findOne({ where: { email } });

    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const changePasswordToken = jwt.sign(
      { adminId: admin.id },
      process.env.JWT_SECRET as string,
      { expiresIn: "15m" }
    );

    admin.forgotPasswordToken = changePasswordToken;
    await admin.save();


    await sendForgotPasswordEmail(admin); 

    res.status(200).json({ message: "Password reset link sent to email" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
    const admin = await Admin.findByPk(decoded.adminId);

    if (!admin) return res.status(404).json({ message: "Invalid or expired token" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    admin.password = hashedPassword;
    admin.verificationToken = null;
    await admin.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Invalid or expired token" });
  }
};
function sendForgotPasswordEmail(admin: Admin) {
  throw new Error("Function not implemented.");
}

