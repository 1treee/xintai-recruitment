import useAuthStore from '../stores/authStore';
import { User, Resume, Job, Company, ForumPost, ForumComment, ShortVideo, Poll, LoginResponse, RegisterResponse } from '../types';

const BASE_URL = '/api';

export async function request<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const token = useAuthStore.getState().token;
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  
  const response = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers,
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || '请求失败');
  }
  
  return response.json();
}

export async function login(phone: string, password: string): Promise<LoginResponse> {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ phone, password }),
  });
}

export async function register(phone: string, password: string, nickname: string): Promise<RegisterResponse> {
  return request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ phone, password, nickname }),
  });
}

export async function getProfile(): Promise<User> {
  return request('/user/profile');
}

export async function updateProfile(data: Partial<User>): Promise<User> {
  return request('/user/profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function getPoints(): Promise<{ points: number }> {
  return request('/user/points');
}

export async function addPoints(points: number, type: string, description: string): Promise<void> {
  await request('/user/points', {
    method: 'POST',
    body: JSON.stringify({ points, type, description }),
  });
}

export async function getResumes(filters?: {
  category?: string;
  industry?: string;
  location?: string;
  is_urgent?: boolean;
}): Promise<Resume[]> {
  const params = new URLSearchParams();
  if (filters?.category) params.set('category', filters.category);
  if (filters?.industry) params.set('industry', filters.industry);
  if (filters?.location) params.set('location', filters.location);
  if (filters?.is_urgent !== undefined) params.set('is_urgent', String(filters.is_urgent));
  
  return request(`/talent?${params}`);
}

export async function getResumeById(id: string): Promise<Resume> {
  return request(`/talent/${id}`);
}

export async function createResume(data: Omit<Resume, 'id' | 'created_at'>): Promise<Resume> {
  return request('/talent', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateResume(id: string, data: Partial<Resume>): Promise<Resume> {
  return request(`/talent/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function getUrgentResumes(): Promise<Resume[]> {
  return request('/talent/urgent');
}

export async function getJobs(filters?: {
  category?: string;
  location?: string;
  is_urgent?: boolean;
  keyword?: string;
}): Promise<Job[]> {
  const params = new URLSearchParams();
  if (filters?.category) params.set('category', filters.category);
  if (filters?.location) params.set('location', filters.location);
  if (filters?.is_urgent !== undefined) params.set('is_urgent', String(filters.is_urgent));
  if (filters?.keyword) params.set('keyword', filters.keyword);
  
  return request(`/jobs?${params}`);
}

export async function getJobById(id: string): Promise<Job> {
  return request(`/jobs/${id}`);
}

export async function createJob(data: Omit<Job, 'id' | 'views' | 'created_at'>): Promise<Job> {
  return request('/jobs', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function applyJob(jobId: string): Promise<void> {
  await request('/jobs/apply', {
    method: 'POST',
    body: JSON.stringify({ job_id: jobId }),
  });
}

export async function getRecommendedJobs(): Promise<Job[]> {
  return request('/jobs/recommend');
}

export async function getCompanies(filters?: {
  industry?: string;
  location?: string;
  is_certified?: boolean;
  is_star?: boolean;
}): Promise<Company[]> {
  const params = new URLSearchParams();
  if (filters?.industry) params.set('industry', filters.industry);
  if (filters?.location) params.set('location', filters.location);
  if (filters?.is_certified !== undefined) params.set('is_certified', String(filters.is_certified));
  if (filters?.is_star !== undefined) params.set('is_star', String(filters.is_star));
  
  return request(`/companies?${params}`);
}

export async function getCompanyById(id: string): Promise<Company> {
  return request(`/companies/${id}`);
}

export async function getCompanyReviews(id: string): Promise<{ rating: number; content: string }[]> {
  return request(`/companies/${id}/reviews`);
}

export async function createCompanyReview(companyId: string, rating: number, content: string, is_anonymous: boolean): Promise<void> {
  await request(`/companies/${companyId}/reviews`, {
    method: 'POST',
    body: JSON.stringify({ rating, content, is_anonymous }),
  });
}

export async function getForumCategories(): Promise<{ id: string; name: string }[]> {
  return request('/forum/categories');
}

export async function getForumPosts(filters?: {
  category_id?: string;
  company_id?: string;
  keyword?: string;
}): Promise<ForumPost[]> {
  const params = new URLSearchParams();
  if (filters?.category_id) params.set('category_id', filters.category_id);
  if (filters?.company_id) params.set('company_id', filters.company_id);
  if (filters?.keyword) params.set('keyword', filters.keyword);
  
  return request(`/forum/posts?${params}`);
}

export async function getForumPostById(id: string): Promise<ForumPost> {
  return request(`/forum/posts/${id}`);
}

export async function createForumPost(data: {
  category_id: string;
  company_id?: string;
  title: string;
  content: string;
  is_anonymous?: boolean;
}): Promise<ForumPost> {
  return request('/forum/posts', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getForumComments(postId: string): Promise<ForumComment[]> {
  return request(`/forum/posts/${postId}/comments`);
}

export async function createForumComment(postId: string, content: string, is_anonymous?: boolean): Promise<ForumComment> {
  return request(`/forum/posts/${postId}/comments`, {
    method: 'POST',
    body: JSON.stringify({ content, is_anonymous }),
  });
}

export async function likeForumPost(id: string): Promise<void> {
  await request(`/forum/posts/${id}/like`, {
    method: 'POST',
  });
}

export async function getShortVideos(tags?: string): Promise<ShortVideo[]> {
  const params = tags ? `?tags=${tags}` : '';
  return request(`/entertainment/videos${params}`);
}

export async function getPolls(): Promise<Poll[]> {
  return request('/entertainment/polls');
}

export async function votePoll(pollId: string, optionIndex: number): Promise<void> {
  await request(`/entertainment/polls/${pollId}/vote`, {
    method: 'POST',
    body: JSON.stringify({ option_index: optionIndex }),
  });
}

export async function getPollResults(pollId: string): Promise<{ option_index: number; count: number }[]> {
  return request(`/entertainment/polls/${pollId}/results`);
}