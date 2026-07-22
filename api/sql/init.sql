CREATE TYPE user_role AS ENUM ('jobseeker', 'company', 'admin');
CREATE TYPE application_status AS ENUM ('pending', 'reviewing', 'accepted', 'rejected');
CREATE TYPE point_type AS ENUM ('earn', 'spend', 'bonus');

CREATE TABLE IF NOT EXISTS users (
  id VARCHAR PRIMARY KEY,
  phone VARCHAR UNIQUE NOT NULL,
  email VARCHAR,
  password VARCHAR NOT NULL,
  nickname VARCHAR NOT NULL,
  avatar VARCHAR,
  role user_role DEFAULT 'jobseeker',
  is_verified BOOLEAN DEFAULT FALSE,
  points INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

CREATE TABLE IF NOT EXISTS companies (
  id VARCHAR PRIMARY KEY,
  user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR NOT NULL,
  logo VARCHAR,
  description TEXT,
  industry VARCHAR,
  location VARCHAR,
  contact VARCHAR,
  phone VARCHAR,
  is_verified BOOLEAN DEFAULT FALSE,
  is_certified BOOLEAN DEFAULT FALSE,
  is_star BOOLEAN DEFAULT FALSE,
  rating DECIMAL(2,1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_companies_user_id ON companies(user_id);
CREATE INDEX IF NOT EXISTS idx_companies_is_verified ON companies(is_verified);

CREATE TABLE IF NOT EXISTS resumes (
  id VARCHAR PRIMARY KEY,
  user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR NOT NULL,
  title VARCHAR NOT NULL,
  phone VARCHAR,
  email VARCHAR,
  education VARCHAR,
  experience VARCHAR,
  location VARCHAR,
  skills TEXT,
  summary TEXT,
  work_experience TEXT,
  education_experience TEXT,
  projects TEXT,
  template VARCHAR DEFAULT 'professional',
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_resumes_user_id ON resumes(user_id);
CREATE INDEX IF NOT EXISTS idx_resumes_is_default ON resumes(is_default);

CREATE TABLE IF NOT EXISTS jobs (
  id VARCHAR PRIMARY KEY,
  company_id VARCHAR NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  title VARCHAR NOT NULL,
  category VARCHAR,
  location VARCHAR,
  min_salary INT,
  max_salary INT,
  description TEXT,
  requirements TEXT,
  is_urgent BOOLEAN DEFAULT FALSE,
  views INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_jobs_company_id ON jobs(company_id);
CREATE INDEX IF NOT EXISTS idx_jobs_category ON jobs(category);
CREATE INDEX IF NOT EXISTS idx_jobs_location ON jobs(location);
CREATE INDEX IF NOT EXISTS idx_jobs_is_urgent ON jobs(is_urgent);

CREATE TABLE IF NOT EXISTS applications (
  id VARCHAR PRIMARY KEY,
  user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  job_id VARCHAR NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  resume_id VARCHAR NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
  status application_status DEFAULT 'pending',
  applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_applications_user_id ON applications(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_job_id ON applications(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);

CREATE TABLE IF NOT EXISTS forum_categories (
  id VARCHAR PRIMARY KEY,
  name VARCHAR NOT NULL,
  description TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS forum_posts (
  id VARCHAR PRIMARY KEY,
  user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category_id VARCHAR REFERENCES forum_categories(id) ON DELETE SET NULL,
  company_id VARCHAR REFERENCES companies(id) ON DELETE SET NULL,
  title VARCHAR NOT NULL,
  content TEXT,
  views INT DEFAULT 0,
  likes INT DEFAULT 0,
  comments INT DEFAULT 0,
  is_anonymous BOOLEAN DEFAULT FALSE,
  is_hot BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_forum_posts_user_id ON forum_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_forum_posts_category_id ON forum_posts(category_id);
CREATE INDEX IF NOT EXISTS idx_forum_posts_is_hot ON forum_posts(is_hot);

CREATE TABLE IF NOT EXISTS forum_comments (
  id VARCHAR PRIMARY KEY,
  user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  post_id VARCHAR NOT NULL REFERENCES forum_posts(id) ON DELETE CASCADE,
  parent_id VARCHAR REFERENCES forum_comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_anonymous BOOLEAN DEFAULT FALSE,
  likes INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_forum_comments_user_id ON forum_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_forum_comments_post_id ON forum_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_forum_comments_parent_id ON forum_comments(parent_id);

CREATE TABLE IF NOT EXISTS short_videos (
  id VARCHAR PRIMARY KEY,
  user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR,
  url VARCHAR NOT NULL,
  thumbnail VARCHAR,
  tags TEXT,
  category VARCHAR,
  views INT DEFAULT 0,
  likes INT DEFAULT 0,
  shares INT DEFAULT 0,
  duration INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_short_videos_user_id ON short_videos(user_id);
CREATE INDEX IF NOT EXISTS idx_short_videos_category ON short_videos(category);

CREATE TABLE IF NOT EXISTS video_likes (
  id VARCHAR PRIMARY KEY,
  user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  video_id VARCHAR NOT NULL REFERENCES short_videos(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE CONSTRAINT uk_video_likes_user_video UNIQUE (user_id, video_id)
);

CREATE TABLE IF NOT EXISTS post_likes (
  id VARCHAR PRIMARY KEY,
  user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  post_id VARCHAR NOT NULL REFERENCES forum_posts(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE CONSTRAINT uk_post_likes_user_post UNIQUE (user_id, post_id)
);

CREATE TABLE IF NOT EXISTS comment_likes (
  id VARCHAR PRIMARY KEY,
  user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  comment_id VARCHAR NOT NULL REFERENCES forum_comments(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE CONSTRAINT uk_comment_likes_user_comment UNIQUE (user_id, comment_id)
);

CREATE TABLE IF NOT EXISTS point_transactions (
  id VARCHAR PRIMARY KEY,
  user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  points INT NOT NULL,
  type point_type DEFAULT 'earn',
  description VARCHAR,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_point_transactions_user_id ON point_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_point_transactions_type ON point_transactions(type);

CREATE TABLE IF NOT EXISTS company_reviews (
  id VARCHAR PRIMARY KEY,
  user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  company_id VARCHAR NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  rating INT NOT NULL,
  content TEXT,
  is_anonymous BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_company_reviews_user_id ON company_reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_company_reviews_company_id ON company_reviews(company_id);

INSERT INTO forum_categories (id, name, description, sort_order) VALUES
('1', '求职经验', '分享求职路上的经验和心得', 1),
('2', '面试技巧', '面试准备和技巧分享', 2),
('3', '公司推荐', '推荐优质企业和岗位', 3),
('4', '薪资待遇', '薪资讨论和待遇分享', 4),
('5', '职场生活', '工作日常和生活分享', 5),
('6', '生活讨论', '其他生活话题讨论', 6);

INSERT INTO users (id, phone, password, nickname, avatar, role, is_verified, points) VALUES
('user1', '13800138001', '$2b$10$N9qo8uLOickgx2ZMRZoMye.IjzqAKL9xL5jvMFVdNJHvGCgTq/VEq', '新泰职友', '', 'jobseeker', TRUE, 500),
('user2', '13800138002', '$2b$10$N9qo8uLOickgx2ZMRZoMye.IjzqAKL9xL5jvMFVdNJHvGCgTq/VEq', '职场达人', '', 'jobseeker', TRUE, 1000),
('user3', '13800138003', '$2b$10$N9qo8uLOickgx2ZMRZoMye.IjzqAKL9xL5jvMFVdNJHvGCgTq/VEq', 'HR总监', '', 'company', TRUE, 2000);

INSERT INTO companies (id, user_id, name, description, industry, location, contact, phone, is_verified, is_certified, is_star, rating) VALUES
('comp1', 'user3', '新泰科技有限公司', '专注于软件开发和技术服务的高新技术企业', '新兴产业', '青云街道', '张经理', '0538-1234567', TRUE, TRUE, TRUE, 4.8);

INSERT INTO jobs (id, company_id, title, category, location, min_salary, max_salary, description, requirements, is_urgent, views) VALUES
('job1', 'comp1', '前端开发工程师', '技术工程', '青云街道', 8000, 12000, '负责公司产品的前端开发工作，包括PC端和移动端', '本科及以上学历，3年以上前端开发经验，熟悉React、TypeScript', TRUE, 234),
('job2', 'comp1', '后端开发工程师', '技术工程', '青云街道', 10000, 15000, '负责公司系统的后端开发和维护', '本科及以上学历，3年以上后端开发经验，熟悉Java、Spring Boot', FALSE, 156);

INSERT INTO forum_posts (id, user_id, category_id, title, content, views, likes, comments, is_hot) VALUES
('post1', 'user1', '1', '在新泰找工作，这些坑千万别踩！', '作为一个在新泰工作了5年的老油条，给大家分享一下找工作时需要注意的一些坑...', 1234, 234, 56, TRUE),
('post2', 'user2', '2', '面试技巧分享：如何回答优缺点问题', '面试中最常见的问题之一，分享一下我的回答思路和技巧...', 2345, 345, 123, TRUE);

INSERT INTO forum_comments (id, user_id, post_id, content, likes) VALUES
('comment1', 'user2', 'post1', '感谢分享，非常实用！', 23),
('comment2', 'user3', 'post2', '很专业的建议，学习了！', 45);

INSERT INTO short_videos (id, user_id, title, url, thumbnail, tags, category, views, likes, shares, duration) VALUES
('video1', 'user1', '新泰职场小白入门指南', 'https://example.com/video1.mp4', 'https://example.com/video1.jpg', '职场,入门', '职场技巧', 1234, 234, 56, 750),
('video2', 'user2', '面试技巧分享', 'https://example.com/video2.mp4', 'https://example.com/video2.jpg', '面试,技巧', '求职技巧', 2345, 456, 123, 1200);

INSERT INTO resumes (id, user_id, name, title, phone, email, education, experience, location, skills, summary, template, is_default) VALUES
('resume1', 'user1', '专业版简历', '前端开发工程师', '13800138001', 'user1@example.com', '本科', '3年', '青云街道', 'React, TypeScript, Node.js, Vue', '3年前端开发经验，熟悉React、Vue等主流框架...', 'professional', TRUE);
