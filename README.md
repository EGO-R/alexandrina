# Alexandrina

Видеохостинг с современным интерфейсом на базе Next.js (фронтенд), Kotlin Spring Boot (бэкенд) и PostgreSQL (база данных).
Полностью контейнеризированное приложение с использованием Docker, Nginx и многоэтапной сборки.

## Архитектура

- **Frontend**: Next.js 15, React, TypeScript, Redux Toolkit
- **Backend**: Kotlin Spring Boot 3.4, jOOQ, WebFlux
- **БД**: PostgreSQL 16
- **Инфраструктура**: Docker, Nginx, S3-совместимое хранилище

## Запуск с помощью Docker

### Необходимые переменные окружения

Создайте файл `.env` в корне проекта со следующими переменными:

```env
# Безопасность (желательно изменить)
JWT_SECRET=your-jwt-secret-key

# Настройки S3 хранилища (необходимы для хранения видео и изображений)
S3_KEY_ID=your-s3-key-id
S3_SECRET_KEY=your-s3-secret-key
S3_REGION=your-s3-region
S3_ENDPOINT=your-s3-endpoint
S3_BUCKET=alexandrina
S3_BUCKET_TEMP=alexandrina-temp

# Параметры доступа к базе данных (опционально, есть значения по умолчанию)
POSTGRES_DB=alexandrina
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres

# Название хоста (опционально, по умолчанию localhost)
HOST_NAME=localhost

# Включение OAuth2 аутентификации (опционально, по умолчанию false)
# Если установлено в true, необходимо указать также GOOGLE_CLIENT_ID и GOOGLE_CLIENT_SECRET
OAUTH2_ENABLED=false
```

### Запуск

```bash
# Запуск всех сервисов
docker-compose up -d

# Запуск с пересборкой
docker-compose up -d --build

# Запуск с пересборкой и указанием HOST_NAME (для корректных URL в продакшене)
HOST_NAME=example.com docker-compose up -d --build
```

После запуска приложение будет доступно по адресу http://localhost (порт 80).

## Структура проекта

- `/frontend` - Next.js приложение
- `/backend` - Spring Boot приложение
- `/nginx` - Конфигурация Nginx
- `docker-compose.yaml` - Управление контейнерами

## Возможности приложения

- Регистрация/авторизация (Google OAuth2 или email/password)
- Загрузка видео с превью
- Создание плейлистов
- Просмотр видео и плейлистов
- Поиск контента
- Адаптивный интерфейс

## Автор

Трусов Егор Сергеевич, ИКБО-16-22 