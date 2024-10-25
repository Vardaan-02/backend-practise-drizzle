import { Request, Response } from "express";
import nodemailer from "nodemailer";
import db from "../../db";
import { usersTable } from "../../db/schema";
import { eq } from "drizzle-orm";

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export const send_email_otp = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const OTP = generateOTP();

    const user = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));

    if (user.length == 0) {
      res.status(401).json({ message: "Invalid Email" });
      return;
    }
    if (user[0].isVerified) {
      res.status(401).json({ message: "Email Already Verified" });
      return;
    }

    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        secure: true,
        port: 465,
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSWORD,
        },
      });

      const mailOptions = {
        from: "No Reply <noreply@gmail.com>",
        to: email,
        subject: "Email Verification OTP",
        text: `Your OTP for email verification is: ${OTP}. It is valid for 10 minutes.`,
      };

      await db
        .update(usersTable)
        .set({
          isVerified: false,
          otp: OTP,
          isOTPValid: new Date(Date.now() + 10 * 60 * 1000),
        })
        .where(eq(usersTable.email, email))
        .execute();

      await transporter.sendMail(mailOptions);

      res.status(201).json({ message: "OTP Send successfully" });
    } catch(error) {
      res.status(505).json({ error: `Email issue i.e. nodemailer ${error}`});
      return;
    }
  } catch (error) {
    res.status(500).json({ error: "OTP failed" });
  }
};
