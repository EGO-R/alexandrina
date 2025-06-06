import { useState, useCallback } from 'react';
import { fetchUserById } from '@/api/users';
import type { User } from '@/types';

export const useUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<User | null>(null);

  const getUserById = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchUserById(id);
      setUserData(data);
      return data;
    } catch (err: any) {
      setError(err.message || 'Ошибка при загрузке данных пользователя');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    userData,
    getUserById,
  };
}; 