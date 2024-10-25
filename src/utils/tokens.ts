import jwt from "jsonwebtoken";
import { User } from "../types/User";
import { Request, Response } from "express";

export const create_token = (user: User): string => {
  return jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
    expiresIn: "30d",
  });
};

export const verify_token = (req: Request): User | null => {
  const token = req.cookies?.token;
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as User;
    return decoded;
  } catch (error) {
    console.error("Token verification error:", error);
    return null;
  }
};