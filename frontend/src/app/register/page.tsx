'use client';
import {useState} from 'react';
import {register} from '@/api/auth';
import {useDispatch} from 'react-redux';
import {setAuthData} from '@/store/userSlice';
import {useRouter} from 'next/navigation';
import Link from 'next/link';
import {Logger} from '@/config';

export default function RegisterPage() {
    const dispatch = useDispatch();
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Дополнительная валидация на фронтенде
        if (password !== confirmPassword) {
            setError('Пароли не совпадают');
            setLoading(false);
            return;
        }
        
        if (password.length < 6) {
            setError('Пароль должен содержать не менее 6 символов');
            setLoading(false);
            return;
        }

        try {
            Logger.debug('Attempting to register user', { email });
            const response = await register({ email, password });
            dispatch(setAuthData({ user: response.user, token: response.token }));
            router.push('/');
        } catch (err: any) {
            Logger.error('Registration error:', err);
            setError(err.message);
            // Не перенаправляем при ошибке, чтобы пользователь мог исправить данные
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[calc(100vh-200px)]">
            <div className="w-full max-w-md bg-surface rounded-lg shadow-md p-8">
                <h1 className="text-2xl font-bold mb-6 text-text-primary text-center">Создание аккаунта</h1>

                {error && (
                    <div className="mb-6 p-4 bg-danger/10 border border-danger/20 text-danger rounded-lg flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleRegister} className="space-y-5">
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
                            placeholder="Введите пароль (не менее 6 символов)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                            className="w-full"
                            required
                            minLength={6}
                        />
                    </div>
                    
                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-text-secondary mb-1">
                            Подтверждение пароля
                        </label>
                        <input
                            id="confirmPassword"
                            type="password"
                            placeholder="Введите пароль повторно"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
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
                                Регистрация...
                            </span>
                        ) : 'Зарегистрироваться'}
                </button>
            </form>

                <div className="mt-8 text-center">
                    <span className="text-text-secondary">Уже есть аккаунт? </span>
                    <Link href="/login" className="text-primary hover:text-primary-hover font-medium transition-colors">
                        Войти
                    </Link>
                </div>
            </div>
        </main>
    );
}
