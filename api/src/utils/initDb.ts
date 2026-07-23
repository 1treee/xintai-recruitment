import { pool } from '../config/db';
import * as fs from 'fs';
import * as path from 'path';

async function initDatabase() {
  const client = await pool.connect();

  try {
    const sqlPath = path.join(__dirname, '../../sql/init.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');

    const statements = sqlContent.split(';').filter(s => s.trim());
    
    for (const stmt of statements) {
      try {
        await client.query(stmt);
      } catch (e) {
        console.log('执行语句时出错:', stmt.substring(0, 100), e);
      }
    }

    console.log('数据库初始化完成');
  } catch (error) {
    console.error('数据库初始化失败:', error);
  } finally {
    client.release();
  }
}

initDatabase();