
import{ Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { Admin } from '../models/Admin';
import { CustomError } from '../CustomError';
const SECRET_KEY =''
const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.authToken;

  if (!token) {
    return next(new CustomError( 401, ''));
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY) as JwtPayload & Admin;
    req.user = decoded
    next();
  } catch (err) {
       return next(new CustomError( 401, ''));
  }
};
export default authMiddleware