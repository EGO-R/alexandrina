import { useState, useCallback } from 'react';
import { 
  fetchPlaylists, 
  fetchPlaylistById, 
  createPlaylist, 
  updatePlaylist, 
  deletePlaylist,
  updateVideoPlaylists
} from '@/api/playlists';
import type { Playlist, PlaylistWithVideos, PlaylistCreateUpdateDto, PrivacyType } from '@/types';

export const usePlaylists = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [currentPlaylist, setCurrentPlaylist] = useState<PlaylistWithVideos | null>(null);

  const getPlaylists = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchPlaylists();
      
      // Проверяем, что полученные данные являются массивом
      if (!Array.isArray(data)) {
        throw new Error('Некорректный формат данных с сервера');
      }
      
      setPlaylists(data);
      return data;
    } catch (err: any) {
      setError(err.message || 'Ошибка при загрузке плейлистов');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getPlaylistById = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchPlaylistById(id);
      
      // Проверяем, что полученные данные корректны
      if (!data || typeof data !== 'object' || !data.id) {
        throw new Error('Некорректный формат данных плейлиста с сервера');
      }
      
      setCurrentPlaylist(data);
      return data;
    } catch (err: any) {
      setError(err.message || 'Ошибка при загрузке плейлиста');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const addPlaylist = useCallback(async (
    name: string,
    privacyType: PrivacyType,
    videoIds?: number[]
  ) => {
    setLoading(true);
    setError(null);
    try {
      const data = await createPlaylist({ name, privacyType, videoIds });
      
      // Проверка данных
      if (!data || typeof data !== 'object' || !data.id) {
        throw new Error('Некорректный формат данных плейлиста с сервера');
      }
      
      setPlaylists(prev => [...prev, data]);
      return data;
    } catch (err: any) {
      setError(err.message || 'Ошибка при создании плейлиста');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const editPlaylist = useCallback(async (
    id: number,
    data: PlaylistCreateUpdateDto
  ) => {
    setLoading(true);
    setError(null);
    try {
      const updatedPlaylist = await updatePlaylist(id, data);
      
      // Проверка данных
      if (!updatedPlaylist || typeof updatedPlaylist !== 'object' || !updatedPlaylist.id) {
        throw new Error('Некорректный формат данных плейлиста с сервера');
      }
      
      // Обновляем список плейлистов, если он загружен
      setPlaylists(prev => prev.map(playlist => 
        playlist.id === id 
          ? { ...playlist, ...data } 
          : playlist
      ));
      
      // Обновляем текущий плейлист, если это он
      if (currentPlaylist && currentPlaylist.id === id) {
        setCurrentPlaylist(updatedPlaylist);
      }
      
      return updatedPlaylist;
    } catch (err: any) {
      setError(err.message || 'Ошибка при обновлении плейлиста');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentPlaylist]);

  const removePlaylist = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await deletePlaylist(id);
      
      // Удаляем из списка плейлистов
      setPlaylists(prev => prev.filter(playlist => playlist.id !== id));
      
      // Если текущий плейлист - это удаляемый, то сбрасываем его
      if (currentPlaylist && currentPlaylist.id === id) {
        setCurrentPlaylist(null);
      }
      
      return true;
    } catch (err: any) {
      setError(err.message || 'Ошибка при удалении плейлиста');
      return false;
    } finally {
      setLoading(false);
    }
  }, [currentPlaylist]);

  const editVideoPlaylists = useCallback(async (videoId: number, playlistIds: number[]) => {
    setLoading(true);
    setError(null);
    try {
      await updateVideoPlaylists(videoId, playlistIds);
      return true;
    } catch (err: any) {
      setError(err.message || 'Ошибка при обновлении плейлистов для видео');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    playlists,
    currentPlaylist,
    getPlaylists,
    getPlaylistById,
    addPlaylist,
    editPlaylist,
    removePlaylist,
    editVideoPlaylists,
  };
}; 