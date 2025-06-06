import { urlFromBack, urlToBack } from "@/api/urlUtils";
import { fetchWithAuth } from "@/api/fetchWithAuth";
import { API_ENDPOINTS } from "@/config";
import { PrivacyType } from "@/types";
import type { Video, VideoResponse, VideoSearchQuery, PlaylistToVideoDto } from "@/types";

function mapVideoResponse(video: VideoResponse): Video {
    return {
        id: video.id,
        name: video.name,
        preview: urlFromBack(video.previewKey),
        videoUrl: urlFromBack(video.videoKey),
        privacyType: video.privacyType,
        author: video.author,
    };
}

function mapVideoListResponse(videos: VideoResponse[]): Video[] {
    return videos.map(mapVideoResponse);
}

export async function fetchVideoById(id: number): Promise<Video> {
    const res = await fetchWithAuth(API_ENDPOINTS.videos.get(id));

    if (!res.ok) {
        throw new Error('Ошибка загрузки видео');
    }

    const data: VideoResponse = await res.json();
    return mapVideoResponse(data);
}

export async function getPresignedUploadUrl(): Promise<string> {
    const res = await fetchWithAuth(API_ENDPOINTS.s3.video);

    if (!res.ok) {
        throw new Error('Не удалось получить ссылку для загрузки видео');
    }

    const data = await res.json();
    return data.url;
}

export async function getPresignedPreviewUrl(): Promise<string> {
    const res = await fetchWithAuth(API_ENDPOINTS.s3.preview);

    if (!res.ok) {
        throw new Error('Не удалось получить ссылку для загрузки превью');
    }

    const data = await res.json();
    return data.url;
}

export async function updateVideo(id: number, name: string, privacyType: PrivacyType) {
    const payload = { name, privacyType };
    
    const res = await fetchWithAuth(API_ENDPOINTS.videos.update(id), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        throw new Error('Ошибка обновления видео');
    }
}

export async function deleteVideo(id: number) {
    const res = await fetchWithAuth(API_ENDPOINTS.videos.delete(id), {
        method: 'DELETE',
    });

    if (!res.ok) {
        throw new Error('Ошибка удаления видео');
    }
}

export async function createVideo(
    name: string,
    previewUrl: string,
    videoUrl: string,
    privacyType: PrivacyType = PrivacyType.PUBLIC,
): Promise<Video> {
    const previewPath = urlToBack(previewUrl);
    const videoPath = urlToBack(videoUrl);
    
    const res = await fetchWithAuth(API_ENDPOINTS.videos.create, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name,
            previewUrl: previewPath,
            videoUrl: videoPath,
            privacyType,
        }),
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Ошибка сохранения видео на сервере');
    }

    return res.json();
}

function buildQuery(params: VideoSearchQuery): string {
    const query = new URLSearchParams();

    if (params.name) query.append('name', params.name);
    if (params.authorID) query.append('authorID', params.authorID.toString());
    if (params.sortField) query.append('paginationOptions.sortField', params.sortField);
    if (params.sortDirection) query.append('paginationOptions.direction', params.sortDirection);
    if (params.size) query.append('paginationOptions.size', params.size.toString());
    if (params.lastSelectedValue) query.append('paginationOptions.lastSelectedValue', params.lastSelectedValue);

    return query.toString();
}

export async function fetchVideos(params?: VideoSearchQuery): Promise<Video[]> {
    let url = API_ENDPOINTS.videos.list;

    if (params) {
        const queryString = buildQuery(params);
        url += `?${queryString}`;
    }

    const res = await fetchWithAuth(url);

    if (!res.ok) {
        throw new Error('Ошибка при загрузке видео');
    }

    const data: VideoResponse[] = await res.json();
    return mapVideoListResponse(data);
}

// Получение списка плейлистов для видео
export async function getVideoPlaylists(videoId: number): Promise<PlaylistToVideoDto[]> {
    const res = await fetchWithAuth(API_ENDPOINTS.videos.playlists(videoId));
    
    if (!res.ok) {
        throw new Error('Ошибка при получении плейлистов для видео');
    }
    
    return res.json();
}
