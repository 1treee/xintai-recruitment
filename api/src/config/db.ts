import mysql from 'mysql2/promise';
import { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT, DB_SSL } from './env';

export const pool = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  port: DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4',
  ssl: DB_SSL ? { rejectUnauthorized: false } : undefined,
});

export const query = async <T = any>(sql: string, params?: any[]): Promise<T[]> => {
  const [results] = await pool.query(sql, params);
  return results as T[];
};

export const getConnection = () => pool.getConnection();

