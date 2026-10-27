import { describe, expect, it } from 'vitest';
import { isOpenNow, nextChange } from './hours';
import { defaultHours } from './site-defaults';

describe('default Jerusalem hours', () => {
  it('keeps Friday 00:30 open from Thursday night', () => {
    expect(isOpenNow(defaultHours, new Date('2026-10-29T22:30:00Z'))).toBe(true);
  });

  it('treats Thursday 00:30 as closed', () => {
    expect(isOpenNow(defaultHours, new Date('2026-10-28T22:30:00Z'))).toBe(false);
  });

  it('treats Sunday 17:59 as closed and 18:00 as open', () => {
    expect(isOpenNow(defaultHours, new Date('2026-11-01T15:59:00Z'))).toBe(false);
    expect(isOpenNow(defaultHours, new Date('2026-11-01T16:00:00Z'))).toBe(true);
  });

  it('stays closed on a day flagged isClosed', () => {
    const hours = defaultHours.map((row) => (
      row.dayOfWeek === 0 ? { ...row, isClosed: true } : row
    ));
    expect(isOpenNow(hours, new Date('2026-11-01T17:00:00Z'))).toBe(false);
  });

  it('reports the next open and the overnight close', () => {
    const beforeOpen = nextChange(defaultHours, new Date('2026-11-01T15:59:00Z'));
    expect(beforeOpen?.kind).toBe('open');
    expect(beforeOpen?.at.toISOString()).toBe('2026-11-01T16:00:00.000Z');

    const whileOpen = nextChange(defaultHours, new Date('2026-10-29T20:00:00Z'));
    expect(whileOpen?.kind).toBe('close');
    expect(whileOpen?.at.toISOString()).toBe('2026-10-29T23:00:00.000Z');
  });
});
