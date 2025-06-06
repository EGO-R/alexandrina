import { useState, useEffect } from 'react';
import { usePlaylists } from '@/hooks/usePlaylists';
import { Video } from '@/types';
import { getVideoPlaylists } from '@/api/videos';

interface AddToPlaylistModalProps {
  video: Video;
  onClose: () => void;
}

export default function AddToPlaylistModal({ video, onClose }: AddToPlaylistModalProps) {
  const { playlists, loading: playlistsLoading, error: playlistsError, getPlaylists, editVideoPlaylists } = usePlaylists();
  const [selectedPlaylists, setSelectedPlaylists] = useState<number[]>([]);
  const [saving, setSaving] = useState(false);
  const [loadingPlaylists, setLoadingPlaylists] = useState(false);

  useEffect(() => {
    // Загружаем плейлисты пользователя
    getPlaylists();
    
    // Загружаем плейлисты, в которых уже находится видео
    const loadVideoPlaylists = async () => {
      setLoadingPlaylists(true);
      try {
        const videoPlaylists = await getVideoPlaylists(video.id);
        // Выбираем плейлисты, в которых видео уже находится
        const initialSelectedIds = videoPlaylists
          .filter(item => item.isContainsVideo)
          .map(item => item.playlist.id);
        
        console.log('Загружены плейлисты с видео:', videoPlaylists);
        console.log('Выбраны ID плейлистов:', initialSelectedIds);
        
        setSelectedPlaylists(initialSelectedIds);
      } catch (error) {
        console.error('Ошибка при загрузке плейлистов видео:', error);
      } finally {
        setLoadingPlaylists(false);
      }
    };
    
    loadVideoPlaylists();
  }, [getPlaylists, video.id]);

  const handleCheckboxChange = (playlistId: number) => {
    setSelectedPlaylists(prev => {
      if (prev.includes(playlistId)) {
        return prev.filter(id => id !== playlistId);
      } else {
        return [...prev, playlistId];
      }
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Обновляем видео в плейлистах
      await editVideoPlaylists(video.id, selectedPlaylists);
      onClose();
    } catch (error) {
      console.error('Ошибка при обновлении плейлистов:', error);
    } finally {
      setSaving(false);
    }
  };

  const isLoading = playlistsLoading || loadingPlaylists;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="dropdown-menu p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-text-primary">Добавить в плейлист</h2>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
            aria-label="Закрыть"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mb-4">
          <p className="text-text-secondary mb-2">Видео: {video.name}</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-4">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : playlistsError ? (
          <p className="text-danger p-3 bg-danger/10 rounded-md">{playlistsError}</p>
        ) : playlists.length === 0 ? (
          <p className="text-text-secondary p-4 text-center bg-info/5 rounded-md">У вас нет плейлистов. Создайте плейлист на странице своего канала.</p>
        ) : (
          <div className="space-y-2 mb-6">
            {playlists.map(playlist => (
              <div key={playlist.id} className="flex items-center p-2 hover:bg-surface-hover rounded">
                <input
                  type="checkbox"
                  id={`playlist-${playlist.id}`}
                  checked={selectedPlaylists.includes(playlist.id)}
                  onChange={() => handleCheckboxChange(playlist.id)}
                  className="mr-3 cursor-pointer"
                />
                <label htmlFor={`playlist-${playlist.id}`} className="flex-grow cursor-pointer">
                  <div className="font-medium text-text-primary">{playlist.name}</div>
                  <div className="text-xs mt-1">
                    <span className={`privacy-label ${
                      playlist.privacyType === 'PUBLIC' 
                      ? 'privacy-label-public' 
                      : 'privacy-label-private'
                    }`}>
                      {playlist.privacyType === 'PUBLIC' ? 'Публичный' : 'Приватный'}
                    </span>
                  </div>
                </label>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-end space-x-3 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-border rounded hover:bg-surface-hover transition-colors text-text-secondary cursor-pointer"
            disabled={saving}
          >
            Отмена
          </button>
          <button
            onClick={handleSave}
            className={`btn ${saving || isLoading || playlists.length === 0 ? 'bg-secondary' : 'btn-primary'}`}
            disabled={saving || isLoading || playlists.length === 0}
          >
            {saving ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-text-on-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Сохранение...
              </span>
            ) : 'Сохранить'}
          </button>
        </div>
      </div>
    </div>
  );
} 