import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { query } from '../config/db';

export const getResumes = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    
    const [resumes] = await query(
      'SELECT id, name, title, phone, email, education, experience, location, skills, summary, template, is_default, updated_at FROM resumes WHERE user_id = ? ORDER BY updated_at DESC',
      [userId]
    );
    
    res.json({
      success: true,
      data: resumes,
    });
  } catch (error) {
    console.error('获取简历列表失败:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
};

export const getResume = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    
    const [resumes] = await query(
      'SELECT * FROM resumes WHERE id = ? AND user_id = ?',
      [id, userId]
    );
    
    if (resumes.length === 0) {
      return res.status(404).json({ error: '简历不存在' });
    }
    
    res.json({
      success: true,
      data: resumes[0],
    });
  } catch (error) {
    console.error('获取简历失败:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
};

export const createResume = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { name, title, phone, email, education, experience, location, skills, summary, work_experience, education_experience, projects, template = 'professional', is_default = false } = req.body;
    
    if (!name || !title) {
      return res.status(400).json({ error: '简历名称和期望职位不能为空' });
    }
    
    if (is_default) {
      await query('UPDATE resumes SET is_default = 0 WHERE user_id = ?', [userId]);
    }
    
    const resumeId = uuidv4();
    
    await query(
      'INSERT INTO resumes (id, user_id, name, title, phone, email, education, experience, location, skills, summary, work_experience, education_experience, projects, template, is_default) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [resumeId, userId, name, title, phone, email, education, experience, location, skills, summary, work_experience, education_experience, projects, template, is_default]
    );
    
    res.status(201).json({
      success: true,
      message: '创建成功',
      data: { id: resumeId, name, title, template, is_default },
    });
  } catch (error) {
    console.error('创建简历失败:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
};

export const updateResume = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    const { name, title, phone, email, education, experience, location, skills, summary, work_experience, education_experience, projects, template, is_default } = req.body;
    
    const [existing] = await query('SELECT id FROM resumes WHERE id = ? AND user_id = ?', [id, userId]);
    
    if (existing.length === 0) {
      return res.status(404).json({ error: '简历不存在' });
    }
    
    const updates: string[] = [];
    const params: any[] = [];
    
    if (name !== undefined) { updates.push('name = ?'); params.push(name); }
    if (title !== undefined) { updates.push('title = ?'); params.push(title); }
    if (phone !== undefined) { updates.push('phone = ?'); params.push(phone); }
    if (email !== undefined) { updates.push('email = ?'); params.push(email); }
    if (education !== undefined) { updates.push('education = ?'); params.push(education); }
    if (experience !== undefined) { updates.push('experience = ?'); params.push(experience); }
    if (location !== undefined) { updates.push('location = ?'); params.push(location); }
    if (skills !== undefined) { updates.push('skills = ?'); params.push(skills); }
    if (summary !== undefined) { updates.push('summary = ?'); params.push(summary); }
    if (work_experience !== undefined) { updates.push('work_experience = ?'); params.push(work_experience); }
    if (education_experience !== undefined) { updates.push('education_experience = ?'); params.push(education_experience); }
    if (projects !== undefined) { updates.push('projects = ?'); params.push(projects); }
    if (template !== undefined) { updates.push('template = ?'); params.push(template); }
    
    if (is_default !== undefined) {
      updates.push('is_default = ?');
      params.push(is_default);
      if (is_default) {
        await query('UPDATE resumes SET is_default = 0 WHERE user_id = ? AND id != ?', [userId, id]);
      }
    }
    
    if (updates.length === 0) {
      return res.status(400).json({ error: '请提供要更新的字段' });
    }
    
    params.push(id);
    params.push(userId);
    
    await query(`UPDATE resumes SET ${updates.join(', ')} WHERE id = ? AND user_id = ?`, params);
    
    res.json({
      success: true,
      message: '更新成功',
    });
  } catch (error) {
    console.error('更新简历失败:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
};

export const deleteResume = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    
    const [existing] = await query('SELECT id FROM resumes WHERE id = ? AND user_id = ?', [id, userId]);
    
    if (existing.length === 0) {
      return res.status(404).json({ error: '简历不存在' });
    }
    
    await query('DELETE FROM resumes WHERE id = ? AND user_id = ?', [id, userId]);
    
    res.json({
      success: true,
      message: '删除成功',
    });
  } catch (error) {
    console.error('删除简历失败:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
};

export const setDefaultResume = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    
    const [existing] = await query('SELECT id FROM resumes WHERE id = ? AND user_id = ?', [id, userId]);
    
    if (existing.length === 0) {
      return res.status(404).json({ error: '简历不存在' });
    }
    
    await query('UPDATE resumes SET is_default = 0 WHERE user_id = ?', [userId]);
    await query('UPDATE resumes SET is_default = 1 WHERE id = ? AND user_id = ?', [id, userId]);
    
    res.json({
      success: true,
      message: '设置默认简历成功',
    });
  } catch (error) {
    console.error('设置默认简历失败:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
};