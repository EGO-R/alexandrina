'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useVideos } from '@/hooks/useVideos';
import VideoCard from '@/components/VideoCard';
import { createContext, useContext } from 'react';

// Создаем контекст для передачи функций и состояния
const SearchContext = createContext<{
  setQuery: (query: string) => void;
  getVideos: any;
}>({
  setQuery: () => {},
  getVideos: null
});

// Компонент для работы с параметрами поиска
function SearchParamsHandler() {
  const searchParams = useSearchParams();
  const { setQuery, getVideos } = useContext(SearchContext);
  const query = searchParams.get('q') || '';
  
  useEffect(() => {
    setQuery(query);
    
    if (query) {
      // Ищем видео по названию
      getVideos({ 
        name: query,
        sortField: 'ID',
        sortDirection: 'DESC',
        size: 20 // Увеличиваем количество результатов для поиска
      });
    }
  }, [query, getVideos, setQuery]);
  
  return null;
}

export default function SearchPage() {
  const { videos, loading, error, getVideos } = useVideos();
  const [query, setQuery] = useState('');
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        {query ? `Результаты поиска: ${query}` : 'Поиск видео'}
      </h1>
      
      <SearchContext.Provider value={{ setQuery, getVideos }}>
        <Suspense fallback={null}>
          <SearchParamsHandler />
        </Suspense>
      </SearchContext.Provider>
      
      {loading ? (
        <div className="flex justify-center">
          <p>Загрузка результатов...</p>
        </div>
      ) : error ? (
        <div className="text-red-500">
          <p>Произошла ошибка: {error}</p>
        </div>
      ) : videos.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">
            {query ? `По запросу "${query}" ничего не найдено` : 'Введите поисковый запрос выше'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {videos.map(video => (
            <VideoCard key={video.id} {...video} />
          ))}
        </div>
      )}
    </div>
  );
} 