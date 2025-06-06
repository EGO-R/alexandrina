import {fetchWithAuth} from "@/api/fetchWithAuth";

export type ProgressCallback = (progress: number) => void;

export async function uploadFileToS3(
    presignedUrl: string, 
    file: File, 
    onProgress?: ProgressCallback
) {
    // If we have XMLHttpRequest available, use it for progress tracking
    if (window.XMLHttpRequest && onProgress) {
        return new Promise<void>((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            
            xhr.upload.addEventListener('progress', (event) => {
                if (event.lengthComputable) {
                    const percentComplete = (event.loaded / event.total) * 100;
                    onProgress(percentComplete);
                }
            });
            
            xhr.addEventListener('load', () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    resolve();
                } else {
                    reject(new Error(`Error uploading file to S3: ${xhr.statusText}`));
                }
            });
            
            xhr.addEventListener('error', () => {
                reject(new Error('Network error during file upload'));
            });
            
            xhr.open('PUT', presignedUrl);
            xhr.setRequestHeader('Content-Type', file.type);
            xhr.send(file);
        });
    }
    
    // Fallback to regular fetch if no progress tracking needed
    const res = await fetchWithAuth(presignedUrl, {
        method: 'PUT',
        body: file,
        headers: {
            'Content-Type': file.type,
        },
    });

    if (!res.ok) {
        throw new Error('Ошибка загрузки файла в S3');
    }
}
