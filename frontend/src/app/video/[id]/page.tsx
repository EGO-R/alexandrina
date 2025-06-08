'use client';
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useVideos } from "@/hooks/useVideos";
import { useAuth } from "@/hooks/useAuth";
import AddToPlaylistModal from "@/components/AddToPlaylistModal";
import { DEFAULT_IMAGES } from "@/config";

export default function VideoPage() {
  const { id } = useParams<{ id: string }>();
  const videoId = Number(id);
  const { user } = useAuth();
  const router = useRouter();
  const { currentVideo, loading, error, getVideoById } = useVideos();
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);

    useEffect(() => {
    if (videoId) {
      getVideoById(videoId);
    }
  }, [videoId, getVideoById]);

  // Проверяем, является ли пользователь автором видео
  const isAuthor = user && currentVideo && user.id === currentVideo.author.id;

  const handleEditClick = () => {
    router.push(`/video/${videoId}/edit`);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-8 flex justify-center items-center min-h-[50vh]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-text-secondary">Загрузка видео...</p>
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

  if (!currentVideo) {
    return (
      <div className="container mx-auto p-8 flex justify-center items-center min-h-[50vh]">
        <div className="bg-info/10 border border-info/20 text-info p-6 rounded-lg max-w-lg text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-xl font-semibold mb-2">Видео не найдено</h2>
          <p>Запрашиваемое видео не существует или было удалено.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Видеоплеер */}
        <div className="aspect-video bg-black mb-6 rounded-lg overflow-hidden shadow-lg">
            <video
            src={currentVideo.videoUrl}
                controls
            className="w-full h-full"
            poster={currentVideo.preview}
          />
        </div>

        {/* Информация о видео */}
        <div className="bg-surface p-6 rounded-lg shadow-sm mb-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
            <div>
              <h1 className="text-2xl font-bold text-text-primary mb-3">{currentVideo.name}</h1>
              <Link href={`/channel/${currentVideo.author.id}`} className="flex items-center group">
                <div className="relative w-10 h-10 mr-3 rounded-full overflow-hidden border-2 border-primary">
                  <Image
                    src={DEFAULT_IMAGES.avatar}
                    alt={currentVideo.author.name}
                    fill
                    className="object-cover"
                    unoptimized={true}
                  />
                </div>
                <span className="text-text-secondary group-hover:text-primary transition-colors">
                  {currentVideo.author.name}
                </span>
              </Link>
            <div className="mt-4">
                <span className="inline-block bg-secondary/10 text-secondary text-xs px-2 py-1 rounded-full">
                  {currentVideo.privacyType === "PRIVATE" ? "Приватное" : "Публичное"}
                </span>
              </div>
            </div>
            
            {/* Кнопки действий */}
            {user && (
              <div className="flex space-x-3 mt-4 md:mt-0">
                {/* Кнопка редактирования (видна только автору) */}
                {isAuthor && (
                  <button
                    onClick={handleEditClick}
                    className="btn btn-accent flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Редактировать
                  </button>
                )}
                
                <button
                  onClick={() => setShowPlaylistModal(true)}
                  className="btn btn-primary flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Добавить в плейлист
                </button>
                </div>
            )}
          </div>
        </div>

        {/* Модальное окно добавления в плейлист */}
        {showPlaylistModal && (
          <AddToPlaylistModal
            video={currentVideo}
            onClose={() => setShowPlaylistModal(false)}
          />
        )}
      </div>
    </div>
    );
}
