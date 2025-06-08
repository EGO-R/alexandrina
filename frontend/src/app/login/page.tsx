'use client';
import {useEffect, useState, Suspense} from 'react';
import {getGoogleOAuthUrl, login} from '@/api/auth';
import {useDispatch} from 'react-redux';
import {setAuthData} from '@/store/userSlice';
import {useRouter, useSearchParams} from 'next/navigation';
import Link from 'next/link';
import {createContext, useContext} from 'react';
import {Logger} from '@/config';

// Компонент для обработки параметров URL
function SearchParamsHandler() {
    const searchParams = useSearchParams();
    const setError = useSearchParamsErrorSetter();

    useEffect(() => {
        // Check for error message in URL parameters
        const errorParam = searchParams.get('error');
        if (errorParam) {
            setError(decodeURIComponent(errorParam));
        }
    }, [searchParams, setError]);

    return null;
}

// Создаем контекст для передачи функции установки ошибки
const SearchParamsErrorContext = createContext<(error: string) => void>(() => {});

export const useSearchParamsErrorSetter = () => useContext(SearchParamsErrorContext);

export default function LoginPage() {
    const dispatch = useDispatch();
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await login({email, password});
            dispatch(setAuthData({user: response.user, token: response.token}));
            Logger.debug('Login successful, redirecting to home');
            router.push('/');
        } catch (err: any) {
            Logger.error('Login error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = getGoogleOAuthUrl();
    };

    return (
        <main className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[calc(100vh-200px)]">
            <div className="w-full max-w-md bg-surface rounded-lg shadow-md p-8">
                <h1 className="text-2xl font-bold mb-6 text-text-primary text-center">Вход в аккаунт</h1>

                {/* Оборачиваем компонент, использующий useSearchParams, в Suspense */}
                <SearchParamsErrorContext.Provider value={setError}>
                    <Suspense fallback={null}>
                        <SearchParamsHandler />
                    </Suspense>
                </SearchParamsErrorContext.Provider>

            {error && (
                    <div className="mb-6 p-4 bg-danger/10 border border-danger/20 text-danger rounded-lg flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{error}</span>
                </div>
            )}

                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-1">
                            Email
                        </label>
                <input
                            id="email"
                    type="email"
                            placeholder="Введите email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                            className="w-full"
                    required
                />
                    </div>
                    
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-text-secondary mb-1">
                            Пароль
                        </label>
                <input
                            id="password"
                    type="password"
                            placeholder="Введите пароль"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                            className="w-full"
                    required
                />
                    </div>
                    
                <button
                    type="submit"
                    disabled={loading}
                        className="btn btn-primary w-full py-3"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Вход...
                            </span>
                        ) : 'Войти'}
                </button>
            </form>

                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-surface text-text-secondary">Или</span>
                    </div>
                </div>

                <button
                    onClick={handleGoogleLogin}
                    className="flex items-center justify-center w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm bg-white dark:bg-gray-800 text-text-primary hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                    <svg viewBox="0 0 24 24" width="16" height="16" className="mr-2">
                        <path 
                            fill="#4285F4" 
                            d="M23.745 12.27c0-.79-.07-1.54-.19-2.27h-11.3v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"
                        />
                        <path 
                            fill="#34A853" 
                            d="M12.255 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96h-3.98v3.09c1.97 3.92 6.02 6.62 10.71 6.62z"
                        />
                        <path 
                            fill="#FBBC05" 
                            d="M5.525 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29v-3.09h-3.98c-.81 1.61-1.27 3.41-1.27 5.38s.46 3.77 1.27 5.38l3.98-3.09z"
                        />
                        <path 
                            fill="#EA4335" 
                            d="M12.255 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42c-2.07-1.94-4.78-3.13-8.02-3.13-4.69 0-8.74 2.7-10.71 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"
                        />
                    </svg>
                    Войти через Google
                </button>

                <div className="mt-8 text-center">
                    <span className="text-text-secondary">Ещё нет аккаунта? </span>
                    <Link href="/register" className="text-primary hover:text-primary-hover font-medium transition-colors">
                    Зарегистрироваться
                </Link>
                </div>
            </div>
        </main>
    );
}
