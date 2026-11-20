import { expect, test } from '@playwright/test';
import { matchesText, sortValues } from '@src/utils/common.utils';

test.describe('matchesText', () => {
  test('matches whole text ignoring case and outer spaces', () => {
    expect(matchesText('  United Kingdom ', 'united kingdom')).toBe(true);
  });

  test('does not match part of the text by default', () => {
    expect(matchesText('United Kingdom', 'Kingdom')).toBe(false);
  });

  test('matches part of the text when exact is false', () => {
    expect(matchesText('United Kingdom', 'KINGDOM', false)).toBe(true);
  });

  test('returns false when the text is absent', () => {
    expect(matchesText('India', 'France', false)).toBe(false);
  });
});

test.describe('sortValues', () => {
  test('sorts numbers numerically, not as text', () => {
    expect(sortValues([10, 9, 100], 'asc')).toEqual([9, 10, 100]);
    expect(sortValues([10, 9, 100], 'desc')).toEqual([100, 10, 9]);
  });

  test('sorts strings alphabetically', () => {
    expect(sortValues(['b', 'c', 'a'], 'asc')).toEqual(['a', 'b', 'c']);
    expect(sortValues(['b', 'c', 'a'], 'desc')).toEqual(['c', 'b', 'a']);
  });

  test('does not change the input array', () => {
    const values = [3, 1, 2];
    sortValues(values, 'asc');
    expect(values).toEqual([3, 1, 2]);
  });
});
