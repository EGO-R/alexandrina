import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthData, clearAuthData } from '@/store/userSlice';
import { login, register, fetchCurrentUser } from '@/api/auth';
import type { AuthRequest } from '@/types';
import { RootState } from '@/store/store';
import { Logger } from '@/config';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state: RootState) => state.user);

  const loginUser = useCallback(async (authData: AuthRequest) => {
    try {
      Logger.debug('Attempting to login user', { email: authData.email });
      const response = await login(authData);
      
      dispatch(setAuthData({
        user: response.user,
        token: response.token,
      }));
      
      // Сохраняем токен только если доступно API localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', response.token);
      }
      
      Logger.info('User logged in successfully', { userId: response.user.id });
      return response;
    } catch (error) {
      Logger.error('Login error:', error);
      throw error;
    }
  }, [dispatch]);

  const registerUser = useCallback(async (authData: AuthRequest) => {
    try {
      Logger.debug('Attempting to register user', { email: authData.email });
      const response = await register(authData);
      
      dispatch(setAuthData({
        user: response.user,
        token: response.token,
      }));
      
      // Сохраняем токен только если доступно API localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', response.token);
      }
      
      Logger.info('User registered successfully', { userId: response.user.id });
      return response;
    } catch (error) {
      Logger.error('Register error:', error);
      throw error;
    }
  }, [dispatch]);

  const logoutUser = useCallback(() => {
    Logger.debug('Logging out user');
    
    // Удаляем токен только если доступно API localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
    
    dispatch(clearAuthData());
    Logger.info('User logged out');
  }, [dispatch]);

  const checkAuth = useCallback(async () => {
    // Проверяем токен только если доступно API localStorage
    if (typeof window === 'undefined') {
      return null;
    }
    
    const token = localStorage.getItem('token');
    if (token) {
      try {
        Logger.debug('Checking authentication status');
        const userData = await fetchCurrentUser();
        
        dispatch(setAuthData({
          user: userData,
          token,
        }));
        
        Logger.info('User authentication verified', { userId: userData.id });
        return userData;
      } catch (error) {
        Logger.error('Auth check error:', error);
        localStorage.removeItem('token');
        dispatch(clearAuthData());
      }
    }
    return null;
  }, [dispatch]);

  const isAuthenticated = !!token;

  return {
    user,
    token,
    isAuthenticated,
    loginUser,
    registerUser,
    logoutUser,
    checkAuth,
  };
}; 