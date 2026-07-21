import mysql from 'mysql2/promise';
import { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT } from '../config/env';
import * as fs from 'fs';
import * as path from 'path';

async function initDatabase() {
  const conn = await mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    port: parseInt(DB_PORT),
  });

  try {
    await conn.execute(`CREATE DATABASE IF NOT EXISTS ${DB_NAME}`);
    await conn.execute(`USE ${DB_NAME}`);

    const sqlPath = path.join(__dirname, '../../sql/init.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');

    const statements = sqlContent.split(';').filter(s => s.trim());
    
    for (const stmt of statements) {
      try {
        await conn.execute(stmt);
      } catch (e) {
        console.log('执行语句时出错:', stmt.substring(0, 100), e);
      }
    }

    console.log('数据库初始化完成');
  } catch (error) {
    console.error('数据库初始化失败:', error);
  } finally {
    await conn.end();
  }
}

initDatabase();