import { Request, Response } from "express";
import db from "../../db";
import { postsTable } from "../../db/schema";
import { eq } from "drizzle-orm";

const get_user_post = async (req: Request, res: Response) => {
  try {
    const { user } = req.body;

    const posts = await db
      .select()
      .from(postsTable)
      .where(eq(postsTable.createdBy, user));

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default get_user_post;
