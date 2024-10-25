import { Request, Response } from "express";
import db from "../../db";
import { tagsTable } from "../../db/schema";

const create_tag = async (req: Request, res: Response) => {
  try {
    const {tag} = req.body

    await db.insert(tagsTable).values({
        tag
    })

    res.status(200).json({message:`Tag : ${tag} is Created`})

  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default create_tag;
