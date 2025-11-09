import { Prisma } from "@/generated/prisma/client";

export function asStringArray(value: Prisma.JsonValue | undefined | null): string[] {
  if (Array.isArray(value)) {
    return value
      .map((item) => (typeof item === "string" ? item.trim() : item != null ? String(item) : ""))
      .filter((item) => item.length > 0);
  }

  return [];
}

export function parseMultilineList(value: FormDataEntryValue | null): string[] {
  if (!value) {
    return [];
  }

  return value
    .toString()
    .split(/\r?\n|,/)
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0);
}

export function formatDateInput(value: string | Date | undefined | null) {
  if (!value) {
    return "";
  }

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toISOString().slice(0, 10);
}
