import type { Request, Response, NextFunction } from "express"
import jwt, { type JwtPayload } from "jsonwebtoken"
import { Admin } from "../models/Admin"

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(" ")[1] // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ message: "Access token required" })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload

    const admin = await Admin.findByPk(decoded.adminId)
    if (!admin) {
      return res.status(401).json({ message: "Invalid token" })
    }

    req.user = admin
    next()
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" })
  }
}
