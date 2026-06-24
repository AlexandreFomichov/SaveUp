const API_BASE_URL = import.meta.env.VITE_API_URL || (typeof window !== 'undefined' ? `${window.location.origin}/api` : 'http://localhost:3000/api');

const defaultHeaders = {
  'Content-Type': 'application/json',
};

const parseJson = async (response) => {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch (err) {
    return text;
  }
};

export async function fetchWithAuth(endpoint, options = {}, token) {
  const headers = {
    ...defaultHeaders,
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const data = await parseJson(response);
    const message = data?.message || data?.error || response.statusText || 'Erro na requisição';
    const error = new Error(message);
    error.status = response.status;
    error.body = data;
    throw error;
  }

  return parseJson(response);
}
