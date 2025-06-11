import { Request } from "express";
import { Admin } from "../models/Admin";

export interface AuthRequest extends Request{
    admin:Admin
}