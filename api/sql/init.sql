CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(36) PRIMARY KEY,
  phone VARCHAR(20) UNIQUE NOT NULL,
  email VARCHAR(100),
  password VARCHAR(255) NOT NULL,
  nickname VARCHAR(50) NOT NULL,
  avatar VARCHAR(255),
  role ENUM('jobseeker', 'company', 'admin') DEFAULT 'jobseeker',
  is_verified TINYINT(1) DEFAULT 0,
  points INT DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_phone (phone),
  INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS companies (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  name VARCHAR(100) NOT NULL,
  logo VARCHAR(255),
  description TEXT,
  industry VARCHAR(50),
  location VARCHAR(100),
  contact VARCHAR(50),
  phone VARCHAR(20),
  is_verified TINYINT(1) DEFAULT 0,
  is_certified TINYINT(1) DEFAULT 0,
  is_star TINYINT(1) DEFAULT 0,
  rating DECIMAL(2,1) DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_is_verified (is_verified)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS resumes (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  name VARCHAR(100) NOT NULL,
  title VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  email VARCHAR(100),
  education VARCHAR(20),
  experience VARCHAR(20),
  location VARCHAR(100),
  skills TEXT,
  summary TEXT,
  work_experience TEXT,
  education_experience TEXT,
  projects TEXT,
  template VARCHAR(50) DEFAULT 'professional',
  is_default TINYINT(1) DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_is_default (is_default)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS jobs (
  id VARCHAR(36) PRIMARY KEY,
  company_id VARCHAR(36) NOT NULL,
  title VARCHAR(100) NOT NULL,
  category VARCHAR(50),
  location VARCHAR(100),
  min_salary INT,
  max_salary INT,
  description TEXT,
  requirements TEXT,
  is_urgent TINYINT(1) DEFAULT 0,
  views INT DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
  INDEX idx_company_id (company_id),
  INDEX idx_category (category),
  INDEX idx_location (location),
  INDEX idx_is_urgent (is_urgent)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS applications (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  job_id VARCHAR(36) NOT NULL,
  resume_id VARCHAR(36) NOT NULL,
  status ENUM('pending', 'reviewing', 'accepted', 'rejected') DEFAULT 'pending',
  applied_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
  FOREIGN KEY (resume_id) REFERENCES resumes(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_job_id (job_id),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS forum_categories (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  description TEXT,
  sort_order INT DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS forum_posts (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  category_id VARCHAR(36),
  company_id VARCHAR(36),
  title VARCHAR(200) NOT NULL,
  content TEXT,
  views INT DEFAULT 0,
  likes INT DEFAULT 0,
  comments INT DEFAULT 0,
  is_anonymous TINYINT(1) DEFAULT 0,
  is_hot TINYINT(1) DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES forum_categories(id) ON DELETE SET NULL,
  FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE SET NULL,
  INDEX idx_user_id (user_id),
  INDEX idx_category_id (category_id),
  INDEX idx_is_hot (is_hot)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS forum_comments (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  post_id VARCHAR(36) NOT NULL,
  parent_id VARCHAR(36),
  content TEXT NOT NULL,
  is_anonymous TINYINT(1) DEFAULT 0,
  likes INT DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (post_id) REFERENCES forum_posts(id) ON DELETE CASCADE,
  FOREIGN KEY (parent_id) REFERENCES forum_comments(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_post_id (post_id),
  INDEX idx_parent_id (parent_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS short_videos (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  title VARCHAR(200),
  url VARCHAR(500) NOT NULL,
  thumbnail VARCHAR(500),
  tags TEXT,
  category VARCHAR(50),
  views INT DEFAULT 0,
  likes INT DEFAULT 0,
  shares INT DEFAULT 0,
  duration INT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS video_likes (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  video_id VARCHAR(36) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (video_id) REFERENCES short_videos(id) ON DELETE CASCADE,
  UNIQUE KEY uk_user_video (user_id, video_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS post_likes (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  post_id VARCHAR(36) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (post_id) REFERENCES forum_posts(id) ON DELETE CASCADE,
  UNIQUE KEY uk_user_post (user_id, post_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS comment_likes (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  comment_id VARCHAR(36) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (comment_id) REFERENCES forum_comments(id) ON DELETE CASCADE,
  UNIQUE KEY uk_user_comment (user_id, comment_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS point_transactions (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  points INT NOT NULL,
  type ENUM('earn', 'spend', 'bonus') DEFAULT 'earn',
  description VARCHAR(200),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_type (type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS company_reviews (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  company_id VARCHAR(36) NOT NULL,
  rating INT NOT NULL,
  content TEXT,
  is_anonymous TINYINT(1) DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_company_id (company_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO forum_categories (id, name, description, sort_order) VALUES
('1', '求职经验', '分享求职路上的经验和心得', 1),
('2', '面试技巧', '面试准备和技巧分享', 2),
('3', '公司推荐', '推荐优质企业和岗位', 3),
('4', '薪资待遇', '薪资讨论和待遇分享', 4),
('5', '职场生活', '工作日常和生活分享', 5),
('6', '生活讨论', '其他生活话题讨论', 6);

INSERT INTO users (id, phone, password, nickname, avatar, role, is_verified, points) VALUES
('user1', '13800138001', '$2b$10$N9qo8uLOickgx2ZMRZoMye.IjzqAKL9xL5jvMFVdNJHvGCgTq/VEq', '新泰职友', '', 'jobseeker', 1, 500),
('user2', '13800138002', '$2b$10$N9qo8uLOickgx2ZMRZoMye.IjzqAKL9xL5jvMFVdNJHvGCgTq/VEq', '职场达人', '', 'jobseeker', 1, 1000),
('user3', '13800138003', '$2b$10$N9qo8uLOickgx2ZMRZoMye.IjzqAKL9xL5jvMFVdNJHvGCgTq/VEq', 'HR总监', '', 'company', 1, 2000);

INSERT INTO companies (id, user_id, name, description, industry, location, contact, phone, is_verified, is_certified, is_star, rating) VALUES
('comp1', 'user3', '新泰科技有限公司', '专注于软件开发和技术服务的高新技术企业', '新兴产业', '青云街道', '张经理', '0538-1234567', 1, 1, 1, 4.8);

INSERT INTO jobs (id, company_id, title, category, location, min_salary, max_salary, description, requirements, is_urgent, views) VALUES
('job1', 'comp1', '前端开发工程师', '技术工程', '青云街道', 8000, 12000, '负责公司产品的前端开发工作，包括PC端和移动端', '本科及以上学历，3年以上前端开发经验，熟悉React、TypeScript', 1, 234),
('job2', 'comp1', '后端开发工程师', '技术工程', '青云街道', 10000, 15000, '负责公司系统的后端开发和维护', '本科及以上学历，3年以上后端开发经验，熟悉Java、Spring Boot', 0, 156);

INSERT INTO forum_posts (id, user_id, category_id, title, content, views, likes, comments, is_hot) VALUES
('post1', 'user1', '1', '在新泰找工作，这些坑千万别踩！', '作为一个在新泰工作了5年的老油条，给大家分享一下找工作时需要注意的一些坑...', 1234, 234, 56, 1),
('post2', 'user2', '2', '面试技巧分享：如何回答优缺点问题', '面试中最常见的问题之一，分享一下我的回答思路和技巧...', 2345, 345, 123, 1);

INSERT INTO forum_comments (id, user_id, post_id, content, likes) VALUES
('comment1', 'user2', 'post1', '感谢分享，非常实用！', 23),
('comment2', 'user3', 'post2', '很专业的建议，学习了！', 45);

INSERT INTO short_videos (id, user_id, title, url, thumbnail, tags, category, views, likes, shares, duration) VALUES
('video1', 'user1', '新泰职场小白入门指南', 'https://example.com/video1.mp4', 'https://example.com/video1.jpg', '职场,入门', '职场技巧', 1234, 234, 56, 750),
('video2', 'user2', '面试技巧分享', 'https://example.com/video2.mp4', 'https://example.com/video2.jpg', '面试,技巧', '求职技巧', 2345, 456, 123, 1200);

INSERT INTO resumes (id, user_id, name, title, phone, email, education, experience, location, skills, summary, template, is_default) VALUES
('resume1', 'user1', '专业版简历', '前端开发工程师', '13800138001', 'user1@example.com', '本科', '3年', '青云街道', 'React, TypeScript, Node.js, Vue', '3年前端开发经验，熟悉React、Vue等主流框架...', 'professional', 1);