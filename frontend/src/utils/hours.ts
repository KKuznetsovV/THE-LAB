export type OpeningDay = {
  dayOfWeek: number;
  opensAt: string;
  closesAt: string;
  isClosed: boolean;
};

export type HoursChange = {
  at: Date;
  kind: 'open' | 'close';
};

const WEEKDAY: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

type Wall = {
  year: number;
  month: number;
  day: number;
  weekday: number;
  minutes: number;
};

function wallClock(date: Date): Wall {
  const bag: Record<string, string> = {};
  for (const part of new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Jerusalem',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date)) {
    if (part.type !== 'literal') bag[part.type] = part.value;
  }
  return {
    year: Number(bag.year),
    month: Number(bag.month),
    day: Number(bag.day),
    weekday: WEEKDAY[bag.weekday] ?? 0,
    minutes: Number(bag.hour) * 60 + Number(bag.minute),
  };
}

function toMinutes(value: string): number {
  const [hour, minute] = value.split(':');
  return Number(hour) * 60 + Number(minute);
}

function overnight(row: OpeningDay): boolean {
  return toMinutes(row.closesAt) <= toMinutes(row.opensAt);
}

function byDay(hours: OpeningDay[], weekday: number): OpeningDay | undefined {
  return hours.find((row) => row.dayOfWeek === weekday);
}

function offsetMinutes(date: Date): number {
  const wall = wallClock(date);
  const asUtc = Date.UTC(wall.year, wall.month - 1, wall.day, Math.floor(wall.minutes / 60), wall.minutes % 60);
  return asUtc - date.getTime();
}

function zoned(year: number, month: number, day: number, minuteOfDay: number): Date {
  const guess = new Date(Date.UTC(year, month - 1, day, Math.floor(minuteOfDay / 60), minuteOfDay % 60));
  const first = new Date(guess.getTime() - offsetMinutes(guess));
  return new Date(guess.getTime() - offsetMinutes(first));
}

function shiftDay(year: number, month: number, day: number, days: number): { year: number; month: number; day: number } {
  const next = new Date(Date.UTC(year, month - 1, day + days));
  return { year: next.getUTCFullYear(), month: next.getUTCMonth() + 1, day: next.getUTCDate() };
}

export function weekdayInJerusalem(date: Date): number {
  return wallClock(date).weekday;
}

export function isOpenNow(hours: OpeningDay[], date: Date): boolean {
  const now = wallClock(date);
  const yesterday = byDay(hours, (now.weekday + 6) % 7);
  if (yesterday && !yesterday.isClosed && overnight(yesterday) && now.minutes < toMinutes(yesterday.closesAt)) {
    return true;
  }
  const today = byDay(hours, now.weekday);
  if (!today || today.isClosed) return false;
  const opens = toMinutes(today.opensAt);
  const closes = toMinutes(today.closesAt);
  if (overnight(today)) return now.minutes >= opens;
  return now.minutes >= opens && now.minutes < closes;
}

export function nextChange(hours: OpeningDay[], date: Date): HoursChange | null {
  const now = wallClock(date);
  const yesterday = byDay(hours, (now.weekday + 6) % 7);
  if (yesterday && !yesterday.isClosed && overnight(yesterday) && now.minutes < toMinutes(yesterday.closesAt)) {
    return { at: zoned(now.year, now.month, now.day, toMinutes(yesterday.closesAt)), kind: 'close' };
  }

  const today = byDay(hours, now.weekday);
  if (today && !today.isClosed) {
    const opens = toMinutes(today.opensAt);
    const closes = toMinutes(today.closesAt);
    if (overnight(today) && now.minutes >= opens) {
      const next = shiftDay(now.year, now.month, now.day, 1);
      return { at: zoned(next.year, next.month, next.day, closes), kind: 'close' };
    }
    if (!overnight(today) && now.minutes >= opens && now.minutes < closes) {
      return { at: zoned(now.year, now.month, now.day, closes), kind: 'close' };
    }
    if (now.minutes < opens) {
      return { at: zoned(now.year, now.month, now.day, opens), kind: 'open' };
    }
  }

  for (let ahead = 1; ahead <= 7; ahead += 1) {
    const nextDay = shiftDay(now.year, now.month, now.day, ahead);
    const probe = zoned(nextDay.year, nextDay.month, nextDay.day, 12 * 60);
    const row = byDay(hours, wallClock(probe).weekday);
    if (row && !row.isClosed) {
      return { at: zoned(nextDay.year, nextDay.month, nextDay.day, toMinutes(row.opensAt)), kind: 'open' };
    }
  }
  return null;
}
