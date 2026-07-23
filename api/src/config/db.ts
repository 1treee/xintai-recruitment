import { Pool, QueryResult, QueryResultRow } from 'pg';
import { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT, DB_SSL } from './env';

export const pool = new Pool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  port: DB_PORT,
  max: 10,
  ssl: DB_SSL ? { rejectUnauthorized: false } : false,
});

export const query = async <T extends QueryResultRow = QueryResultRow>(sql: string, params?: any[]): Promise<T[]> => {
  const result = await pool.query<T>(sql, params);
  return result.rows;
};

export const getConnection = () => pool.connect();