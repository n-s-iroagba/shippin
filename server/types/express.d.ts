// types/express.d.ts
import { Admin } from "../models/Admin";

declare global {
  namespace Express {
    interface Request {
      admin?: Admin;
    }
  }
}