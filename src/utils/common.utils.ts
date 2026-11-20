import type { SortOrder } from '@src/types/framework.types';

/** Reads a nested value with a dot path, e.g. "users.admin.name" or "items.0.id". */
export const getByPath = (source: unknown, path: string): unknown =>
  path
    .split('.')
    .reduce<unknown>(
      (current, key) =>
        current !== null && typeof current === 'object'
          ? (current as Record<string, unknown>)[key]
          : undefined,
      source,
    );

/** Returns parsed JSON, or the raw text when the content is not JSON. */
export const parseJsonSafe = (text: string): unknown => {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

/** Compares UI texts ignoring case and outer spaces; `exact = false` checks containment. */
export const matchesText = (actual: string, expected: string, exact = true): boolean => {
  const [a, e] = [actual.trim().toLowerCase(), expected.trim().toLowerCase()];
  return exact ? a === e : a.includes(e);
};

/** Returns a sorted copy, so an assertion can compare it with the original order. */
export const sortValues = <T extends string | number>(values: T[], order: SortOrder): T[] => {
  const sorted = [...values].sort((a, b) =>
    typeof a === 'number' && typeof b === 'number' ? a - b : String(a).localeCompare(String(b)),
  );
  return order === 'asc' ? sorted : sorted.reverse();
};

export const randomString = (length = 8): string =>
  Math.random()
    .toString(36)
    .slice(2, 2 + length);
