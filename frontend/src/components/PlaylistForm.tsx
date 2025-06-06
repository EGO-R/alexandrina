import { useState, useEffect } from 'react';
import { PlaylistCreateUpdateDto, PrivacyType, Playlist } from '@/types';

interface PlaylistFormProps {
  onSubmit: (data: PlaylistCreateUpdateDto) => void;
  onCancel: () => void;
  initialData?: Partial<Playlist>;
  isLoading?: boolean;
}

export default function PlaylistForm({ 
  onSubmit, 
  onCancel, 
  initialData, 
  isLoading = false 
}: PlaylistFormProps) {
  const [formData, setFormData] = useState<PlaylistCreateUpdateDto>({
    name: initialData?.name || '',
    privacyType: initialData?.privacyType || PrivacyType.PUBLIC,
    videoIds: []
  });

  // Обновление формы при изменении initialData
  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        name: initialData.name || prev.name,
        privacyType: initialData.privacyType || prev.privacyType
      }));
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-text-secondary mb-1">
          Название плейлиста*
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          value={formData.name}
          onChange={handleChange}
          disabled={isLoading}
          className="w-full"
        />
      </div>

      <div>
        <label htmlFor="privacyType" className="block text-sm font-medium text-text-secondary mb-1">
          Приватность
        </label>
        <select
          id="privacyType"
          name="privacyType"
          value={formData.privacyType}
          onChange={handleChange}
          disabled={isLoading}
          className="w-full bg-surface text-text-primary border border-border rounded-md p-2"
        >
          <option value={PrivacyType.PUBLIC}>Публичный</option>
          <option value={PrivacyType.PRIVATE}>Приватный</option>
        </select>
      </div>

      <div className="flex space-x-4 pt-4">
        <button
          type="submit"
          className={`btn ${isLoading ? 'bg-secondary' : 'btn-primary'}`}
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-text-on-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Сохранение...
            </span>
          ) : initialData?.id ? 'Сохранить' : 'Создать'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-border rounded hover:bg-surface-hover transition-colors text-text-secondary cursor-pointer"
          disabled={isLoading}
        >
          Отмена
        </button>
      </div>
    </form>
  );
} 