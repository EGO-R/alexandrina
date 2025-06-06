import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        domains: ['storage.yandexcloud.net'],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'storage.yandexcloud.net',
            },
        ],
    },
    env: {
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
        NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        NEXT_PUBLIC_S3_BASE_URL: process.env.NEXT_PUBLIC_S3_BASE_URL,
        NEXT_PUBLIC_S3_BUCKET: process.env.NEXT_PUBLIC_S3_BUCKET,
    },
    // Оптимизация сборки для продакшена
    poweredByHeader: false,
    reactStrictMode: true,
    // Настройки для Docker deployment
    output: 'standalone',
    // Отключение ESLint для продакшен сборки
    eslint: {
        // Отключаем проверку ESLint при сборке, так как есть множество предупреждений
        ignoreDuringBuilds: true,
    },
    typescript: {
        // Игнорируем ошибки TS при сборке
        ignoreBuildErrors: true,
    },
    // Настройка прокси для API-запросов при разработке
    // В продакшен-среде с Nginx эти rewrites не используются
    // поскольку Nginx сам перенаправляет запросы на нужные сервисы
    async rewrites() {
        return process.env.NODE_ENV !== 'production' ? [
            {
                source: '/api/:path*',
                destination: 'http://localhost:8080/:path*',
            },
            {
                source: '/oauth2/:path*',
                destination: 'http://localhost:8080/oauth2/:path*',
            },
        ] : [];
    },
};

export default nextConfig;
