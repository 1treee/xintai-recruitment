export const PORT = parseInt(process.env.PORT || '3000');

export const JWT_SECRET = process.env.JWT_SECRET || 'xintai-recruitment-jwt-secret-key';
export const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'xintai-recruitment-jwt-refresh-secret-key';
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
export const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '30d';

export const DB_HOST = process.env.DB_HOST || 'localhost';
export const DB_PORT = parseInt(process.env.DB_PORT || '3306');
export const DB_USER = process.env.DB_USER || 'root';
export const DB_PASSWORD = process.env.DB_PASSWORD || 'lcy12345';
export const DB_NAME = process.env.DB_NAME || 'xintai_recruitment';
export const DB_SSL = process.env.DB_SSL === 'true';

export const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173,http://localhost:5174,http://localhost:3000';

export const OSS_ACCESS_KEY = process.env.OSS_ACCESS_KEY || '';
export const OSS_SECRET_KEY = process.env.OSS_SECRET_KEY || '';
export const OSS_BUCKET = process.env.OSS_BUCKET || '';
export const OSS_REGION = process.env.OSS_REGION || '';