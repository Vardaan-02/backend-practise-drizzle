import { Request, Response } from "express";
import db from "../../db";
import { usersTable } from "../../db/schema";
import { eq } from "drizzle-orm";

export const verify_email_otp = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;

    const user = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));
    if (user.length === 0) {
      res.status(404).json({ error: "User not fount" });
      return;
    }

    const currentTime = new Date();
    if (
      user[0].otp !== otp ||
      user[0].isOTPValid === null ||
      user[0].isOTPValid < currentTime
    ) {
      res.status(401).json({ error: "Invalid OTP" });
      return;
    }

    await db
      .update(usersTable)
      .set({
        isVerified: true,
        otp: null,
        isOTPValid: null,
        passwordChangeTime: new Date(Date.now() + 10 * 60 * 1000),
      })
      .where(eq(usersTable.email, email))
      .execute();

    res.status(200).json({ message: "OTP Verified" });
  } catch (error) {
    res.status(500).json({ error: "OTP failed" });
  }
};
