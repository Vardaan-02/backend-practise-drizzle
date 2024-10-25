import { Request, Response } from "express";
import db from "../../db";
import { postsTable, postTagsTable, tagsTable } from "../../db/schema";
import { eq } from "drizzle-orm";

const get_post_by_tag = async (req: Request, res: Response) => {
  try {
    const tag = req.params.tag;

    // get tag ID
    const tag_ = await db
      .select()
      .from(tagsTable)
      .where(eq(tagsTable.tag, tag));
    if (tag_.length === 0) {
      res.status(404).json({ error: "Tag not found" });
      return;
    }
    const tagId = tag_[0].id;

    // Fetch all posts related to the tag
    const postTagRelations = await db
      .select()
      .from(postTagsTable)
      .where(eq(postTagsTable.tagId, tagId));

    // Fetch all posts details concurrently
    const posts = await Promise.all(
      postTagRelations.map(async (postTag) => {
        const fullPost = await db
          .select()
          .from(postsTable)
          .where(eq(postsTable.id, postTag.postId));
        return fullPost[0];
      })
    );

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default get_post_by_tag;
