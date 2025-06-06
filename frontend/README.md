# Alexandrina Frontend

Фронтенд-часть приложения для загрузки и просмотра видео.

## Технологии

- Next.js 15
- React 19
- Redux Toolkit для управления состоянием
- Tailwind CSS для стилизации

## Структура проекта

```
frontend/
├── public/           # Статические файлы
├── src/              # Исходный код
│   ├── api/          # API клиент для взаимодействия с бэкендом
│   ├── app/          # Next.js страницы и роутинг
│   ├── components/   # React компоненты
│   │   └── ui/       # Переиспользуемые UI компоненты
│   ├── config/       # Конфигурация приложения
│   ├── hooks/        # Пользовательские React хуки
│   ├── store/        # Redux хранилище
│   └── types/        # TypeScript типы
```

## Запуск проекта

### Требования

- Node.js 18+ 
- npm или yarn

### Установка зависимостей

```bash
npm install
# или
yarn install
```

### Запуск в режиме разработки

```bash
npm run dev
# или
yarn dev
```

### Сборка для продакшена

```bash
npm run build
# или
yarn build
```

### Запуск продакшен-версии

```bash
npm run start
# или
yarn start
```

## Переменные окружения

Создайте файл `.env.local` в корне проекта. Вы можете скопировать `.env.local.example` и отредактировать его:

```bash
cp .env.local.example .env.local
```

Доступные переменные окружения:

| Переменная | Описание | Пример значения |
|------------|----------|-----------------|
| NEXT_PUBLIC_API_URL | URL API бэкенда | http://localhost:8080 |
| NEXT_PUBLIC_GOOGLE_CLIENT_ID | Client ID для Google OAuth | your_google_client_id |
| NEXT_PUBLIC_S3_BASE_URL | URL S3-совместимого хранилища | https://storage.yandexcloud.net |
| NEXT_PUBLIC_S3_BUCKET | Имя бакета для хранения файлов | alexandrina |

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
