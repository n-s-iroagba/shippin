
import{ Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { Admin } from '../models/Admin';
import { CustomError } from '../CustomError';

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      res.status(401).json({ message: 'No token provided' });
      return;
    }

    const secret = process.env.JWT_SECRET || 'default_secret';
    const decoded = jwt.verify(token, secret);

    if (typeof decoded !== 'object' || !('id' in decoded)) {
      res.status(401).json({ message: 'Invalid token payload' });
      return;
    }

    const adminId = (decoded as JwtPayload).id;
    const admin = await Admin.findByPk(adminId);

    if (!admin) {
      throw new CustomError( 401, 'Admin not found');
    }

    if (admin.loginToken !== token) {
      throw new CustomError( 401,'Admin not found',);
    }

    next();
  } catch (error) {
    const message = error instanceof CustomError ? error.message : 'Invalid token';
    res.status(401).json({ message });
  }
};
