import { createDb } from "@/db";
import { useSQLiteContext } from "expo-sqlite";
import { useMemo } from "react";

/** Returns a Drizzle client bound to the app's SQLite database. */
export function useDb() {
  const client = useSQLiteContext();
  return useMemo(() => createDb(client), [client]);
}
