export interface User {
  id: string;
  phone: string;
  email?: string;
  nickname: string;
  avatar?: string;
  role: string;
  is_verified: boolean;
  points: number;
  created_at: string;
  updated_at: string;
}

export interface Resume {
  id: string;
  user_id: string;
  name: string;
  phone: string;
  education?: string;
  experience?: string;
  skills?: string;
  video_url?: string;
  category?: string;
  industry?: string;
  location?: string;
  is_urgent: boolean;
  created_at: string;
}

export interface Company {
  id: string;
  name: string;
  logo?: string;
  description?: string;
  industry?: string;
  location?: string;
  contact?: string;
  phone?: string;
  is_verified: boolean;
  is_certified: boolean;
  is_star: boolean;
  rating: number;
  created_at: string;
}

export interface Job {
  id: string;
  company_id: string;
  title: string;
  category?: string;
  location?: string;
  min_salary?: number;
  max_salary?: number;
  description?: string;
  requirements?: string;
  is_urgent: boolean;
  views: number;
  created_at: string;
}

export interface CompanyReview {
  id: string;
  user_id: string;
  company_id: string;
  rating: number;
  content?: string;
  is_anonymous: boolean;
  created_at: string;
}

export interface ForumCategory {
  id: string;
  name: string;
  description?: string;
  sort_order: number;
  created_at: string;
}

export interface ForumPost {
  id: string;
  user_id: string;
  category_id: string;
  company_id?: string;
  title: string;
  content?: string;
  views: number;
  likes: number;
  comments: number;
  is_anonymous: boolean;
  is_hot: boolean;
  created_at: string;
}

export interface ForumComment {
  id: string;
  user_id: string;
  post_id: string;
  content: string;
  is_anonymous: boolean;
  created_at: string;
}

export interface ShortVideo {
  id: string;
  title?: string;
  url: string;
  thumbnail?: string;
  tags?: string;
  views: number;
  likes: number;
  shares: number;
  created_at: string;
}

export interface Poll {
  id: string;
  question: string;
  options: string[];
  is_anonymous: boolean;
  created_at: string;
  end_at?: string;
}

export interface PollVote {
  id: string;
  user_id: string;
  poll_id: string;
  option_index: number;
  created_at: string;
}

export interface PointTransaction {
  id: string;
  user_id: string;
  points: number;
  type: string;
  description: string;
  created_at: string;
}

export interface Application {
  id: string;
  user_id: string;
  job_id: string;
  status: string;
  applied_at: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface RegisterResponse {
  token: string;
  user: User;
}

export type CategoryType = '普工技工' | '销售客服' | '行政文员' | '餐饮服务' | '司机物流' | '技术工程';
export type IndustryType = '制造业' | '服务业' | '商贸业' | '新兴产业';
export type LocationType = '青云街道' | '新汶街道' | '开发区' | '各乡镇';

export const CATEGORIES: CategoryType[] = ['普工技工', '销售客服', '行政文员', '餐饮服务', '司机物流', '技术工程'];
export const INDUSTRIES: IndustryType[] = ['制造业', '服务业', '商贸业', '新兴产业'];
export const LOCATIONS: LocationType[] = ['青云街道', '新汶街道', '开发区', '各乡镇'];