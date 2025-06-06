import { fetchWithAuth } from "@/api/fetchWithAuth";
import { API_ENDPOINTS } from "@/config";
import type { AuthRequest, AuthResponse, User } from "@/types";

export async function register(authData: AuthRequest): Promise<AuthResponse> {
    try {
        const res = await fetchWithAuth(API_ENDPOINTS.auth.register, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(authData),
        });

        return res.json();
    } catch (error) {
        // Перехватываем ошибку из fetchWithAuth и добавляем дополнительную информацию при необходимости
        if (error instanceof Error) {
            throw new Error(error.message || 'Ошибка регистрации');
        }
        throw new Error('Ошибка регистрации');
    }
}

export async function login(authData: AuthRequest): Promise<AuthResponse> {
    try {
        const res = await fetchWithAuth(API_ENDPOINTS.auth.login, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(authData),
        });

        return res.json();
    } catch (error) {
        // Перехватываем ошибку из fetchWithAuth и добавляем дополнительную информацию при необходимости
        if (error instanceof Error) {
            throw new Error(error.message || 'Ошибка авторизации');
        }
        throw new Error('Ошибка авторизации');
    }
}

// Get the Google OAuth URL - use Spring's built-in OAuth endpoint
export function getGoogleOAuthUrl(): string {
    return API_ENDPOINTS.auth.googleOAuth;
}

// Get current user data after OAuth login
export async function fetchCurrentUser(): Promise<User> {
    try {
        const res = await fetchWithAuth(API_ENDPOINTS.auth.me, {
            method: 'GET',
        });

        return res.json();
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message || 'Не удалось получить данные пользователя');
        }
        throw new Error('Не удалось получить данные пользователя');
    }
}

// Get presigned URL for avatar upload
export async function getAvatarUploadUrl(): Promise<{ url: string }> {
    try {
        const res = await fetchWithAuth(API_ENDPOINTS.s3.avatar, {
            method: 'GET',
        });

        return res.json();
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message || 'Не удалось получить URL для загрузки аватара');
        }
        throw new Error('Не удалось получить URL для загрузки аватара');
    }
}
