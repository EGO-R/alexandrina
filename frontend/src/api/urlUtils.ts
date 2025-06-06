import { S3_CONFIG } from '@/config';

// Убедимся, что URL формируется правильно для всех изображений
export function urlFromBack(key: string): string {
    if (!key) return '';
    
    // Если ключ уже полный URL, вернем его как есть
    if (key.startsWith('http')) return key;
    
    return `${S3_CONFIG.baseUrl}/${S3_CONFIG.bucketName}/${key}`;
}

export function urlToBack(fullUrl: string): string {
    if (!fullUrl) return '';
    
    // Если это не полный URL, предполагаем что это уже ключ
    if (!fullUrl.startsWith('http')) return fullUrl;
    
    const baseWithBucket = `${S3_CONFIG.baseUrl}/${S3_CONFIG.bucketName}/`;
    const keyUrl = fullUrl.replace(baseWithBucket, '');
    return keyUrl.includes('?') ? keyUrl.split('?')[0] : keyUrl;
}
