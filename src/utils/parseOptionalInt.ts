export function parseOptionalInt(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return undefined;

  if (!/^[+-]?\d+$/.test(trimmed)) return undefined;

  const parsed = Number(trimmed);
  if (!Number.isSafeInteger(parsed)) return undefined;

  return parsed;
}
