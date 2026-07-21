import { Request, Response } from 'express';
import { query } from '../config/db';

export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    
    const [users] = await query(
      'SELECT id, phone, email, nickname, avatar, role, is_verified, points, created_at FROM users WHERE id = ?',
      [userId]
    );
    
    if (users.length === 0) {
      return res.status(404).json({ error: '用户不存在' });
    }
    
    res.json({
      success: true,
      data: users[0],
    });
  } catch (error) {
    console.error('获取用户信息失败:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
};

export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { nickname, email, avatar } = req.body;
    
    const updates: string[] = [];
    const params: any[] = [];
    
    if (nickname) {
      updates.push('nickname = ?');
      params.push(nickname);
    }
    if (email) {
      updates.push('email = ?');
      params.push(email);
    }
    if (avatar) {
      updates.push('avatar = ?');
      params.push(avatar);
    }
    
    if (updates.length === 0) {
      return res.status(400).json({ error: '请提供要更新的字段' });
    }
    
    params.push(userId);
    
    await query(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`, params);
    
    const [users] = await query('SELECT id, phone, email, nickname, avatar, role, is_verified, points FROM users WHERE id = ?', [userId]);
    
    res.json({
      success: true,
      message: '更新成功',
      data: users[0],
    });
  } catch (error) {
    console.error('更新用户信息失败:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
};

export const getUserPoints = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    
    const [transactions] = await query(
      'SELECT id, points, type, description, created_at FROM point_transactions WHERE user_id = ? ORDER BY created_at DESC LIMIT 20',
      [userId]
    );
    
    res.json({
      success: true,
      data: transactions,
    });
  } catch (error) {
    console.error('获取积分记录失败:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
};