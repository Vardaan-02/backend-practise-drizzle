import { Request, Response } from "express";
import db from "../../db";
import { postsTable } from "../../db/schema";

const get_post = async (req: Request, res: Response) => {
  try {
    const posts = await db.select().from(postsTable);
    res.status(200).json({ posts });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default get_post;
