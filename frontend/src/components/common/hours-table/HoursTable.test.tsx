/**
 * @vitest-environment jsdom
 */
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import HoursTable from './HoursTable';

describe('HoursTable', () => {
  it('keeps opensAt before closesAt inside an LTR isolate in Hebrew', () => {
    const { container } = render(
      <div lang="he" dir="rtl">
        <HoursTable
          hours={[
            { dayOfWeek: 0, opensAt: '18:00', closesAt: '00:00', isClosed: false },
            { dayOfWeek: 4, opensAt: '18:00', closesAt: '01:00', isClosed: false },
          ]}
          locale="he"
          caption="שעות"
          closedLabel="סגור"
          todayLabel="היום"
          today={0}
        />
      </div>,
    );

    const isolates = [...container.querySelectorAll('bdi')];
    expect(isolates).toHaveLength(2);
    for (const isolate of isolates) {
      expect(isolate.getAttribute('dir')).toBe('ltr');
    }
    const sunday = isolates[0]?.textContent ?? '';
    const thursday = isolates[1]?.textContent ?? '';
    expect(sunday.indexOf('18:00')).toBeLessThan(sunday.indexOf('00:00'));
    expect(thursday.indexOf('18:00')).toBeLessThan(thursday.indexOf('01:00'));
  });
});
