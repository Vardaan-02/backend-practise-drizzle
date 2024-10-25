import { Request, Response } from "express";
import db from "../../db";
import { postsTable, postTagsTable, tagsTable } from "../../db/schema";
import { eq } from "drizzle-orm";

const create_post = async (req: Request, res: Response) => {
  const { user, title, content, tags } = req.body;

  const post = await db
    .insert(postsTable)
    .values({
      title,
      content,
      createdBy: user,
    })
    .returning({
      id: postsTable.id,
      createdBy: postsTable.createdBy,
    });

  await Promise.all(
    tags.map(async (tag: string) => {
      // Fetch the tag
      let tag_ = await db
        .select()
        .from(tagsTable)
        .where(eq(tagsTable.tag, tag));

      let tagId = tag_[0]?.id;

      // Insert into postTagsTable with the obtained tagId and postId
      await db.insert(postTagsTable).values({
        tagId,
        postId: post[0].id,
      });
    })
  );

  res.status(200).json({ post });
};

export default create_post;
