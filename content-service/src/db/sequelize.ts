import { Sequelize } from 'sequelize-typescript';
import config from 'config';
import mysql from 'mysql2/promise';
import Bottle from '../models/Bottle';
import Cocktail from '../models/Cocktail';
import Event from '../models/Event';
import GalleryImage from '../models/GalleryImage';
import OpeningHours from '../models/OpeningHours';
import SiteSettings from '../models/SiteSettings';
import Spirit from '../models/Spirit';

type DbConfig = {
  host: string;
  port?: number;
  username: string;
  password: string;
  database: string;
  dialectOptions?: object;
};

export async function ensureDatabaseExists(): Promise<void> {
  const dbConfig = config.get<DbConfig>('db');
  const connection = await mysql.createConnection({
    host: dbConfig.host,
    port: dbConfig.port,
    user: dbConfig.username,
    password: dbConfig.password,
  });
  await connection.query(
    `CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
  );
  await connection.end();
}

const sequelize = new Sequelize({
  dialect: 'mysql',
  models: [Cocktail, Bottle, Spirit, Event, GalleryImage, OpeningHours, SiteSettings],
  logging: process.env.NODE_ENV === 'production' ? false : console.log,
  ...config.get<DbConfig>('db'),
});

export default sequelize;
