import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { query } from '../config/db';

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: '未授权访问' });
  }
  
  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token);
  
  if (!decoded) {
    return res.status(401).json({ error: '无效的token' });
  }
  
  const [users] = await query('SELECT id, phone, nickname, role FROM users WHERE id = ?', [decoded.id]);
  
  if (!users || users.length === 0) {
    return res.status(401).json({ error: '用户不存在' });
  }
  
  req.user = users[0];
  next();
};

export const requireRole = (role: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ error: '权限不足' });
    }
    next();
  };
};