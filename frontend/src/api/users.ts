import { fetchWithAuth } from "@/api/fetchWithAuth";
import { API_ENDPOINTS } from "@/config";
import type { User } from "@/types";

/**
 * Получение информации о пользователе по ID
 */
export async function fetchUserById(id: number): Promise<User> {
  const res = await fetchWithAuth(`${API_ENDPOINTS.users.get(id)}`);
  
  if (!res.ok) {
    throw new Error('Ошибка загрузки информации о пользователе');
  }
  
  return res.json();
} 