import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { query } from '../config/db';
import { generateToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';

export const register = async (req: Request, res: Response) => {
  try {
    const { phone, password, nickname, role = 'jobseeker' } = req.body;
    
    if (!phone || !password || !nickname) {
      return res.status(400).json({ error: '手机号、密码和昵称不能为空' });
    }
    
    const existing = await query('SELECT id FROM users WHERE phone = ?', [phone]);
    if (existing.length > 0) {
      return res.status(400).json({ error: '该手机号已被注册' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = uuidv4();
    
    await query(
      'INSERT INTO users (id, phone, password, nickname, role) VALUES (?, ?, ?, ?, ?)',
      [userId, phone, hashedPassword, nickname, role]
    );
    
    const token = generateToken({ id: userId, phone, role });
    const refreshToken = generateRefreshToken({ id: userId });
    
    res.status(201).json({
      success: true,
      message: '注册成功',
      data: {
        user: { id: userId, phone, nickname, role },
        token,
        refreshToken,
      },
    });
  } catch (error) {
    console.error('注册失败:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { phone, password } = req.body;
    
    if (!phone || !password) {
      return res.status(400).json({ error: '手机号和密码不能为空' });
    }
    
    const users = await query('SELECT * FROM users WHERE phone = ?', [phone]);
    
    if (users.length === 0) {
      return res.status(400).json({ error: '手机号或密码错误' });
    }
    
    const user = users[0];
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      return res.status(400).json({ error: '手机号或密码错误' });
    }
    
    const token = generateToken({ id: user.id, phone: user.phone, role: user.role });
    const refreshToken = generateRefreshToken({ id: user.id });
    
    res.json({
      success: true,
      message: '登录成功',
      data: {
        user: { id: user.id, phone: user.phone, nickname: user.nickname, role: user.role, avatar: user.avatar, points: user.points },
        token,
        refreshToken,
      },
    });
  } catch (error) {
    console.error('登录失败:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken: token } = req.body;
    
    if (!token) {
      return res.status(400).json({ error: 'refresh token不能为空' });
    }
    
    const decoded = verifyRefreshToken(token);
    
    if (!decoded) {
      return res.status(401).json({ error: '无效的refresh token' });
    }
    
    const users = await query('SELECT id, phone, nickname, role FROM users WHERE id = ?', [decoded.id]);
    
    if (users.length === 0) {
      return res.status(401).json({ error: '用户不存在' });
    }
    
    const user = users[0];
    const newToken = generateToken({ id: user.id, phone: user.phone, role: user.role });
    
    res.json({
      success: true,
      data: { token: newToken },
    });
  } catch (error) {
    console.error('刷新token失败:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
};