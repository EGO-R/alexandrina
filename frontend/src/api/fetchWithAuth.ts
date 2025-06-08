import {store} from '@/store/store';
import {clearAuthData} from '@/store/userSlice';
import {Logger} from '@/config';

export async function fetchWithAuth(input: RequestInfo, init?: RequestInit) {
    const state = store.getState();
    const token = state.user.token;

    const headers = new Headers(init?.headers || {});
    if (token) {
        headers.set('Authorization', `Bearer ${token}`);
    }

    try {
        Logger.debug(`API Request: ${typeof input === 'string' ? input : input.url}`, {
            method: init?.method || 'GET'
        });

    const response = await fetch(input, { ...init, headers });

        if (!response.ok) {
            // Получаем тело ответа
            const errorBody = await response.text();
            let errorMessage: string;
            
            try {
                const errorJson = JSON.parse(errorBody);
                errorMessage = errorJson.message || `Ошибка сервера: ${response.status}`;
            } catch {
                errorMessage = `Ошибка сервера: ${response.status}`;
            }
            
            const url = typeof input === 'string' ? input : input.url;
            
            // Обработка ошибок 400 для регистрации
            if (response.status === 400) {
                if (url.includes('/api/auth/register')) {
                    errorMessage = 'Пользователь с таким email уже существует';
                }
            }
            // Более понятные сообщения для ошибок аутентификации
            else if (response.status === 401) {
                // Проверяем тип запроса для более точного сообщения об ошибке
                if (url.includes('/api/auth/login')) {
                    errorMessage = 'Неверный логин или пароль';
                } else if (url.includes('/api/auth/register')) {
                    errorMessage = 'Ошибка при регистрации. Возможно, пользователь с таким email уже существует.';
                } else if (!url.includes('oauth2')) {
                    // Только для обычных API-вызовов, не для OAuth
                    Logger.warn(`Unauthorized request: ${url}`);
            store.dispatch(clearAuthData());
            
                    // Только перенаправляем, если мы не на странице логина или регистрации
                    if (typeof window !== 'undefined' && 
                        !window.location.pathname.includes('/login') && 
                        !window.location.pathname.includes('/register')) {
                window.location.href = '/login';
            }
                    
                    errorMessage = 'Необходима авторизация';
                }
            }
            
            Logger.error(`API Error: ${errorMessage}`, {
                status: response.status,
                url: typeof input === 'string' ? input : input.url
            });
            
            throw new Error(errorMessage);
    }

    return response;
    } catch (error) {
        if (error instanceof Error) {
            Logger.error(`Fetch error: ${error.message}`, error);
        } else {
            Logger.error('Unknown fetch error', error);
        }
        throw error;
    }
}
