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
    .filter((statement) => statement.startsWith('INSERT INTO') || statement.startsWith('UPDATE '));

  for (const statement of statements) {
    await sequelize.query(statement);
  }
  console.log(`Seeded ${statements.length} content rows`);
}

const RASPBERRY_NEGRONI = '2a3de022-045f-4c4a-a7a9-631cd28128ac';

export async function ensureBottleDisplayNames(): Promise<void> {
  const [rows] = await sequelize.query(
    `SELECT COLUMN_NAME AS name FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'bottles' AND COLUMN_NAME = 'display_name_en'`,
  );
  if (!Array.isArray(rows) || rows.length === 0) {
    await sequelize.query(
      'ALTER TABLE bottles ADD COLUMN display_name_en VARCHAR(80) NULL, ADD COLUMN display_name_he VARCHAR(80) NULL',
    );
  }
  await sequelize.query(
    `UPDATE bottles
     SET display_name_en = 'RASPBERRY NEGRONI', display_name_he = 'RASPBERRY NEGRONI'
     WHERE id = :id AND (display_name_en IS NULL OR display_name_en = '')`,
    { replacements: { id: RASPBERRY_NEGRONI } },
  );
}
