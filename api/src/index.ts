import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { PORT, CORS_ORIGIN } from './config/env';
import { query, pool } from './config/db';
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import resumeRoutes from './routes/resumes';
import jobRoutes from './routes/jobs';
import forumRoutes from './routes/forum';
import videoRoutes from './routes/videos';
import * as fs from 'fs';
import * as path from 'path';

const app = express();

app.use(helmet());

app.use(cors({
  origin: CORS_ORIGIN.split(','),
  credentials: true,
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: '请求过于频繁，请稍后再试',
});

app.use(limiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/forum', forumRoutes);
app.use('/api/videos', videoRoutes);

app.get('/api/health', async (_req, res) => {
  try {
    await query('SELECT 1');
    res.status(200).json({ status: 'ok', database: 'connected' });
  } catch {
    res.status(200).json({ status: 'ok', database: 'disconnected' });
  }
});

app.use((_req, res) => {
  res.status(404).json({ error: '接口不存在' });
});

app.use((error: any, _req: express.Request, res: express.Response) => {
  console.error(error);
  res.status(500).json({ error: '服务器内部错误' });
});

async function initDatabase() {
  const sqlPath = path.join(__dirname, '../sql/init.sql');
  const sqlContent = fs.readFileSync(sqlPath, 'utf8');
  const statements = sqlContent.split(';').filter(s => s.trim());
  
  for (const stmt of statements) {
    try {
      await query(stmt);
    } catch (e) {
      console.log('执行语句时出错:', stmt.substring(0, 80), e);
    }
  }
  console.log('数据库初始化完成');
}

async function startServer(): Promise<void> {
  try {
    await query('SELECT 1');
    console.log('数据库连接成功');
  } catch (error) {
    console.error('数据库连接失败:', error);
    process.exit(1);
  }

  try {
    await query('SELECT COUNT(*) FROM users');
    console.log('数据库表已存在');
  } catch (error: any) {
    if (error.code === 'ER_NO_SUCH_TABLE' || error.code === '42P01') {
      console.log('数据库表不存在，正在初始化...');
      await initDatabase();
    } else {
      console.error('检查数据库表失败:', error);
    }
  }
  
  app.listen(PORT, () => {
    console.log(`服务器运行在 http://localhost:${PORT}`);
  });
}

startServer().catch(console.error);