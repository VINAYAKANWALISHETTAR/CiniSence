const API_BASE = '/api';

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token');
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new ApiError(response.status, error.error || 'Request failed');
  }

  return response.json();
}

export const auth = {
  register: async (data: { email: string; password: string; name?: string }) => {
    const result = await fetchAPI('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    localStorage.setItem('token', result.token);
    return result;
  },

  login: async (data: { email: string; password: string }) => {
    const result = await fetchAPI('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    localStorage.setItem('token', result.token);
    return result;
  },

  logout: () => {
    localStorage.removeItem('token');
  },

  getProfile: () => fetchAPI('/auth/profile'),

  updateProfile: (data: { name?: string; favoriteGenres?: number[] }) =>
    fetchAPI('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

export const movies = {
  getTrending: () => fetchAPI('/movies/trending'),
  getPopular: () => fetchAPI('/movies/popular'),
  getTopRated: () => fetchAPI('/movies/top-rated'),
  search: (query: string) => fetchAPI(`/movies/search?q=${encodeURIComponent(query)}`),
  getByMood: (mood: string) => fetchAPI(`/movies/by-mood?mood=${encodeURIComponent(mood)}`),
  getRecommendations: () => fetchAPI('/movies/recommend'),
  getDetails: (id: number) => fetchAPI(`/movies/${id}`),
};

export const mood = {
  detect: (text: string) =>
    fetchAPI('/mood/detect', {
      method: 'POST',
      body: JSON.stringify({ text }),
    }),

  add: (moodValue: string) =>
    fetchAPI('/mood', {
      method: 'POST',
      body: JSON.stringify({ mood: moodValue }),
    }),

  getHistory: (limit = 10) => fetchAPI(`/mood/history?limit=${limit}`),
};

export const watchlist = {
  get: () => fetchAPI('/watchlist'),
  add: (movieId: number) =>
    fetchAPI('/watchlist', {
      method: 'POST',
      body: JSON.stringify({ movieId }),
    }),
  remove: (movieId: number) =>
    fetchAPI(`/watchlist/${movieId}`, {
      method: 'DELETE',
    }),
  check: (movieId: number) => fetchAPI(`/watchlist/check/${movieId}`),
};

export const ratings = {
  get: () => fetchAPI('/ratings'),
  add: (movieId: number, rating: number) =>
    fetchAPI('/ratings', {
      method: 'POST',
      body: JSON.stringify({ movieId, rating }),
    }),
  getForMovie: (movieId: number) => fetchAPI(`/ratings/${movieId}`),
};

export const genres = {
  getAll: () => fetchAPI('/genres'),
};