'use client';
import {useEffect, useState} from 'react';
import {useParams, useRouter} from 'next/navigation';
import {deleteVideo, fetchVideoById, updateVideo} from '@/api/videos';
import {PrivacyType, Video} from '@/types';
import {useSelector} from 'react-redux';
import { RootState } from '@/store/store';

export default function EditVideoPage() {
    const router = useRouter();
    const params = useParams<{ id: string }>();
    const videoId = Number(params.id);
    const currentUser = useSelector((state: RootState) => state.user.user);

    const [video, setVideo] = useState<Video | null>(null);
    const [name, setName] = useState('');
    const [privacyType, setPrivacyType] = useState<PrivacyType>(PrivacyType.PUBLIC);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        fetchVideoById(videoId)
            .then((data) => {
                setVideo(data);
                setName(data.name);
                setPrivacyType(data.privacyType);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, [videoId]);

    // Check if user has permission to edit this video
    useEffect(() => {
        if (!loading && video && currentUser) {
            const canEdit = currentUser.role === 'ADMIN' || currentUser.id === video.author.id;
            if (!canEdit) {
                router.push(`/video/${videoId}`);
            }
        }
    }, [loading, video, currentUser, router, videoId]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError('');

        try {
            await updateVideo(videoId, name, privacyType);
            router.push(`/video/${videoId}`);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Вы точно хотите удалить видео?')) return;

        setDeleting(true);
        setError('');

        try {
            await deleteVideo(videoId);
            router.push('/');
        } catch (err: any) {
            setError(err.message);
            setDeleting(false);
        }
    };

    if (loading) return <div className="container mx-auto p-4">Загрузка...</div>;
    if (error) return <div className="container mx-auto p-4">Ошибка: {error}</div>;
    if (!video) return <div className="container mx-auto p-4">Видео не найдено</div>;

    return (
        <main className="container mx-auto px-4 py-8 max-w-xl">
            <h1 className="text-2xl font-bold mb-4">Редактировать видео</h1>

            <form onSubmit={handleSave} className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-1">
                        Название
                    </label>
                    <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="border p-2 rounded w-full"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="privacyType" className="block text-sm font-medium mb-1">
                        Приватность видео
                    </label>
                    <select
                        id="privacyType"
                        value={privacyType}
                        onChange={(e) => {
                            const selectedType = e.target.value as PrivacyType;
                            setPrivacyType(selectedType);
                        }}
                        className="border p-2 rounded w-full"
                    >
                        <option value={PrivacyType.PUBLIC}>Публичное</option>
                        <option value={PrivacyType.PRIVATE}>Приватное</option>
                    </select>
                </div>

                {error && <p className="text-red-600">{error}</p>}

                <div className="flex space-x-4">
                    <button
                        type="submit"
                        disabled={saving}
                        className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                    >
                        {saving ? 'Сохранение...' : 'Сохранить'}
                    </button>

                    <button
                        type="button"
                        disabled={deleting}
                        onClick={handleDelete}
                        className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
                    >
                        {deleting ? 'Удаление...' : 'Удалить видео'}
                    </button>
                </div>
            </form>
        </main>
    );
}
