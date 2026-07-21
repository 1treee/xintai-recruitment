import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { query } from '../config/db';

export const getVideos = async (req: Request, res: Response) => {
  try {
    const { page = 1, pageSize = 20, category } = req.query;
    
    let sql = `SELECT v.*, u.nickname as user_nickname, u.avatar as user_avatar 
               FROM short_videos v 
               LEFT JOIN users u ON v.user_id = u.id 
               WHERE 1=1`;
    const params: any[] = [];
    
    if (category) {
      sql += ' AND v.category = ?';
      params.push(category);
    }
    
    sql += ' ORDER BY v.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(pageSize as string));
    params.push((parseInt(page as string) - 1) * parseInt(pageSize as string));
    
    const videos = await query(sql, params);
    
    const countParams = params.slice(0, -2);
    let countSql = 'SELECT COUNT(*) as total FROM short_videos WHERE 1=1';
    if (category) {
      countSql += ' AND category = ?';
    }
    const totalResult = await query(countSql, countParams);
    
    res.json({
      success: true,
      data: {
        list: videos,
        total: totalResult[0]?.total || 0,
        page: parseInt(page as string),
        pageSize: parseInt(pageSize as string),
      },
    });
  } catch (error) {
    console.error('获取视频列表失败:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
};

export const getVideo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    await query('UPDATE short_videos SET views = views + 1 WHERE id = ?', [id]);
    
    const videos = await query(
      `SELECT v.*, u.nickname as user_nickname, u.avatar as user_avatar 
       FROM short_videos v 
       LEFT JOIN users u ON v.user_id = u.id 
       WHERE v.id = ?`,
      [id]
    );
    
    if (videos.length === 0) {
      return res.status(404).json({ error: '视频不存在' });
    }
    
    res.json({
      success: true,
      data: videos[0],
    });
  } catch (error) {
    console.error('获取视频详情失败:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
};

export const createVideo = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { title, url, thumbnail, tags, category, duration } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: '视频URL不能为空' });
    }
    
    const videoId = uuidv4();
    
    await query(
      'INSERT INTO short_videos (id, user_id, title, url, thumbnail, tags, category, duration) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [videoId, userId, title, url, thumbnail, tags, category, duration]
    );
    
    await query('UPDATE users SET points = points + 20 WHERE id = ?', [userId]);
    await query('INSERT INTO point_transactions (id, user_id, points, type, description) VALUES (?, ?, ?, ?, ?)', [
      uuidv4(), userId, 20, 'earn', '发布视频奖励'
    ]);
    
    res.status(201).json({
      success: true,
      message: '发布成功',
      data: { id: videoId, title },
    });
  } catch (error) {
    console.error('发布视频失败:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
};

export const likeVideo = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { video_id } = req.body;
    
    if (!video_id) {
      return res.status(400).json({ error: '视频ID不能为空' });
    }
    
    const existing = await query('SELECT id FROM video_likes WHERE user_id = ? AND video_id = ?', [userId, video_id]);
    
    if (existing.length > 0) {
      await query('DELETE FROM video_likes WHERE user_id = ? AND video_id = ?', [userId, video_id]);
      await query('UPDATE short_videos SET likes = likes - 1 WHERE id = ?', [video_id]);
      return res.json({ success: true, message: '取消点赞', data: { liked: false } });
    }
    
    await query('INSERT INTO video_likes (id, user_id, video_id) VALUES (?, ?, ?)', [uuidv4(), userId, video_id]);
    await query('UPDATE short_videos SET likes = likes + 1 WHERE id = ?', [video_id]);
    
    res.json({ success: true, message: '点赞成功', data: { liked: true } });
  } catch (error) {
    console.error('视频点赞失败:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
};

export const getRecommendedVideos = async (req: Request, res: Response) => {
  try {
    const videos = await query(
      `SELECT v.*, u.nickname as user_nickname, u.avatar as user_avatar 
       FROM short_videos v 
       LEFT JOIN users u ON v.user_id = u.id 
       ORDER BY v.views DESC, v.likes DESC 
       LIMIT 10`
    );
    
    res.json({
      success: true,
      data: videos,
    });
  } catch (error) {
    console.error('获取推荐视频失败:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
};