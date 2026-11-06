import { desc, eq, sql } from "drizzle-orm";
import type { AppDatabase } from "./client";
import { notes, type Note } from "./schema";

export interface NewNote {
  title: string;
  body?: string;
}

export type NoteUpdate = Partial<Pick<Note, "title" | "body">>;

export async function listNotes(db: AppDatabase): Promise<Note[]> {
  return db
    .select()
    .from(notes)
    .orderBy(desc(notes.updatedAt), desc(notes.id));
}

export async function getNote(
  db: AppDatabase,
  id: number,
): Promise<Note | null> {
  const [note] = await db
    .select()
    .from(notes)
    .where(eq(notes.id, id))
    .limit(1);
  return note ?? null;
}

export async function createNote(
  db: AppDatabase,
  note: NewNote,
): Promise<Note> {
  const [created] = await db
    .insert(notes)
    .values({ title: note.title, body: note.body ?? "" })
    .returning();

  if (!created) {
    throw new Error("Failed to read the note that was just created.");
  }
  return created;
}

export async function updateNote(
  db: AppDatabase,
  id: number,
  updates: NoteUpdate,
): Promise<Note | null> {
  if (Object.keys(updates).length === 0) {
    return getNote(db, id);
  }

  const [updated] = await db
    .update(notes)
    .set({ ...updates, updatedAt: sql`(datetime('now'))` })
    .where(eq(notes.id, id))
    .returning();

  return updated ?? null;
}

export async function deleteNote(
  db: AppDatabase,
  id: number,
): Promise<boolean> {
  const deleted = await db
    .delete(notes)
    .where(eq(notes.id, id))
    .returning({ id: notes.id });

  return deleted.length > 0;
}
