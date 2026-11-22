import { desc, eq, sql } from "drizzle-orm";
import type { AppDatabase } from "./client";
import { drafts, type Draft } from "./schema";

export interface NewDraft {
  title: string;
  body?: string;
  /** Local `YYYY-MM-DDTHH:mm`, the same format used by todos. */
  dueDate: string;
}

export type DraftUpdate = Partial<Pick<Draft, "title" | "body" | "dueDate">>;

export async function listDrafts(db: AppDatabase): Promise<Draft[]> {
  return db
    .select()
    .from(drafts)
    .orderBy(desc(drafts.updatedAt), desc(drafts.id));
}

export async function getDraft(
  db: AppDatabase,
  id: number,
): Promise<Draft | null> {
  const [draft] = await db
    .select()
    .from(drafts)
    .where(eq(drafts.id, id))
    .limit(1);
  return draft ?? null;
}

export async function createDraft(
  db: AppDatabase,
  draft: NewDraft,
): Promise<Draft> {
  const [created] = await db
    .insert(drafts)
    .values({
      title: draft.title,
      body: draft.body ?? null,
      dueDate: draft.dueDate,
    })
    .returning();

  if (!created) {
    throw new Error("Failed to read the draft that was just created.");
  }
  return created;
}

export async function updateDraft(
  db: AppDatabase,
  id: number,
  updates: DraftUpdate,
): Promise<Draft | null> {
  if (Object.keys(updates).length === 0) {
    return getDraft(db, id);
  }

  const [updated] = await db
    .update(drafts)
    .set({ ...updates, updatedAt: sql`(datetime('now'))` })
    .where(eq(drafts.id, id))
    .returning();

  return updated ?? null;
}

export async function deleteDraft(
  db: AppDatabase,
  id: number,
): Promise<boolean> {
  const deleted = await db
    .delete(drafts)
    .where(eq(drafts.id, id))
    .returning({ id: drafts.id });

  return deleted.length > 0;
}
