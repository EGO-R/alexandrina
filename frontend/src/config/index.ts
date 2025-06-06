/**
 * Конфигурация приложения
 */

// Определение окружения
export const IS_PRODUCTION = process.env.NODE_ENV === 'production';
export const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';

// Основные настройки API
// Для клиентских запросов используем относительные пути, которые будут проксироваться через Next.js
export const API_URL = typeof window !== 'undefined' ? '' : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080');
export const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

// Настройки S3 хранилища
export const S3_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_S3_BASE_URL || 'https://storage.yandexcloud.net',
  bucketName: process.env.NEXT_PUBLIC_S3_BUCKET || 'alexandrina'
};

// Логирование
export const Logger = {
  info: (message: string, ...args: any[]) => {
    if (!IS_PRODUCTION) {
      console.info(`[INFO] ${message}`, ...args);
    }
  },
  error: (message: string, error?: any) => {
    console.error(`[ERROR] ${message}`, error);
  },
  warn: (message: string, ...args: any[]) => {
    console.warn(`[WARN] ${message}`, ...args);
  },
  debug: (message: string, ...args: any[]) => {
    if (!IS_PRODUCTION) {
      console.debug(`[DEBUG] ${message}`, ...args);
    }
  }
};

// Пути к дефолтным изображениям в S3
export const DEFAULT_IMAGES = {
  logo: `${S3_CONFIG.baseUrl}/${S3_CONFIG.bucketName}/logo.png`,
  avatar: `${S3_CONFIG.baseUrl}/${S3_CONFIG.bucketName}/avatars/default.jpeg`, 
  thumbnail: `${S3_CONFIG.baseUrl}/${S3_CONFIG.bucketName}/default-thumbnail.jpg`
};

// Настройки пагинации
export const PAGINATION = {
  defaultPageSize: 12,
  maxPageSize: 50
};

// Настройки UI
export const UI_CONFIG = {
  appName: 'Alexandrina',
  footerCopyright: '© Alexandrina, 2025',
  authorInfo: {
    name: 'Трусов Егор Сергеевич',
    group: 'ИКБО-16-22',
    email: 'egor_trusov00@mail.com',
    phone: '+7 (925) 831-07-55'
  }
};

// API эндпоинты
export const API_ENDPOINTS = {
  auth: {
    register: `/api/auth/register`,
    login: `/api/auth/login`,
    me: `/api/auth/me`,
    googleOAuth: `/oauth2/authorization/google`,
  },
  users: {
    get: (id: number) => `/api/users/${id}`,
  },
  videos: {
    list: `/api/videos`,
    get: (id: number) => `/api/videos/${id}`,
    create: `/api/videos/create`,
    update: (id: number) => `/api/videos/${id}/update`,
    delete: (id: number) => `/api/videos/${id}`,
    playlists: (id: number) => `/api/videos/${id}/playlists`,
  },
  playlists: {
    list: `/api/playlists`,
    get: (id: number) => `/api/playlists/${id}`,
    create: `/api/playlists`,
    update: (id: number) => `/api/playlists/${id}`,
    delete: (id: number) => `/api/playlists/${id}`,
    editVideos: (videoId: number) => `/api/videos/${videoId}/playlists`,
  },
  s3: {
    video: `/api/s3/video`,
    preview: `/api/s3/preview`,
    avatar: `/api/s3/avatar`,
  }
}; 