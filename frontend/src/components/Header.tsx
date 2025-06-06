'use client';
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { DEFAULT_IMAGES, UI_CONFIG } from '@/config';

export default function Header() {
    const router = useRouter();
    const { user, logoutUser } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const menuRef = useRef<HTMLDivElement>(null);

    // Используем дефолтный аватар, если с бэкенда пришел null
    const avatarSrc = user?.avatarUrl || DEFAULT_IMAGES.avatar;

    // Закрыть меню при клике вне его
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Обработчик выхода из аккаунта
    const handleLogout = () => {
        logoutUser();
        setIsMenuOpen(false);
        router.push('/');
    };
    
    // Обработчик отправки формы поиска
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    return (
        <header className="header shadow-sm py-4 sticky top-0 z-50">
            <div className="container mx-auto flex items-center justify-between px-4">
                {/* Логотип слева */}
                <Link href="/" className="flex items-center">
                    <Image
                        src={DEFAULT_IMAGES.logo}
                        alt={UI_CONFIG.appName}
                        width={45}
                        height={45}
                        className="mr-2"
                        unoptimized={true}
                    />
                    <span className="text-xl font-bold text-primary hidden sm:block">
                        {UI_CONFIG.appName}
                    </span>
                </Link>

                {/* Поле поиска - только для авторизованных пользователей */}
                {user ? (
                    <form onSubmit={handleSearch} className="w-full max-w-md mx-4">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Поиск видео..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-4 py-2 pr-10 rounded-full border-border focus:border-primary"
                            />
                            <button 
                                type="submit"
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-tertiary hover:text-primary transition-colors"
                                aria-label="Поиск"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                                </svg>
                            </button>
                        </div>
                    </form>
                ) : (
                    /* Пустой блок для сохранения выравнивания */
                    <div className="flex-grow"></div>
                )}

                <div className="flex items-center space-x-4">
                    {user ? (
                        <>
                            <Link href="/upload" className="btn btn-primary flex items-center py-1.5 px-3 text-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                                </svg>
                                <span className="hidden sm:inline">Загрузить</span>
                            </Link>
                            
                            {/* Аватар с выпадающим меню */}
                            <div className="relative" ref={menuRef}>
                                <button 
                                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                                    className="focus:outline-none"
                                    aria-label="Меню пользователя"
                                >
                                    <div className="relative w-9 h-9 overflow-hidden rounded-full border-2 border-primary">
                                        <Image
                                            src={avatarSrc}
                                            alt={user.name}
                                            fill
                                            className="object-cover"
                                            unoptimized={true}
                                        />
                                    </div>
                                </button>
                                
                                {isMenuOpen && (
                                    <div className="dropdown-menu absolute right-0 mt-2 w-60 py-1 z-10">
                                        <div className="px-4 py-3 border-b border-border">
                                            <p className="font-semibold text-text-primary">{user.name}</p>
                                            <p className="text-xs text-text-tertiary truncate mt-1">{user.email}</p>
                                        </div>
                                        <Link 
                                            href={`/channel/${user.id}`}
                                            className="block px-4 py-2 text-sm text-text-secondary hover:bg-surface-hover flex items-center cursor-pointer"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5" />
                                            </svg>
                                            Мой канал
                                        </Link>
                                        <button 
                                            onClick={handleLogout}
                                            className="block w-full text-left px-4 py-2 text-sm text-danger hover:bg-surface-hover flex items-center"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                                            </svg>
                                            Выйти
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <Link href="/login" className="btn btn-primary py-1.5 px-4 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                            </svg>
                            Войти
                        </Link>
                    )}
                </div>
            </div>
        </header>
    )
}
