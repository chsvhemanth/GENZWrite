export const API_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:4000';

export async function apiFetch(path: string, options: RequestInit = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });
  if (!res.ok) {
    throw new Error(await res.text());
  }
  return res.json();
}


