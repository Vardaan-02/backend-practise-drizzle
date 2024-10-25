import db from "../../db";
import { tagsTable } from "../../db/schema";
import { Request, Response } from "express";

const get_tag = async (req: Request, res: Response) => {
  try {
    const tag = await db.select().from(tagsTable);

    res.status(200).json({ tag });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default get_tag;