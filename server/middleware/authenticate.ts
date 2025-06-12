import type { Request, Response, NextFunction } from "express"
import jwt, { type JwtPayload } from "jsonwebtoken"
import { Admin } from "../models/Admin"
import { AppError } from "../utils/error/errorClasses"
import { handleError } from "../utils/error/handleError"

export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(" ")[1] // Bearer TOKEN

    if (!token) {
      throw new AppError(401, "Access token required")
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload

    const admin = await Admin.findByPk(decoded.adminId)
    if (!admin) {
        throw new AppError(401, "Invalid token" )
    }

    req .admin = admin
    next()
  } catch (error) {
       handleError(error,'authenticate middle ware',res)
  }
}