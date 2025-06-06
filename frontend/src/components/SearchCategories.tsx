'use client';
import { useRouter } from 'next/navigation';

// Популярные категории видео
const POPULAR_CATEGORIES = [
  { name: 'Музыка', query: 'music' },
  { name: 'Игры', query: 'games' },
  { name: 'Программирование', query: 'programming' },
  { name: 'Образование', query: 'education' },
  { name: 'Спорт', query: 'sports' },
  { name: 'Технологии', query: 'tech' },
  { name: 'Путешествия', query: 'travel' },
  { name: 'Кулинария', query: 'cooking' }
];

export default function SearchCategories() {
  const router = useRouter();

  const handleCategoryClick = (query: string) => {
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="py-4 mb-6">
      <h2 className="text-xl font-semibold mb-4">Популярные категории</h2>
      <div className="flex flex-wrap gap-2">
        {POPULAR_CATEGORIES.map((category) => (
          <button
            key={category.query}
            onClick={() => handleCategoryClick(category.query)}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm transition-colors"
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
} 