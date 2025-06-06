'use client';
import {useState} from 'react';
import {useRouter} from 'next/navigation';
import {createVideo, getPresignedPreviewUrl, getPresignedUploadUrl} from '@/api/videos';
import {uploadFileToS3} from '@/api/s3Upload';
import {PrivacyType} from '@/types';

interface VideoFormData {
    name: string;
    preview: File | null;
    videoFile: File | null;
    privacyType: PrivacyType;
}

export default function UploadVideo() {
    const router = useRouter();

    const [formData, setFormData] = useState<VideoFormData>({
        name: '',
        preview: null,
        videoFile: null,
        privacyType: PrivacyType.PUBLIC,
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [uploadProgress, setUploadProgress] = useState(0);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, files } = e.target as HTMLInputElement;
        
        if (files && files.length > 0) {
            setFormData({ ...formData, [name]: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setUploadProgress(0);

        if (!formData.videoFile || !formData.preview) {
            setError('Заполните все поля и выберите файлы.');
            setLoading(false);
            return;
        }

        if (formData.videoFile.size > 5 * 1024 * 1024 * 1024) {
            setError("Видео не должно превышать 5 ГБ");
            setLoading(false);
            return;
        }

        try {
            // Шаг 1: Получаем presigned URL для видео
            const videoPresignedUrl = await getPresignedUploadUrl();
            
            // Шаг 2: Получаем presigned URL для превью
            const previewPresignedUrl = await getPresignedPreviewUrl();

            // Шаг 3: Загружаем превью в S3
            await uploadFileToS3(previewPresignedUrl, formData.preview, (progress) => {
                setUploadProgress(progress * 0.2); // 20% от общего прогресса
            });

            // Шаг 4: Загружаем видео в S3
            await uploadFileToS3(videoPresignedUrl, formData.videoFile, (progress) => {
                setUploadProgress(20 + progress * 0.8); // Оставшиеся 80% от общего прогресса
            });

            // Шаг 5: Отправляем данные на бекенд
            const video = await createVideo(
                formData.name, 
                previewPresignedUrl, 
                videoPresignedUrl, 
                formData.privacyType
            );

            router.push(`/video/${video.id}`);
        } catch (err: any) {
            setError(err.message || 'Ошибка при загрузке видео.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Загрузить новое видео</h1>
            <form onSubmit={handleSubmit} className="flex flex-col space-y-4 max-w-lg">
                <input
                    type="text"
                    name="name"
                    placeholder="Название видео"
                    value={formData.name}
                    onChange={handleChange}
                    className="border p-2 rounded"
                    required
                />

                <label className="font-medium">Превью-картинка:</label>
                <input
                    type="file"
                    name="preview"
                    accept="image/*"
                    onChange={handleChange}
                    className="border p-2 rounded"
                    required
                />

                <label className="font-medium">Файл видео (до 5 ГБ):</label>
                <input
                    type="file"
                    name="videoFile"
                    accept="video/*"
                    onChange={handleChange}
                    className="border p-2 rounded"
                    required
                />

                <label className="font-medium">Приватность:</label>
                <select 
                    name="privacyType"
                    value={formData.privacyType}
                    onChange={handleChange}
                    className="border p-2 rounded"
                >
                    <option value={PrivacyType.PUBLIC}>Публичное</option>
                    <option value={PrivacyType.PRIVATE}>Личное</option>
                </select>

                {error && <p className="text-red-600">{error}</p>}

                {loading && (
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                            className="bg-blue-600 h-2.5 rounded-full" 
                            style={{ width: `${uploadProgress}%` }}
                        ></div>
                        <p className="text-xs text-center mt-1">{Math.round(uploadProgress)}%</p>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-500 hover:bg-blue-600 text-white py-2 rounded"
                >
                    {loading ? 'Загрузка...' : 'Загрузить'}
                </button>
            </form>
        </main>
    );
}
