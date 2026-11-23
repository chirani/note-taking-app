const pad = (value: number) => String(value).padStart(2, "0");

/** Local `YYYY-MM-DDTHH:mm`, the format stored in the `due_date` column. */
export const toISODateTime = (date: Date): string =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
    date.getHours(),
  )}:${pad(date.getMinutes())}`;

/** Parses a stored `YYYY-MM-DDTHH:mm` due date as a local time. */
export function parseDueDate(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(value);
  if (!match) return null;

  const [, year, month, day, hour, minute] = match;
  return new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hour),
    Number(minute),
  );
}

const dueDateFormatter = new Intl.DateTimeFormat(undefined, {
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

export const formatDueDate = (date: Date): string =>
  dueDateFormatter.format(date);

/** Formats a stored due date, falling back to the raw value if it is invalid. */
export function formatDueDateValue(value: string): string {
  const date = parseDueDate(value);
  return date ? formatDueDate(date) : value;
}

/**
 * Parses a SQLite `datetime('now')` timestamp, which is UTC without a zone
 * marker (`YYYY-MM-DD HH:MM:SS`).
 */
export function parseDbTimestamp(value: string): Date | null {
  const normalized = value.includes("T") ? value : value.replace(" ", "T");
  const date = new Date(
    normalized.endsWith("Z") ? normalized : `${normalized}Z`,
  );
  return Number.isNaN(date.getTime()) ? null : date;
}

const editedFormatter = new Intl.DateTimeFormat(undefined, {
  month: "short",
  day: "numeric",
});

const editedWithYearFormatter = new Intl.DateTimeFormat(undefined, {
  month: "short",
  day: "numeric",
  year: "numeric",
});

/** e.g. `Edited Nov 23`, including the year when it differs from this one. */
export function formatEditedAt(value: string): string | null {
  const date = parseDbTimestamp(value);
  if (!date) return null;

  const formatter =
    date.getFullYear() === new Date().getFullYear()
      ? editedFormatter
      : editedWithYearFormatter;

  return `Edited ${formatter.format(date)}`;
}
