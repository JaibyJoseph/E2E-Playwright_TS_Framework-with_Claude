import { readFileSync } from 'node:fs';
import path from 'node:path';
import { getByPath } from '@src/utils/common.utils';

const DATA_ROOT = path.resolve(process.cwd(), 'test', 'test-data');
const cache = new Map<string, unknown>();

/** Loads a JSON file from test/test-data once and caches it. */
export const readTestData = <T = unknown>(file: string): T => {
  if (!cache.has(file)) {
    const content = readFileSync(path.join(DATA_ROOT, file), 'utf-8');
    cache.set(file, JSON.parse(content));
  }
  return cache.get(file) as T;
};

/** Returns one entry from a JSON file by dot path and fails fast when it is missing. */
export const getTestData = <T = unknown>(file: string, key: string): T => {
  const value = getByPath(readTestData(file), key);
  if (value === undefined) throw new Error(`Test data key "${key}" not found in ${file}`);
  return value as T;
};
