'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { useUser } from '@/hooks/useUser';
import { useVideos } from '@/hooks/useVideos';
import { usePlaylists } from '@/hooks/usePlaylists';
import { useAuth } from '@/hooks/useAuth';
import Tabs, { Tab } from '@/components/ui/Tabs';
import VideoCard from '@/components/VideoCard';
import PlaylistCard from '@/components/PlaylistCard';
import PlaylistForm from '@/components/PlaylistForm';
import { DEFAULT_IMAGES } from '@/config';
import { Playlist, PlaylistCreateUpdateDto } from '@/types';

export default function UserChannelPage() {
  const { id } = useParams<{ id: string }>();
  const userId = Number(id);
  
  const { user: currentUser } = useAuth();
  const isOwner = currentUser?.id === userId;
  
  // Данные пользователя
  const { userData, loading: userLoading, error: userError, getUserById } = useUser();
  
  // Видео пользователя
  const { videos, loading: videosLoading, error: videosError, getVideos } = useVideos();
  
  // Плейлисты пользователя
  const { 
    playlists,
    loading: playlistsLoading, 
    error: playlistsError, 
    getPlaylists,
    addPlaylist,
    editPlaylist,
    removePlaylist
  } = usePlaylists();
  
  // Состояние для формы создания/редактирования плейлиста
  const [showPlaylistForm, setShowPlaylistForm] = useState(false);
  const [editingPlaylist, setEditingPlaylist] = useState<Playlist | null>(null);
  const [formSubmitting, setFormSubmitting] = useState(false);

  useEffect(() => {
    // Загружаем информацию о пользователе
    getUserById(userId);
    
    // Загружаем видео пользователя
    getVideos({ 
      authorID: userId, 
      sortField: 'ID',
      sortDirection: 'DESC',
      size: 12 // Показываем до 12 видео на странице
    });
    
    // Загружаем плейлисты пользователя
    getPlaylists();
  }, [userId, getUserById, getVideos, getPlaylists]);

  // Обработчик создания/редактирования плейлиста
  const handlePlaylistSubmit = async (data: PlaylistCreateUpdateDto) => {
    setFormSubmitting(true);
    
    try {
      if (editingPlaylist) {
        // Редактирование существующего плейлиста
        await editPlaylist(editingPlaylist.id, data);
      } else {
        // Создание нового плейлиста
        await addPlaylist(data.name, data.privacyType);
      }
      
      // Закрываем форму и сбрасываем редактируемый плейлист
      setShowPlaylistForm(false);
      setEditingPlaylist(null);
      
      // Обновляем список плейлистов
      getPlaylists();
    } catch (error) {
      console.error('Ошибка при сохранении плейлиста:', error);
    } finally {
      setFormSubmitting(false);
    }
  };

  // Обработчик кнопки редактирования плейлиста
  const handleEditPlaylist = (playlist: Playlist) => {
    setEditingPlaylist(playlist);
    setShowPlaylistForm(true);
  };

  // Обработчик кнопки удаления плейлиста
  const handleDeletePlaylist = async (playlistId: number) => {
    try {
      await removePlaylist(playlistId);
      // Обновляем список плейлистов
      getPlaylists();
    } catch (error) {
      console.error('Ошибка при удалении плейлиста:', error);
    }
  };

  // Содержимое вкладки с видео
  const VideosTabContent = () => {
    if (videosLoading) return (
      <div className="flex justify-center py-8">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
    
    if (videosError) return (
      <div className="bg-danger/10 border border-danger/20 text-danger p-4 rounded-lg">
        <p>{videosError}</p>
      </div>
    );
    
    if (!videos.length) return (
      <div className="text-text-secondary p-8 text-center bg-surface/50 rounded-lg border border-border">
        У этого пользователя нет видео
      </div>
    );

    return (
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map(video => (
          <VideoCard key={video.id} {...video} />
        ))}
      </section>
    );
  };

  // Содержимое вкладки с плейлистами
  const PlaylistsTabContent = () => {
    if (playlistsLoading) return (
      <div className="flex justify-center py-8">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
    
    if (playlistsError) return (
      <div className="bg-danger/10 border border-danger/20 text-danger p-4 rounded-lg">
        <p>{playlistsError}</p>
      </div>
    );
    
    // Фильтруем плейлисты по текущему пользователю
    const userPlaylists = playlists.filter(playlist => playlist.author.id === userId);

    return (
      <div>
        {isOwner && (
          <div className="mb-6">
            {showPlaylistForm ? (
              <div className="bg-surface border border-border p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4 text-text-primary">
                  {editingPlaylist ? 'Редактирование плейлиста' : 'Создание нового плейлиста'}
                </h3>
                <PlaylistForm
                  onSubmit={handlePlaylistSubmit}
                  onCancel={() => {
                    setShowPlaylistForm(false);
                    setEditingPlaylist(null);
                  }}
                  initialData={editingPlaylist || undefined}
                  isLoading={formSubmitting}
                />
              </div>
            ) : (
              <button
                onClick={() => setShowPlaylistForm(true)}
                className="btn btn-primary"
              >
                Создать новый плейлист
              </button>
            )}
          </div>
        )}

        {!userPlaylists.length ? (
          <div className="text-text-secondary p-8 text-center bg-surface/50 rounded-lg border border-border">
            У этого пользователя нет плейлистов
          </div>
        ) : (
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userPlaylists.map(playlist => (
              <PlaylistCard
                key={playlist.id}
                playlist={playlist}
                isOwner={isOwner}
                onEdit={isOwner ? handleEditPlaylist : undefined}
                onDelete={isOwner ? handleDeletePlaylist : undefined}
              />
            ))}
          </section>
        )}
      </div>
    );
  };

  // Конфигурация вкладок
  const tabs: Tab[] = [
    { id: 'videos', label: 'Видео', content: <VideosTabContent /> },
    { id: 'playlists', label: 'Плейлисты', content: <PlaylistsTabContent /> },
  ];

  if (userLoading) {
    return (
      <div className="container mx-auto p-8 flex justify-center items-center min-h-[50vh]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-text-secondary">Загрузка информации о пользователе...</p>
        </div>
      </div>
    );
  }

  if (userError) {
    return (
      <div className="container mx-auto p-8 flex justify-center items-center min-h-[50vh]">
        <div className="bg-danger/10 border border-danger/20 text-danger p-6 rounded-lg max-w-lg text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-xl font-semibold mb-2">Ошибка</h2>
          <p>{userError}</p>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="container mx-auto p-8 flex justify-center items-center min-h-[50vh]">
        <div className="bg-info/10 border border-info/20 text-info p-6 rounded-lg max-w-lg text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-xl font-semibold mb-2">Пользователь не найден</h2>
          <p>Запрашиваемый пользователь не существует или был удален.</p>
        </div>
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 py-6">
      {/* Шапка профиля */}
      <div className="flex items-center mb-8 p-6 bg-surface rounded-lg border border-border shadow-sm">
        <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-primary mr-6">
          <Image
            src={userData.avatarUrl || DEFAULT_IMAGES.avatar}
            alt={userData.name}
            fill
            className="object-cover"
            unoptimized={true}
          />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-text-primary">{userData.name}</h1>
          <p className="text-text-secondary">{userData.email}</p>
        </div>
      </div>

      {/* Вкладки */}
      <Tabs tabs={tabs} defaultTabId="videos" />
    </main>
  );
} 