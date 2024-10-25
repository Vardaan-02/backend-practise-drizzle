import { Request, Response } from "express";
import db from "../../db";
import { usersTable } from "../../db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";

export const change_password = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Verify User
    const user = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));

    if (user.length === 0) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    // Verify Request
    const currentTime = new Date();
    if (
      user[0].passwordChangeTime === null ||
      user[0].passwordChangeTime > currentTime
    ) {
      res.status(401).json({ error: "Not a verified Request" });
      return;
    }

    // Password Hashing
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Password Change
    await db
      .update(usersTable)
      .set({
        password: hashedPassword,
      })
      .where(eq(usersTable.email, email));

    res.status(201).json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ error: "Password change failed" });
  }
};
