function partsOf(date: Date): Record<string, string> {
  const bag: Record<string, string> = {};
  for (const part of new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Jerusalem',
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).formatToParts(date)) {
    bag[part.type] = part.value;
  }
  if (bag.hour === '24') bag.hour = '00';
  return bag;
}

export function toJerusalemInput(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  const bag = partsOf(date);
  return `${bag.year}-${bag.month}-${bag.day}T${bag.hour}:${bag.minute}`;
}

export function fromJerusalemInput(value: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(value);
  if (!match) return value;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const hour = Number(match[4]);
  const minute = Number(match[5]);
  const utc = new Date(Date.UTC(year, month - 1, day, hour, minute));
  const bag = partsOf(utc);
  const asUtc = Date.UTC(Number(bag.year), Number(bag.month) - 1, Number(bag.day), Number(bag.hour), Number(bag.minute), Number(bag.second));
  return new Date(utc.getTime() - (asUtc - utc.getTime())).toISOString();
}
