import { Request, Response } from "express";

export const logout = async (req: Request, res: Response) => {
  try {
    res.clearCookie("token");
    res.status(200).json({message:"Logout successful"});
    return;
  } catch (error) {
    res.status(500).json({ error: "Registration failed" });
  }
};
