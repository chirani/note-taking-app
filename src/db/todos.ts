import { asc, desc, eq, sql } from "drizzle-orm";
import type { AppDatabase } from "./client";
import { todos, type Todo } from "./schema";

export interface NewTodo {
  title: string;
  body?: string;
  tags?: string[];
  dueDate?: string;
}

export type TodoUpdate = Partial<
  Pick<Todo, "title" | "body" | "tags" | "dueDate">
>;

export async function listTodos(db: AppDatabase): Promise<Todo[]> {
  return db.select().from(todos).orderBy(asc(todos.dueDate), desc(todos.id));
}

export async function getTodo(
  db: AppDatabase,
  id: number,
): Promise<Todo | null> {
  const [todo] = await db.select().from(todos).where(eq(todos.id, id)).limit(1);
  return todo ?? null;
}

export async function createTodo(
  db: AppDatabase,
  todo: NewTodo,
): Promise<Todo> {
  const [created] = await db
    .insert(todos)
    .values({
      title: todo.title,
      body: todo.body ?? null,
      tags: todo.tags,
      dueDate: todo.dueDate,
    })
    .returning();

  if (!created) {
    throw new Error("Failed to read the todo that was just created.");
  }
  return created;
}

export async function updateTodo(
  db: AppDatabase,
  id: number,
  updates: TodoUpdate,
): Promise<Todo | null> {
  if (Object.keys(updates).length === 0) {
    return getTodo(db, id);
  }

  const [updated] = await db
    .update(todos)
    .set({ ...updates, updatedAt: sql`(datetime('now'))` })
    .where(eq(todos.id, id))
    .returning();

  return updated ?? null;
}

export async function deleteTodo(
  db: AppDatabase,
  id: number,
): Promise<boolean> {
  const deleted = await db
    .delete(todos)
    .where(eq(todos.id, id))
    .returning({ id: todos.id });

  return deleted.length > 0;
}
