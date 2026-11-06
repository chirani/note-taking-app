import type { SQLiteDatabase } from "expo-sqlite";
import { drizzle, type ExpoSQLiteDatabase } from "drizzle-orm/expo-sqlite";
import { migrate } from "drizzle-orm/expo-sqlite/migrator";
import migrations from "../../drizzle/migrations";
import * as schema from "./schema";

export const DATABASE_NAME = "obsidi3.db";

export type AppDatabase = ExpoSQLiteDatabase<typeof schema>;

export function createDb(client: SQLiteDatabase): AppDatabase {
  return drizzle(client, { schema });
}

/**
 * Opens the connection in WAL mode, enables foreign keys, and applies any
 * pending Drizzle migrations. Passed to `<SQLiteProvider onInit>`.
 */
export async function migrateDbIfNeeded(client: SQLiteDatabase) {
  await client.execAsync(`
PRAGMA journal_mode = 'wal';
PRAGMA foreign_keys = ON;
`);

  await migrate(createDb(client), migrations);
}
