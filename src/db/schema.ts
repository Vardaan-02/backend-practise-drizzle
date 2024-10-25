import { relations } from "drizzle-orm";
import { primaryKey } from "drizzle-orm/pg-core";
import {
  varchar,
  timestamp,
  boolean,
  uuid,
  pgTable,
} from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  isVerified: boolean("isVerified").default(false).notNull(),
  otp: varchar("otp", { length: 255 }),
  isOTPValid: timestamp("isOTPValid"),
  passwordChangeTime: timestamp("passwordChangeTime"),
});

export const postsTable = pgTable("post", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  content: varchar("content").notNull(),
  createdBy: uuid("createdBy")
    .references(() => usersTable.id)
    .notNull(),
});

export const tagsTable = pgTable("tags", {
  id: uuid("id").defaultRandom().primaryKey(),
  tag: varchar().notNull().unique(),
});

export const postTagsTable = pgTable(
  "post_tags",
  {
    postId: uuid("postId")
      .references(() => postsTable.id)
      .notNull(),
    tagId: uuid("tagId")
      .references(() => tagsTable.id)
      .notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.postId, table.tagId] }),
    };
  }
);

// Relations

export const usersTableRelations = relations(usersTable, ({ many }) => {
  return {
    post: many(postsTable),
  };
});

export const postTableRelations = relations(postsTable, ({ many, one }) => {
  return {
    user: one(usersTable, {
      fields: [postsTable.createdBy],
      references: [usersTable.id],
    }),
    tags: many(postTagsTable),
  };
});

export const postTagsTableRelations = relations(postTagsTable, ({ one }) => {
  return {
    post: one(postsTable, {
      fields: [postTagsTable.postId],
      references: [postsTable.id],
    }),
    tag: one(tagsTable, {
      fields: [postTagsTable.tagId],
      references: [tagsTable.id],
    }),
  };
});
