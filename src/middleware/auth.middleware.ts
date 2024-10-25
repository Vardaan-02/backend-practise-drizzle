import { verify_token } from "../utils/tokens";
import { NextFunction, Request, Response } from "express";

export async function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = verify_token(req);
    if (user) { 
      next();
    } else {
      res.status(401).json({ error: "Unauthorized: Invalid or missing token." });
    }
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(500).json({ error: "An internal server error occurred." });
  }
}
