'use client';
import {useEffect, useState, Suspense} from 'react';
import {useRouter, useSearchParams} from 'next/navigation';
import {useDispatch} from 'react-redux';
import {setAuthData} from '@/store/userSlice';
import {fetchCurrentUser} from '@/api/auth';
import {createContext, useContext} from 'react';

// Создаем контекст для передачи состояния и функций
const AuthCallbackContext = createContext<{
  setError: (error: string | null) => void;
  dispatch: any;
  router: any;
}>({
  setError: () => {},
  dispatch: null,
  router: null
});

// Компонент для обработки параметров URL
function SearchParamsHandler() {
  const searchParams = useSearchParams();
  const {setError, dispatch, router} = useContext(AuthCallbackContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = searchParams.get('token');
        const refresh = searchParams.get('refresh');

        if (!token) {
          setError('No token received');
          return;
        }

        // Store the token in Redux
        dispatch(setAuthData({ token }));
        
        // Now fetch user data
        try {
          const userData = await fetchCurrentUser();
          dispatch(setAuthData({ user: userData }));
        } catch (fetchError) {
          console.error('Error fetching user data:', fetchError);
          // We'll still continue even if user data fetch fails
          // The app can try to fetch it again later
        }

        // Navigate to home page
        router.push('/');
      } catch (err) {
        setError('Authentication failed');
        console.error(err);
      }
    };

    fetchData();
  }, [searchParams, dispatch, router, setError]);

  return null;
}

export default function AuthCallbackPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [error, setError] = useState<string | null>(null);

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-red-50 p-4 rounded-md">
          <p className="text-red-700">Error: {error}</p>
          <button 
            onClick={() => router.push('/login')}
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Logging in...</h1>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        
        <AuthCallbackContext.Provider value={{ setError, dispatch, router }}>
          <Suspense fallback={null}>
            <SearchParamsHandler />
          </Suspense>
        </AuthCallbackContext.Provider>
      </div>
    </div>
  );
} 