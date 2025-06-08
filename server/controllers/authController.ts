import type { Request, Response } from "express"
import bcrypt from "bcryptjs"

import { Admin } from "../models/Admin"
import { sendVerificationEmail, sendResetPasswordEmail } from "../mailService"

import jwt, { type Secret, type SignOptions } from "jsonwebtoken"
import logger from "../utils/logger"

export const generateToken = (payload: any, expiresIn = 3600): string => {
  const secret = 'ababanna'
  if (!secret) {
    throw new Error("JWT_SECRET is not defined")
  }

  const options: SignOptions = { expiresIn }

  return jwt.sign(payload, secret, options)
}
function generateCode(count = 6): string {
  const numbers = Math.floor(Math.random() * 1000000)
  return numbers.toString().padStart(count, "0")
}

const handleError = (res: Response, error: any, defaultMessage: string) => {
  console.error(`Error: ${defaultMessage}:`, error)
  const status = error.status || 500
  const message = error.message || defaultMessage
  res.status(status).json({ message })
}

const createVerificationToken = async (admin: Admin) => {
  const verificationCode = generateCode()
  const verificationToken = generateToken({ adminId: admin.id, code: verificationCode })

  admin.verificationCode = verificationCode
  admin.verificationToken = verificationToken
  await admin.save()
  return verificationToken
}

// Controller functions
export const signUp = async (req: Request, res: Response): Promise<any> => {
  try {
    const { name, email, password } = req.body

    // Input validation
    if (!name || !email || !password) {
      throw { status: 400, message: "Name, email and password are required" }
    }

    if (password.length < 8) {
      throw { status: 400, message: "Password must be at least 8 characters long" }
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw { status: 400, message: "Invalid email format" }
    }

    const existingAdmin = await Admin.findOne({ where: { email } })
    if (existingAdmin) {
      throw { status: 400, message: "Admin with this email already exists" }
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const newAdmin = await Admin.create({
      name,
      email,
      password: hashedPassword,
      isVerified: false,
    })

    const token = await createVerificationToken(newAdmin)
    await sendVerificationEmail(newAdmin)

    res.status(201).json({
      message: "Admin account created successfully. Please check your email for verification.",
      verificationToken: token,
    })
  } catch (error) {
    handleError(res, error, "An error occurred during signup")
  }
}

export const verifyEmail = async (req: Request, res: Response): Promise<any> => {
  try {
    const { code, verificationToken } = req.body

    if (!code || !verificationToken) {
      throw { status: 400, message: "Verification code and token are required" }
    }

    if (!/^\d{6}$/.test(code)) {
      throw { status: 400, message: "Invalid verification code format" }
    }

    const decoded: any = jwt.verify(verificationToken, process.env.JWT_SECRET as string)
    if (!decoded.adminId) {
      throw { status: 400, message: "Invalid verification token" }
    }

    const admin = await Admin.findOne({
      where: {
        id: decoded.adminId,
        verificationToken,
        isVerified: false,
      },
    })

    if (!admin) throw { status: 404, message: "Admin not found or already verified" }
    if (admin.verificationCode !== code) throw { status: 400, message: "Wrong verification code" }

    admin.isVerified = true
    admin.verificationToken = null
    await admin.save()

    const loginToken = generateToken({ adminId: admin.id, email: admin.email, name: admin.name })

    res.json({ loginToken })
  } catch (error) {
    handleError(res, error, "Invalid token")
  }
}

export const login = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email } = req.body
    logger.info("Login attempt", { email })
    const { password } = req.body
    const admin = await Admin.findOne({ where: { email } })

    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      throw { status: 400, message: "Invalid credentials" }
    }

    if (!admin.isVerified) {
      await createVerificationToken(admin)
      await sendVerificationEmail(admin)
      return res.status(409).json({
        message: "Email not verified",
      })
    }

    const loginToken = generateToken({ adminId: admin.id, email: admin.email, name: admin.name })
    res.cookie("authToken", loginToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600000, // 1 hour
    })

    res.status(200).json({ loginToken })
  } catch (error) {
    handleError(res, error, "An error occurred during login")
  }
}

export const resendVerificationToken = async (req: Request, res: Response) => {
  try {
    const { verificationToken } = req.body
    if (!verificationToken) throw { status: 400, message: "Verification token is required" }

    const decoded: any = jwt.verify(verificationToken, process.env.JWT_SECRET as string)
    const admin = await Admin.findOne({ where: { id: decoded.adminId, verificationToken } })

    if (!admin) throw { status: 404, message: "Admin not found" }

    const newToken = await createVerificationToken(admin)
    await sendVerificationEmail(admin)

    res.status(200).json({ message: "verification token sent" })
  } catch (error) {
    handleError(res, error, "An error occurred during token resend")
  }
}

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body
    if (!email) throw { status: 400, message: "Email is required" }

    const admin = await Admin.findOne({ where: { email } })
    if (!admin) throw { status: 404, message: "Admin not found" }

    const resetToken = generateToken({ adminId: admin.id })
    admin.forgotPasswordToken = resetToken
    await admin.save()

    await sendResetPasswordEmail(admin, resetToken)
    res.json({ message: "Reset link sent to email" })
  } catch (error) {
    handleError(res, error, "An error occurred during password reset request")
  }
}

export const validateResetToken = async (req: Request, res: Response) => {
  try {
    const { token } = req.params
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string)
    const admin = await Admin.findOne({
      where: {
        id: decoded.adminId,
        forgotPasswordToken: token,
      },
    })

    if (!admin) {
      throw { status: 404, message: "Invalid or expired token" }
    }

    res.json({ valid: true })
  } catch (error) {
    handleError(res, error, "Invalid token")
  }
}

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { password, resetToken } = req.body
    if (!password || !resetToken) throw { status: 400, message: "Missing required fields" }

    const decoded: any = jwt.verify(resetToken, process.env.JWT_SECRET as string)
    const admin = await Admin.findOne({
      where: {
        id: decoded.adminId,
        forgotPasswordToken: resetToken,
      },
    })

    if (!admin) throw { status: 404, message: "Admin not found" }

    admin.password = await bcrypt.hash(password, 10)
    admin.forgotPasswordToken = null
    await admin.save()

    res.json({ message: "Password reset successful" })
  } catch (error) {
    handleError(res, error, "An error occurred during password reset")
  }
}
