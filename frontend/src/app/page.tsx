'use client';
import { useEffect } from 'react';
import { useVideos } from '@/hooks/useVideos';
import VideoCard from '@/components/VideoCard';

export default function HomePage() {
  const { videos, loading, error, getVideos } = useVideos();

  useEffect(() => {
    // Загружаем видео при монтировании компонента
    getVideos({
      sortField: 'ID',
      sortDirection: 'DESC',
      size: 12 // Показываем до 12 видео на главной странице
    });
  }, [getVideos]);

  return (
      <main className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Новые видео</h1>

      {loading ? (
        <div className="flex justify-center py-10">
          <p>Загрузка видео...</p>
        </div>
      ) : error ? (
        <div className="text-red-500 py-10">
          <p>Произошла ошибка: {error}</p>
        </div>
      ) : videos.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">Видео не найдены</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {videos.map(video => (
              <VideoCard key={video.id} {...video} />
          ))}
        </div>
      )}
      </main>
  );
}
