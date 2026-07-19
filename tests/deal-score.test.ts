import { describe, it, expect } from 'vitest';
import { calculateDealScore, dealLabel } from '@/lib/deal-score';
import { compareMiles } from '@/lib/miles';

describe('deal score', () => {
  it('only labels exceptional evidence as imperdível', () => {
    const score = calculateDealScore({ discountPercent: 35, historicalPercentile: 5, direct: true, sourceFresh: true, sourceReliable: true });
    expect(score).toBeGreaterThanOrEqual(75);
    expect(dealLabel(score, { discountPercent: 35, historicalPercentile: 5 })).toBe('imperdivel');
    expect(dealLabel(90, { discountPercent: 4, historicalPercentile: 70 })).not.toBe('imperdivel');
  });
  it('compares miles', () => expect(compareMiles(3000, 60000, 300, 25).recommendation).toBe('milhas'));
});
