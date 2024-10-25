import { Request, Response } from "express";
import db from "../../db";
import { usersTable } from "../../db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import { create_token } from "../../utils/tokens";

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Fetch user from database
    const user = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));
    if (user.length == 0) {
      res.status(404).json({ error: "User does not exists" });
      return;
    }

    // Verify Password
    const isPasswordValid = await bcrypt.compare(password, user[0].password);

    if (!isPasswordValid) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    // Create Token
    const token = create_token(user[0]);

    // Set token as a Cookie
    res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 30 * 24 * 60 * 60 * 1000, //30 days
        sameSite: "strict",
      })
      .json({ message: "Login Done" });
    return;
  } catch (error) {

    // Error Handling
    res.status(500).json({ error: `Login failed ${error}` });
  }
};
