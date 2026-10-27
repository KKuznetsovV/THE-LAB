import { readFile } from 'node:fs/promises';
import path from 'node:path';
import Cocktail from '../models/Cocktail';
import sequelize from './sequelize';

const CANDIDATES = [
  path.resolve(__dirname, '../../../db/seed.sql'),
  path.resolve(__dirname, '../../../../db/seed.sql'),
];

export async function seedContentIfEmpty(): Promise<void> {
  const existing = await Cocktail.count();
  if (existing > 0) return;

  let sql = '';
  for (const candidate of CANDIDATES) {
    try {
      sql = await readFile(candidate, 'utf8');
      break;
    } catch {
      sql = '';
    }
  }
  if (!sql) throw new Error('db/seed.sql was not found');

  const statements = sql
    .split('\n')
    .filter((line) => !line.trim().startsWith('--'))
    .join('\n')
    .split(/;\s*\n/)
    .map((statement) => statement.trim())
    .filter((statement) => statement.startsWith('INSERT INTO'));

  for (const statement of statements) {
    await sequelize.query(statement);
  }
  console.log(`Seeded ${statements.length} content rows`);
}
