import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { query } from '../config/db';

export const getCategories = async (req: Request, res: Response) => {
  try {
    const [categories] = await query('SELECT * FROM forum_categories ORDER BY sort_order ASC');
    
    res.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error('获取分类失败:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
};

export const getPosts = async (req: Request, res: Response) => {
  try {
    const { page = 1, pageSize = 20, categoryId, companyId, isHot } = req.query;
    
    let sql = `SELECT p.*, u.nickname as user_nickname, u.avatar as user_avatar, c.name as category_name, 
               comp.name as company_name, comp.logo as company_logo
               FROM forum_posts p 
               LEFT JOIN users u ON p.user_id = u.id 
               LEFT JOIN forum_categories c ON p.category_id = c.id 
               LEFT JOIN companies comp ON p.company_id = comp.id 
               WHERE 1=1`;
    const params: any[] = [];
    
    if (categoryId) {
      sql += ' AND p.category_id = ?';
      params.push(categoryId);
    }
    if (companyId) {
      sql += ' AND p.company_id = ?';
      params.push(companyId);
    }
    if (isHot === 'true') {
      sql += ' AND p.is_hot = 1';
    }
    
    sql += ' ORDER BY p.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(pageSize as string));
    params.push((parseInt(page as string) - 1) * parseInt(pageSize as string));
    
    const [posts] = await query(sql, params);
    
    const [totalResult] = await query('SELECT COUNT(*) as total FROM forum_posts WHERE 1=1', params.slice(0, -2));
    
    res.json({
      success: true,
      data: {
        list: posts,
        total: totalResult[0]?.total || 0,
        page: parseInt(page as string),
        pageSize: parseInt(pageSize as string),
      },
    });
  } catch (error) {
    console.error('获取帖子列表失败:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
};

export const getPost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    await query('UPDATE forum_posts SET views = views + 1 WHERE id = ?', [id]);
    
    const [posts] = await query(
      `SELECT p.*, u.nickname as user_nickname, u.avatar as user_avatar, c.name as category_name, 
              comp.name as company_name, comp.logo as company_logo
       FROM forum_posts p 
       LEFT JOIN users u ON p.user_id = u.id 
       LEFT JOIN forum_categories c ON p.category_id = c.id 
       LEFT JOIN companies comp ON p.company_id = comp.id 
       WHERE p.id = ?`,
      [id]
    );
    
    if (posts.length === 0) {
      return res.status(404).json({ error: '帖子不存在' });
    }
    
    res.json({
      success: true,
      data: posts[0],
    });
  } catch (error) {
    console.error('获取帖子详情失败:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
};

export const createPost = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { title, content, category_id, company_id, is_anonymous = false } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({ error: '标题和内容不能为空' });
    }
    
    const postId = uuidv4();
    
    await query(
      'INSERT INTO forum_posts (id, user_id, category_id, company_id, title, content, is_anonymous) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [postId, userId, category_id, company_id, title, content, is_anonymous]
    );
    
    await query('UPDATE users SET points = points + 10 WHERE id = ?', [userId]);
    await query('INSERT INTO point_transactions (id, user_id, points, type, description) VALUES (?, ?, ?, ?, ?)', [
      uuidv4(), userId, 10, 'earn', '发布帖子奖励'
    ]);
    
    res.status(201).json({
      success: true,
      message: '发布成功',
      data: { id: postId, title },
    });
  } catch (error) {
    console.error('发布帖子失败:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
};

export const getComments = async (req: Request, res: Response) => {
  try {
    const { postId, page = 1, pageSize = 50 } = req.query;
    
    const [comments] = await query(
      `SELECT c.*, u.nickname as user_nickname, u.avatar as user_avatar, 
              pc.nickname as parent_nickname
       FROM forum_comments c 
       LEFT JOIN users u ON c.user_id = u.id 
       LEFT JOIN users pc ON c.parent_id = pc.id 
       WHERE c.post_id = ? 
       ORDER BY c.created_at ASC 
       LIMIT ? OFFSET ?`,
      [postId, parseInt(pageSize as string), (parseInt(page as string) - 1) * parseInt(pageSize as string)]
    );
    
    res.json({
      success: true,
      data: comments,
    });
  } catch (error) {
    console.error('获取评论失败:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
};

export const createComment = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { post_id, parent_id, content, is_anonymous = false } = req.body;
    
    if (!post_id || !content) {
      return res.status(400).json({ error: '帖子ID和内容不能为空' });
    }
    
    const commentId = uuidv4();
    
    await query(
      'INSERT INTO forum_comments (id, user_id, post_id, parent_id, content, is_anonymous) VALUES (?, ?, ?, ?, ?, ?)',
      [commentId, userId, post_id, parent_id, content, is_anonymous]
    );
    
    await query('UPDATE forum_posts SET comments = comments + 1 WHERE id = ?', [post_id]);
    await query('UPDATE users SET points = points + 5 WHERE id = ?', [userId]);
    await query('INSERT INTO point_transactions (id, user_id, points, type, description) VALUES (?, ?, ?, ?, ?)', [
      uuidv4(), userId, 5, 'earn', '发表评论奖励'
    ]);
    
    res.status(201).json({
      success: true,
      message: '评论成功',
      data: { id: commentId },
    });
  } catch (error) {
    console.error('发表评论失败:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
};

export const likePost = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { post_id } = req.body;
    
    if (!post_id) {
      return res.status(400).json({ error: '帖子ID不能为空' });
    }
    
    const [existing] = await query('SELECT id FROM post_likes WHERE user_id = ? AND post_id = ?', [userId, post_id]);
    
    if (existing.length > 0) {
      await query('DELETE FROM post_likes WHERE user_id = ? AND post_id = ?', [userId, post_id]);
      await query('UPDATE forum_posts SET likes = likes - 1 WHERE id = ?', [post_id]);
      return res.json({ success: true, message: '取消点赞', data: { liked: false } });
    }
    
    await query('INSERT INTO post_likes (id, user_id, post_id) VALUES (?, ?, ?)', [uuidv4(), userId, post_id]);
    await query('UPDATE forum_posts SET likes = likes + 1 WHERE id = ?', [post_id]);
    
    res.json({ success: true, message: '点赞成功', data: { liked: true } });
  } catch (error) {
    console.error('点赞失败:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
};

export const likeComment = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { comment_id } = req.body;
    
    if (!comment_id) {
      return res.status(400).json({ error: '评论ID不能为空' });
    }
    
    const [existing] = await query('SELECT id FROM comment_likes WHERE user_id = ? AND comment_id = ?', [userId, comment_id]);
    
    if (existing.length > 0) {
      await query('DELETE FROM comment_likes WHERE user_id = ? AND comment_id = ?', [userId, comment_id]);
      await query('UPDATE forum_comments SET likes = likes - 1 WHERE id = ?', [comment_id]);
      return res.json({ success: true, message: '取消点赞', data: { liked: false } });
    }
    
    await query('INSERT INTO comment_likes (id, user_id, comment_id) VALUES (?, ?, ?)', [uuidv4(), userId, comment_id]);
    await query('UPDATE forum_comments SET likes = likes + 1 WHERE id = ?', [comment_id]);
    
    res.json({ success: true, message: '点赞成功', data: { liked: true } });
  } catch (error) {
    console.error('评论点赞失败:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
};