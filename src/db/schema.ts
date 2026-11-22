import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const todos = sqliteTable("todos", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  body: text("body"),
  tags: text("tags", { mode: "json" })
    .$type<string[]>()
    .notNull()
    .default(sql`'[]'`),
  dueDate: text("due_date")
    .notNull()
    .default(
      sql`(date('now', 'localtime', 'start of month', '+1 month', '-1 day'))`,
    ),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(datetime('now'))`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`(datetime('now'))`),
});

export type Todo = typeof todos.$inferSelect;

/**
 * An unfinished new-todo form, written when the user leaves the New Todo screen
 * without saving. Drafts are independent of todos and have no UI yet.
 */
export const drafts = sqliteTable("drafts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  /** Empty string when the draft only has body content. */
  title: text("title").notNull(),
  body: text("body"),
  dueDate: text("due_date").notNull(),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(datetime('now'))`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`(datetime('now'))`),
});

export type Draft = typeof drafts.$inferSelect;
