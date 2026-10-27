export function deletedOnly<T extends { id: string }>(live: T[], everything: T[]): T[] {
  const ids = new Set(live.map((row) => row.id));
  return everything.filter((row) => !ids.has(row.id));
}

export function moveBy<T extends { id: string }>(items: T[], id: string, direction: -1 | 1): T[] | null {
  const index = items.findIndex((item) => item.id === id);
  const next = index + direction;
  if (index < 0 || next < 0 || next >= items.length) return null;
  const copy = items.slice();
  const [row] = copy.splice(index, 1);
  if (!row) return null;
  copy.splice(next, 0, row);
  return copy;
}

export function optionalHttps(value: string): boolean {
  return value.trim() === '' || value.trim().startsWith('https://');
}

export function parsePrice(value: string): number | null {
  const trimmed = value.trim();
  if (trimmed === '') return null;
  if (!/^\d+$/.test(trimmed)) return Number.NaN;
  const price = Number(trimmed);
  if (price > 2000) return Number.NaN;
  return price;
}
