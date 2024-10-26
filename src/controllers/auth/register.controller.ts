import { Request, Response } from "express";
import db from "../../db/index";
import { usersTable } from "../../db/schema";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { cloudinaryUpload } from "../../utils/cloudinary";
import fs from "fs";

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const file = req.file;

    // Avatar using Cloudinary
    let avatarUrl;
    if(req.file){
      const localFilePath = req.file.path;
      const cloudinaryResult = await cloudinaryUpload(localFilePath);

      if(!cloudinaryResult){
        res.status(500).json({error:"Cloundinary Error"})
        return;
      }
      
      avatarUrl = cloudinaryResult.url;
      fs.unlinkSync(localFilePath);
  }

    // Check for duplicate email in database
    const user = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));
    if (user.length) {
      res.status(409).json({ error: "email already exists" });
      return;
    }

    // Password Hashing
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user in database
    try {
      const user = await db
        .insert(usersTable)
        .values({
          name,
          email,
          password: hashedPassword,
          isVerified: false,
          avatar:avatarUrl,
        })
        .returning({
          id: usersTable.id,
          name: usersTable.name,
          email: usersTable.email,
        });

      // Return response
      res.status(201).json({ user });
    } catch {
      // Handling issue in Database
      res.status(502).json({ error: "Database Issue" });
    }
  } catch (error) {
    // Handling Errors
    res.status(500).json({ error: `Registration failed \n Error: ${error}` });
  }
};
