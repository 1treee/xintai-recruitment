# 新泰优聘人才社区

基于 React + TypeScript + Express 构建的本地化招聘社区平台。

## 📋 项目简介

新泰优聘人才社区是一个集人才库、职位招聘、短视频娱乐和求职论坛于一体的综合性招聘平台，致力于为新泰本地求职者和企业提供便捷的交流服务。

## ✨ 功能特性

- **人才库** - 浏览本地人才信息，查看简历详情
- **职位招聘** - 智能筛选职位，一键投递简历
- **职场圈** - 短视频分享，点赞评论互动
- **职友说** - 求职论坛，交流求职经验

## 🛠 技术栈

### 前端
- React 18
- TypeScript
- Tailwind CSS 3
- Vite 8
- Zustand (状态管理)
- React Router DOM 6
- Lucide React (图标)

### 后端
- Node.js
- Express 4
- TypeScript
- MySQL 8
- JWT (认证)
- bcryptjs (密码加密)

## 🚀 快速开始

### 环境要求

- Node.js >= 18
- MySQL >= 8

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
# 同时启动前端和后端
npm run dev

# 仅启动前端
npm run dev:frontend

# 仅启动后端
npm run dev:backend
```

### 构建生产版本

```bash
npm run build
```

### 启动生产服务

```bash
npm start
```

## 📁 项目结构

```
xintai-recruitment/
├── api/                    # 后端代码
│   ├── src/
│   │   ├── controllers/    # 控制器
│   │   ├── routes/         # 路由
│   │   ├── middleware/     # 中间件
│   │   ├── config/         # 配置
│   │   ├── utils/          # 工具函数
│   │   └── index.ts        # 入口文件
│   └── sql/init.sql        # 数据库初始化脚本
├── src/                    # 前端代码
│   ├── components/         # 组件
│   ├── pages/              # 页面
│   ├── stores/             # 状态管理
│   ├── services/           # API服务
│   ├── types/              # TypeScript类型定义
│   └── utils/              # 工具函数
├── index.html              # HTML入口
├── vite.config.ts          # Vite配置
├── tailwind.config.js      # Tailwind配置
└── package.json            # 项目依赖
```

## 🔧 配置说明

### 后端配置

在 `api/src/config/env.ts` 中配置数据库连接：

```typescript
export const DB_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'xintai_recruitment',
  port: parseInt(process.env.DB_PORT || '3306'),
};
```

### 环境变量

```bash
# 数据库配置
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=xintai_recruitment

# JWT密钥
JWT_SECRET=your_secret_key
```

## 🌐 API 接口

### 认证接口
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `POST /api/auth/logout` - 用户登出

### 用户接口
- `GET /api/users/profile` - 获取用户信息
- `PUT /api/users/profile` - 更新用户信息

### 职位接口
- `GET /api/jobs` - 获取职位列表
- `GET /api/jobs/:id` - 获取职位详情
- `POST /api/jobs` - 创建职位

### 简历接口
- `GET /api/resumes` - 获取简历列表
- `POST /api/resumes` - 创建简历
- `PUT /api/resumes/:id` - 更新简历

### 视频接口
- `GET /api/videos` - 获取视频列表
- `POST /api/videos` - 创建视频
- `POST /api/videos/:id/like` - 点赞视频

### 论坛接口
- `GET /api/forum` - 获取帖子列表
- `POST /api/forum` - 创建帖子
- `POST /api/forum/:id/comment` - 评论帖子

## 📝 数据库设计

### 用户表 (users)
| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT | 主键 |
| phone | VARCHAR | 手机号 |
| password | VARCHAR | 密码(加密) |
| nickname | VARCHAR | 昵称 |
| avatar | VARCHAR | 头像 |
| role | VARCHAR | 角色 |
| points | INT | 积分 |
| created_at | DATETIME | 创建时间 |

### 职位表 (jobs)
| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT | 主键 |
| title | VARCHAR | 职位名称 |
| company | VARCHAR | 公司名称 |
| salary | VARCHAR | 薪资 |
| location | VARCHAR | 工作地点 |
| description | TEXT | 职位描述 |
| created_at | DATETIME | 创建时间 |

### 简历表 (resumes)
| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT | 主键 |
| user_id | INT | 用户ID |
| name | VARCHAR | 姓名 |
| phone | VARCHAR | 手机号 |
| education | VARCHAR | 学历 |
| experience | TEXT | 工作经验 |
| skills | TEXT | 技能标签 |
| created_at | DATETIME | 创建时间 |

## 🚀 部署说明

### 前端部署 (GitHub Pages)

```bash
# 构建前端
npm run build:frontend

# 推送至 gh-pages 分支
git add dist
git commit -m "deploy frontend"
git subtree push --prefix dist origin gh-pages
```

### 后端部署 (Render.com)

1. 在 Render.com 创建 Web Service
2. 选择 GitHub 仓库
3. 设置 Build Command: `npm run build:backend`
4. 设置 Start Command: `node api/dist/index.js`
5. 添加环境变量

### 数据库部署 (PlanetScale)

1. 在 PlanetScale 创建数据库
2. 获取连接字符串
3. 在后端配置中更新数据库连接

## 📄 开源协议

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！
