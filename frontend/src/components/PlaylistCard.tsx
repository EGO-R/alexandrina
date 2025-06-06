import Link from 'next/link';
import { Playlist } from '@/types';

interface PlaylistCardProps {
  playlist: Playlist;
  onEdit?: (playlist: Playlist) => void;
  onDelete?: (playlistId: number) => void;
  isOwner?: boolean;
}

export default function PlaylistCard({
  playlist,
  onEdit,
  onDelete,
  isOwner = false,
}: PlaylistCardProps) {
  return (
    <div className="card group">
      <Link href={`/playlist/${playlist.id}`} className="block p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-text-primary group-hover:text-primary transition-colors line-clamp-1">
            {playlist.name}
          </h3>
          <span className={`privacy-label ${
            playlist.privacyType === 'PUBLIC' 
            ? 'privacy-label-public' 
            : 'privacy-label-private'
          }`}>
            {playlist.privacyType === 'PUBLIC' ? 'Публичный' : 'Приватный'}
          </span>
        </div>
        
        <div className="flex items-center mt-4">
          <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs mr-2">
            {playlist.author.name.charAt(0).toUpperCase()}
          </div>
          <span className="text-sm text-text-secondary">
            {playlist.author.name}
          </span>
        </div>
      </Link>
      
      {isOwner && (
        <div className="border-t border-border p-3 flex justify-end space-x-3">
          {onEdit && (
            <button
              onClick={() => onEdit(playlist)}
              className="text-xs text-primary hover:text-primary-hover transition-colors flex items-center cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Редактировать
            </button>
          )}
          
          {onDelete && (
            <button
              onClick={() => {
                if (window.confirm(`Удалить плейлист "${playlist.name}"?`)) {
                  onDelete(playlist.id);
                }
              }}
              className="text-xs text-danger hover:text-danger-hover transition-colors flex items-center cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Удалить
            </button>
          )}
        </div>
      )}
    </div>
  );
} 