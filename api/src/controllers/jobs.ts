import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { query } from '../config/db';

export const getJobs = async (req: Request, res: Response) => {
  try {
    const { page = 1, pageSize = 20, category, location, minSalary, maxSalary, isUrgent } = req.query;
    
    let sql = `SELECT j.*, c.name as company_name, c.logo as company_logo, c.rating 
               FROM jobs j 
               LEFT JOIN companies c ON j.company_id = c.id 
               WHERE 1=1`;
    const params: any[] = [];
    
    if (category) {
      sql += ' AND j.category = ?';
      params.push(category);
    }
    if (location) {
      sql += ' AND j.location LIKE ?';
      params.push(`%${location}%`);
    }
    if (minSalary) {
      sql += ' AND j.min_salary >= ?';
      params.push(minSalary);
    }
    if (maxSalary) {
      sql += ' AND j.max_salary <= ?';
      params.push(maxSalary);
    }
    if (isUrgent === 'true') {
      sql += ' AND j.is_urgent = 1';
    }
    
    sql += ' ORDER BY j.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(pageSize as string));
    params.push((parseInt(page as string) - 1) * parseInt(pageSize as string));
    
    const [jobs] = await query(sql, params);
    
    const [totalResult] = await query('SELECT COUNT(*) as total FROM jobs WHERE 1=1', params.slice(0, -2));
    
    res.json({
      success: true,
      data: {
        list: jobs,
        total: totalResult[0]?.total || 0,
        page: parseInt(page as string),
        pageSize: parseInt(pageSize as string),
      },
    });
  } catch (error) {
    console.error('获取职位列表失败:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
};

export const getJob = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    await query('UPDATE jobs SET views = views + 1 WHERE id = ?', [id]);
    
    const [jobs] = await query(
      `SELECT j.*, c.name as company_name, c.logo as company_logo, c.description as company_description, 
              c.industry as company_industry, c.contact as company_contact, c.phone as company_phone, c.rating
       FROM jobs j 
       LEFT JOIN companies c ON j.company_id = c.id 
       WHERE j.id = ?`,
      [id]
    );
    
    if (jobs.length === 0) {
      return res.status(404).json({ error: '职位不存在' });
    }
    
    res.json({
      success: true,
      data: jobs[0],
    });
  } catch (error) {
    console.error('获取职位详情失败:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
};

export const createJob = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    
    const [companies] = await query('SELECT id FROM companies WHERE user_id = ?', [userId]);
    if (companies.length === 0) {
      return res.status(400).json({ error: '请先注册企业信息' });
    }
    const companyId = companies[0].id;
    
    const { title, category, location, min_salary, max_salary, description, requirements, is_urgent = false } = req.body;
    
    if (!title || !min_salary || !max_salary) {
      return res.status(400).json({ error: '职位名称和薪资不能为空' });
    }
    
    const jobId = uuidv4();
    
    await query(
      'INSERT INTO jobs (id, company_id, title, category, location, min_salary, max_salary, description, requirements, is_urgent) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [jobId, companyId, title, category, location, min_salary, max_salary, description, requirements, is_urgent]
    );
    
    res.status(201).json({
      success: true,
      message: '发布成功',
      data: { id: jobId, title },
    });
  } catch (error) {
    console.error('发布职位失败:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
};

export const getCompanyJobs = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    
    const [companies] = await query('SELECT id FROM companies WHERE user_id = ?', [userId]);
    if (companies.length === 0) {
      return res.status(400).json({ error: '请先注册企业信息' });
    }
    const companyId = companies[0].id;
    
    const [jobs] = await query('SELECT * FROM jobs WHERE company_id = ? ORDER BY created_at DESC', [companyId]);
    
    res.json({
      success: true,
      data: jobs,
    });
  } catch (error) {
    console.error('获取企业职位失败:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
};

export const applyJob = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { job_id, resume_id } = req.body;
    
    if (!job_id || !resume_id) {
      return res.status(400).json({ error: '职位ID和简历ID不能为空' });
    }
    
    const [existing] = await query('SELECT id FROM applications WHERE user_id = ? AND job_id = ?', [userId, job_id]);
    
    if (existing.length > 0) {
      return res.status(400).json({ error: '您已投递该职位' });
    }
    
    const applicationId = uuidv4();
    
    await query(
      'INSERT INTO applications (id, user_id, job_id, resume_id) VALUES (?, ?, ?, ?)',
      [applicationId, userId, job_id, resume_id]
    );
    
    res.status(201).json({
      success: true,
      message: '投递成功',
      data: { id: applicationId },
    });
  } catch (error) {
    console.error('投递职位失败:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
};

export const getUserApplications = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    
    const [applications] = await query(
      `SELECT a.*, j.title as job_title, c.name as company_name, c.logo as company_logo, r.name as resume_name
       FROM applications a 
       LEFT JOIN jobs j ON a.job_id = j.id 
       LEFT JOIN companies c ON j.company_id = c.id 
       LEFT JOIN resumes r ON a.resume_id = r.id 
       WHERE a.user_id = ? 
       ORDER BY a.applied_at DESC`,
      [userId]
    );
    
    res.json({
      success: true,
      data: applications,
    });
  } catch (error) {
    console.error('获取投递记录失败:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
};