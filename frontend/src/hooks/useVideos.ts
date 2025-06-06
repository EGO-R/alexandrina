import { useState, useCallback } from 'react';
import { 
  fetchVideos, 
  fetchVideoById, 
  createVideo, 
  updateVideo, 
  deleteVideo,
  getPresignedUploadUrl,
  getPresignedPreviewUrl 
} from '@/api/videos';
import type { Video, VideoSearchQuery, PrivacyType } from '@/types';

export const useVideos = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);

  const getVideos = useCallback(async (params?: VideoSearchQuery) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchVideos(params);
      setVideos(data);
      return data;
    } catch (err: any) {
      setError(err.message || 'Ошибка при загрузке видео');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getVideoById = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchVideoById(id);
      setCurrentVideo(data);
      return data;
    } catch (err: any) {
      setError(err.message || 'Ошибка при загрузке видео');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const addVideo = useCallback(async (
    name: string,
    previewUrl: string,
    videoUrl: string,
    privacyType: PrivacyType
  ) => {
    setLoading(true);
    setError(null);
    try {
      const data = await createVideo(name, previewUrl, videoUrl, privacyType);
      return data;
    } catch (err: any) {
      setError(err.message || 'Ошибка при создании видео');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const editVideo = useCallback(async (
    id: number,
    name: string,
    privacyType: PrivacyType
  ) => {
    setLoading(true);
    setError(null);
    try {
      await updateVideo(id, name, privacyType);
      if (currentVideo && currentVideo.id === id) {
        setCurrentVideo({
          ...currentVideo,
          name,
          privacyType
        });
      }
      return true;
    } catch (err: any) {
      setError(err.message || 'Ошибка при обновлении видео');
      return false;
    } finally {
      setLoading(false);
    }
  }, [currentVideo]);

  const removeVideo = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await deleteVideo(id);
      setVideos(prev => prev.filter(video => video.id !== id));
      if (currentVideo && currentVideo.id === id) {
        setCurrentVideo(null);
      }
      return true;
    } catch (err: any) {
      setError(err.message || 'Ошибка при удалении видео');
      return false;
    } finally {
      setLoading(false);
    }
  }, [currentVideo]);

  const getUploadUrls = useCallback(async () => {
    try {
      const videoUrl = await getPresignedUploadUrl();
      const previewUrl = await getPresignedPreviewUrl();
      return { videoUrl, previewUrl };
    } catch (err: any) {
      setError(err.message || 'Ошибка при получении URL для загрузки');
      throw err;
    }
  }, []);

  return {
    loading,
    error,
    videos,
    currentVideo,
    getVideos,
    getVideoById,
    addVideo,
    editVideo,
    removeVideo,
    getUploadUrls,
  };
}; 