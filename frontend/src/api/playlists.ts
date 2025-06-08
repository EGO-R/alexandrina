import { fetchWithAuth } from "@/api/fetchWithAuth";
import { API_ENDPOINTS } from "@/config";
import { Playlist, PlaylistWithVideos, PlaylistCreateUpdateDto, PlaylistVideoUpdateDto } from "@/types";
import { urlFromBack } from "@/api/urlUtils";

/**
 * Получение плейлистов. Если указан userId, возвращает плейлисты конкретного пользователя,
 * иначе возвращает все доступные плейлисты
 */
export async function fetchPlaylists(userId?: number): Promise<Playlist[]> {
  const endpoint = userId 
    ? API_ENDPOINTS.playlists.getUserPlaylists(userId) 
    : API_ENDPOINTS.playlists.list;

  const res = await fetchWithAuth(endpoint);

  if (!res.ok) {
    throw new Error('Ошибка загрузки плейлистов');
  }

  return res.json();
}

// Тип данных, приходящих с бэкенда
interface ApiPlaylistWithVideosDto {
  playlist: Playlist;
  videos: Array<any>;
}

/**
 * Получение плейлиста по ID вместе с видео
 */
export async function fetchPlaylistById(id: number): Promise<PlaylistWithVideos> {
  const res = await fetchWithAuth(API_ENDPOINTS.playlists.get(id));

  if (!res.ok) {
    throw new Error('Ошибка загрузки плейлиста');
  }

  try {
    // Адаптируем данные от бэкенда к формату фронтенда
    const data = await res.json();
    
    console.log('Данные плейлиста с бэкенда:', data);
    
    // Проверяем структуру данных
    if (!data) {
      throw new Error('Пустой ответ от сервера');
    }
    
    // Преобразуем видео в правильный формат (previewKey -> preview, videoKey -> videoUrl)
    const adaptVideos = (videos: any[]) => {
      return videos.map(video => ({
        id: video.id,
        name: video.name,
        // Используем urlFromBack для формирования полных URL
        preview: urlFromBack(video.previewKey),
        videoUrl: urlFromBack(video.videoKey),
        privacyType: video.privacyType,
        author: video.author
      }));
    };
    
    if (!data.playlist) {
      console.error('Отсутствует поле playlist в ответе:', data);
      
      // Если данные приходят напрямую (без вложенности)
      if (data.id && data.name) {
        console.log('Данные плейлиста приходят напрямую, без вложенности');
        // Адаптируем видео, если они есть
        const adaptedVideos = data.videos ? adaptVideos(data.videos) : [];
        
        return {
          ...data,
          videos: adaptedVideos
        };
      }
      
      throw new Error('Некорректная структура данных плейлиста');
    }
    
    // Если структура корректная, собираем данные и адаптируем видео
    const adaptedVideos = data.videos ? adaptVideos(data.videos) : [];
    
    return {
      ...data.playlist,
      videos: adaptedVideos
    };
  } catch (error) {
    console.error('Ошибка при обработке данных плейлиста:', error);
    throw error;
  }
}

/**
 * Создание нового плейлиста
 */
export async function createPlaylist(data: PlaylistCreateUpdateDto): Promise<PlaylistWithVideos> {
  const res = await fetchWithAuth(API_ENDPOINTS.playlists.create, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error('Ошибка создания плейлиста');
  }

  try {
    // Адаптируем данные от бэкенда к формату фронтенда
    const responseData = await res.json();
    
    console.log('Данные созданного плейлиста:', responseData);
    
    // Проверяем структуру данных
    if (!responseData) {
      throw new Error('Пустой ответ от сервера');
    }
    
    // Преобразуем видео в правильный формат (previewKey -> preview, videoKey -> videoUrl)
    const adaptVideos = (videos: any[]) => {
      return videos.map(video => ({
        id: video.id,
        name: video.name,
        preview: urlFromBack(video.previewKey),
        videoUrl: urlFromBack(video.videoKey),
        privacyType: video.privacyType,
        author: video.author
      }));
    };
    
    if (!responseData.playlist) {
      console.error('Отсутствует поле playlist в ответе:', responseData);
      
      // Если данные приходят напрямую (без вложенности)
      if (responseData.id && responseData.name) {
        const adaptedVideos = responseData.videos ? adaptVideos(responseData.videos) : [];
        
        return {
          ...responseData,
          videos: adaptedVideos
        };
      }
      
      throw new Error('Некорректная структура данных плейлиста');
    }
    
    const adaptedVideos = responseData.videos ? adaptVideos(responseData.videos) : [];
    
    return {
      ...responseData.playlist,
      videos: adaptedVideos
    };
  } catch (error) {
    console.error('Ошибка при обработке данных созданного плейлиста:', error);
    throw error;
  }
}

/**
 * Обновление существующего плейлиста
 */
export async function updatePlaylist(id: number, data: PlaylistCreateUpdateDto): Promise<PlaylistWithVideos> {
  const res = await fetchWithAuth(API_ENDPOINTS.playlists.update(id), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error('Ошибка обновления плейлиста');
  }

  try {
    // Адаптируем данные от бэкенда к формату фронтенда
    const responseData = await res.json();
    
    console.log('Данные обновленного плейлиста:', responseData);
    
    // Проверяем структуру данных
    if (!responseData) {
      throw new Error('Пустой ответ от сервера');
    }
    
    // Преобразуем видео в правильный формат (previewKey -> preview, videoKey -> videoUrl)
    const adaptVideos = (videos: any[]) => {
      return videos.map(video => ({
        id: video.id,
        name: video.name,
        preview: urlFromBack(video.previewKey),
        videoUrl: urlFromBack(video.videoKey),
        privacyType: video.privacyType,
        author: video.author
      }));
    };
    
    if (!responseData.playlist) {
      console.error('Отсутствует поле playlist в ответе:', responseData);
      
      // Если данные приходят напрямую (без вложенности)
      if (responseData.id && responseData.name) {
        const adaptedVideos = responseData.videos ? adaptVideos(responseData.videos) : [];
        
        return {
          ...responseData,
          videos: adaptedVideos
        };
      }
      
      throw new Error('Некорректная структура данных плейлиста');
    }
    
    const adaptedVideos = responseData.videos ? adaptVideos(responseData.videos) : [];
    
    return {
      ...responseData.playlist,
      videos: adaptedVideos
    };
  } catch (error) {
    console.error('Ошибка при обработке данных обновленного плейлиста:', error);
    throw error;
  }
}

/**
 * Удаление плейлиста
 */
export async function deletePlaylist(id: number): Promise<void> {
  const res = await fetchWithAuth(API_ENDPOINTS.playlists.delete(id), {
    method: 'DELETE',
  });

  if (!res.ok) {
    throw new Error('Ошибка удаления плейлиста');
  }
}

/**
 * Добавление/удаление видео в плейлисты
 */
export async function updateVideoPlaylists(videoId: number, playlistIds: number[]): Promise<void> {
  const data: PlaylistVideoUpdateDto = { playlistIds };
  
  const res = await fetchWithAuth(API_ENDPOINTS.playlists.editVideos(videoId), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error('Ошибка обновления плейлистов для видео');
  }
} 