import type { SortBy, SortDir } from "../types/carSorting";

function stripControlChars(value: string) {
  let out = "";
  for (let i = 0; i < value.length; i++) {
    const code = value.charCodeAt(i);
    if (code <= 31 || code === 127) continue;
    out += value[i];
  }
  return out;
}

export const MAX_TEXT_INPUT_LENGTH = 64;
export const MAX_URL_LENGTH = 2048;

export const SORT_BY_VALUES = ["make", "model", "year", "color"] as const;
export const SORT_DIR_VALUES = ["asc", "desc"] as const;

export function sanitizeTextInput(
  value: string,
  maxLength = MAX_TEXT_INPUT_LENGTH
) {
  const withoutControl = stripControlChars(value);
  return withoutControl.length > maxLength
    ? withoutControl.slice(0, maxLength)
    : withoutControl;
}

export function sanitizeDigitsInput(value: string, maxLength: number) {
  const digitsOnly = value.replace(/\D/g, "");
  return digitsOnly.length > maxLength
    ? digitsOnly.slice(0, maxLength)
    : digitsOnly;
}

export function parseCarYear(value: string) {
  const digits = sanitizeDigitsInput(value, 4);
  if (digits.length !== 4) return undefined;

  const year = Number(digits);
  const maxYear = new Date().getFullYear() + 1;
  if (year < 1886 || year > maxYear) return undefined;
  return year;
}

export function sanitizeHttpUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  if (trimmed.length > MAX_URL_LENGTH) return undefined;

  try {
    const url = new URL(trimmed);
    if (url.protocol !== "http:" && url.protocol !== "https:") return undefined;
    if (url.username || url.password) return undefined;
    return url.toString();
  } catch {
    return undefined;
  }
}

export function isSortBy(value: unknown): value is SortBy {
  return (
    typeof value === "string" &&
    (SORT_BY_VALUES as readonly string[]).includes(value)
  );
}

export function isSortDir(value: unknown): value is SortDir {
  return (
    typeof value === "string" &&
    (SORT_DIR_VALUES as readonly string[]).includes(value)
  );
}
