const BASE_URL = '/api';

const getToken = () => {
  return localStorage.getItem('token');
};

const request = async <T>(url: string, options: RequestInit = {}): Promise<T> => {
  const headers = new Headers({
    'Content-Type': 'application/json',
    ...options.headers,
  });

  const token = getToken();
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || '请求失败');
  }

  return data;
};

export const authApi = {
  register: (data: { phone: string; password: string; nickname: string; role?: string }) =>
    request<{ success: boolean; message: string; data: { user: any; token: string; refreshToken: string } }>(
      '/auth/register',
      { method: 'POST', body: JSON.stringify(data) }
    ),
  login: (data: { phone: string; password: string }) =>
    request<{ success: boolean; message: string; data: { user: any; token: string; refreshToken: string } }>(
      '/auth/login',
      { method: 'POST', body: JSON.stringify(data) }
    ),
  refreshToken: (data: { refreshToken: string }) =>
    request<{ success: boolean; data: { token: string } }>(
      '/auth/refresh',
      { method: 'POST', body: JSON.stringify(data) }
    ),
};

export const userApi = {
  getProfile: () =>
    request<{ success: boolean; data: any }>('/users/profile'),
  updateProfile: (data: { nickname?: string; email?: string; avatar?: string }) =>
    request<{ success: boolean; message: string; data: any }>(
      '/users/profile',
      { method: 'PUT', body: JSON.stringify(data) }
    ),
  getPoints: () =>
    request<{ success: boolean; data: any[] }>('/users/points'),
};

export const resumeApi = {
  getList: () =>
    request<{ success: boolean; data: any[] }>('/resumes'),
  getDetail: (id: string) =>
    request<{ success: boolean; data: any }>(`/resumes/${id}`),
  create: (data: any) =>
    request<{ success: boolean; message: string; data: any }>(
      '/resumes',
      { method: 'POST', body: JSON.stringify(data) }
    ),
  update: (id: string, data: any) =>
    request<{ success: boolean; message: string }>(
      `/resumes/${id}`,
      { method: 'PUT', body: JSON.stringify(data) }
    ),
  delete: (id: string) =>
    request<{ success: boolean; message: string }>(
      `/resumes/${id}`,
      { method: 'DELETE' }
    ),
  setDefault: (id: string) =>
    request<{ success: boolean; message: string }>(
      `/resumes/${id}/default`,
      { method: 'POST' }
    ),
};

export const jobApi = {
  getList: (params?: { page?: number; pageSize?: number; category?: string; location?: string; minSalary?: number; maxSalary?: number; isUrgent?: boolean }) => {
    const query = new URLSearchParams(params as any).toString();
    return request<{ success: boolean; data: { list: any[]; total: number; page: number; pageSize: number } }>(
      `/jobs?${query}`
    );
  },
  getDetail: (id: string) =>
    request<{ success: boolean; data: any }>(`/jobs/${id}`),
  apply: (data: { job_id: string; resume_id: string }) =>
    request<{ success: boolean; message: string; data: any }>(
      '/jobs/apply',
      { method: 'POST', body: JSON.stringify(data) }
    ),
  getApplications: () =>
    request<{ success: boolean; data: any[] }>('/jobs/applications'),
};

export const forumApi = {
  getCategories: () =>
    request<{ success: boolean; data: any[] }>('/forum/categories'),
  getPosts: (params?: { page?: number; pageSize?: number; categoryId?: string; isHot?: boolean }) => {
    const query = new URLSearchParams(params as any).toString();
    return request<{ success: boolean; data: { list: any[]; total: number; page: number; pageSize: number } }>(
      `/forum/posts?${query}`
    );
  },
  getPost: (id: string) =>
    request<{ success: boolean; data: any }>(`/forum/posts/${id}`),
  createPost: (data: { title: string; content: string; category_id?: string; company_id?: string; is_anonymous?: boolean }) =>
    request<{ success: boolean; message: string; data: any }>(
      '/forum/posts',
      { method: 'POST', body: JSON.stringify(data) }
    ),
  getComments: (params: { postId: string; page?: number; pageSize?: number }) => {
    const query = new URLSearchParams(params as any).toString();
    return request<{ success: boolean; data: any[] }>(`/forum/comments?${query}`);
  },
  createComment: (data: { post_id: string; parent_id?: string; content: string; is_anonymous?: boolean }) =>
    request<{ success: boolean; message: string; data: any }>(
      '/forum/comments',
      { method: 'POST', body: JSON.stringify(data) }
    ),
  likePost: (data: { post_id: string }) =>
    request<{ success: boolean; message: string; data: { liked: boolean } }>(
      '/forum/posts/like',
      { method: 'POST', body: JSON.stringify(data) }
    ),
  likeComment: (data: { comment_id: string }) =>
    request<{ success: boolean; message: string; data: { liked: boolean } }>(
      '/forum/comments/like',
      { method: 'POST', body: JSON.stringify(data) }
    ),
};

export const videoApi = {
  getList: (params?: { page?: number; pageSize?: number; category?: string }) => {
    const query = new URLSearchParams(params as any).toString();
    return request<{ success: boolean; data: { list: any[]; total: number; page: number; pageSize: number } }>(
      `/videos?${query}`
    );
  },
  getDetail: (id: string) =>
    request<{ success: boolean; data: any }>(`/videos/${id}`),
  create: (data: { title?: string; url: string; thumbnail?: string; tags?: string; category?: string; duration?: number }) =>
    request<{ success: boolean; message: string; data: any }>(
      '/videos',
      { method: 'POST', body: JSON.stringify(data) }
    ),
  like: (data: { video_id: string }) =>
    request<{ success: boolean; message: string; data: { liked: boolean } }>(
      '/videos/like',
      { method: 'POST', body: JSON.stringify(data) }
    ),
  getRecommended: () =>
    request<{ success: boolean; data: any[] }>('/videos/recommend'),
};

export default request;