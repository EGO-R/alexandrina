'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { usePlaylists } from '@/hooks/usePlaylists';
import { useAuth } from '@/hooks/useAuth';
import VideoCard from '@/components/VideoCard';
import PlaylistForm from '@/components/PlaylistForm';
import { PlaylistCreateUpdateDto } from '@/types';

export default function PlaylistPage() {
  const { id } = useParams<{ id: string }>();
  const playlistId = Number(id);
  const router = useRouter();
  
  const { user } = useAuth();
  const { 
    currentPlaylist, 
    loading, 
    error, 
    getPlaylistById, 
    editPlaylist,
    removePlaylist 
  } = usePlaylists();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Проверяем, является ли текущий пользователь владельцем плейлиста
  // Добавляем дополнительную проверку на наличие author
  const isOwner = user && currentPlaylist && currentPlaylist.author && user.id === currentPlaylist.author.id;

  useEffect(() => {
    // Загружаем данные плейлиста при монтировании компонента
    getPlaylistById(playlistId);
  }, [playlistId, getPlaylistById]);

  // Обработчик сохранения изменений плейлиста
  const handleSavePlaylist = async (data: PlaylistCreateUpdateDto) => {
    if (!currentPlaylist) return;
    
    setIsSubmitting(true);
    try {
      await editPlaylist(currentPlaylist.id, {
        ...data,
        videoIds: currentPlaylist.videos?.map(video => video.id) || [] // Добавляем проверку на videos
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Ошибка при обновлении плейлиста:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Обработчик удаления плейлиста
  const handleDeletePlaylist = async () => {
    if (!currentPlaylist) return;
    
    if (window.confirm(`Вы уверены, что хотите удалить плейлист "${currentPlaylist.name}"?`)) {
      try {
        await removePlaylist(currentPlaylist.id);
        // После удаления перенаправляем на страницу пользователя
        router.push(`/channel/${user?.id}`);
      } catch (error) {
        console.error('Ошибка при удалении плейлиста:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-8 flex justify-center items-center min-h-[50vh]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-text-secondary">Загрузка плейлиста...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-8 flex justify-center items-center min-h-[50vh]">
        <div className="bg-danger/10 border border-danger/20 text-danger p-6 rounded-lg max-w-lg text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-xl font-semibold mb-2">Ошибка</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!currentPlaylist) {
    return (
      <div className="container mx-auto p-8 flex justify-center items-center min-h-[50vh]">
        <div className="bg-info/10 border border-info/20 text-info p-6 rounded-lg max-w-lg text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-xl font-semibold mb-2">Плейлист не найден</h2>
          <p>Запрашиваемый плейлист не существует или был удален.</p>
        </div>
      </div>
    );
  }

  // Проверка на полноту данных плейлиста
  if (!currentPlaylist.author) {
    return (
      <div className="container mx-auto p-8 flex justify-center items-center min-h-[50vh]">
        <div className="bg-warning/10 border border-warning/20 text-warning p-6 rounded-lg max-w-lg text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="text-xl font-semibold mb-2">Ошибка данных</h2>
          <p>Данные плейлиста неполные. Попробуйте обновить страницу.</p>
        </div>
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 py-6">
      {/* Заголовок и действия */}
      <div className="mb-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">{currentPlaylist.name}</h1>
            <div className="mt-2 flex items-center space-x-4">
              <span className={`privacy-label ${
                currentPlaylist.privacyType === 'PUBLIC' 
                ? 'privacy-label-public' 
                : 'privacy-label-private'
              }`}>
                {currentPlaylist.privacyType === 'PUBLIC' ? 'Публичный' : 'Приватный'}
              </span>
              <Link 
                href={`/channel/${currentPlaylist.author.id}`}
                className="text-sm text-primary hover:text-primary-hover transition-colors"
              >
                Автор: {currentPlaylist.author.name}
              </Link>
            </div>
          </div>
          
          {isOwner && !isEditing && (
            <div className="flex space-x-3">
              <button
                onClick={() => setIsEditing(true)}
                className="btn btn-primary py-1 px-3 text-sm"
              >
                Редактировать
              </button>
              <button
                onClick={handleDeletePlaylist}
                className="btn btn-danger py-1 px-3 text-sm"
              >
                Удалить
              </button>
            </div>
          )}
        </div>
        
        {/* Форма редактирования */}
        {isEditing && (
          <div className="bg-surface p-4 rounded-lg shadow mb-6 border border-border">
            <h3 className="text-lg font-semibold mb-4 text-text-primary">Редактирование плейлиста</h3>
            <PlaylistForm
              onSubmit={handleSavePlaylist}
              onCancel={() => setIsEditing(false)}
              initialData={currentPlaylist}
              isLoading={isSubmitting}
            />
          </div>
        )}
      </div>
      
      {/* Список видео в плейлисте */}
      <h2 className="text-xl font-semibold mb-4 text-text-primary">Видео в плейлисте ({currentPlaylist.videos?.length || 0})</h2>
      
      {!currentPlaylist.videos || currentPlaylist.videos.length === 0 ? (
        <div className="text-text-secondary p-8 text-center bg-surface/50 rounded-lg border border-border">В этом плейлисте пока нет видео</div>
      ) : (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentPlaylist.videos.map((video) => (
            <VideoCard key={video.id} {...video} />
          ))}
        </section>
      )}
    </main>
  );
} 