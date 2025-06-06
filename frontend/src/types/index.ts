/**
 * Общие типы приложения
 */

export enum PrivacyType {
  PUBLIC = "PUBLIC",
  PRIVATE = "PRIVATE"
}

export interface User {
  id: number;
  email: string;
  name: string;
  role?: string;
  avatarUrl?: string | null;
}

export interface Video {
  id: number;
  name: string;
  preview: string;
  videoUrl: string;
  privacyType: PrivacyType;
  author: {
    id: number;
    name: string;
  };
}

export interface VideoResponse {
  id: number;
  name: string;
  previewKey: string;
  videoKey: string;
  privacyType: PrivacyType;
  author: {
    id: number;
    name: string;
  };
}

export interface AuthRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface VideoSearchQuery {
  name?: string;
  authorID?: number;
  sortField?: string;
  sortDirection?: 'ASC' | 'DESC';
  size?: number;
  lastSelectedValue?: string;
}

// Типы для плейлистов
export interface Playlist {
  id: number;
  name: string;
  privacyType: PrivacyType;
  author: {
    id: number;
    name: string;
  };
}

export interface PlaylistWithVideos extends Playlist {
  videos: Video[];
}

export interface PlaylistCreateUpdateDto {
  name: string;
  privacyType: PrivacyType;
  videoIds?: number[];
}

// Тип для плейлистов с отметкой о наличии видео
export interface PlaylistToVideoDto {
  playlist: Playlist;
  isContainsVideo: boolean;
}

// Для редактирования видео в плейлисте
export interface PlaylistVideoUpdateDto {
  playlistIds: number[];
} 