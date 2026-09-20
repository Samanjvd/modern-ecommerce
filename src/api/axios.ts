import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:5000/api',

  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

let refreshing = false;

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!refreshing) {
        refreshing = true;

        try {
          const response = await api.post('/auth/refresh');

          const token = response.data.accessToken;

          localStorage.setItem('accessToken', token);

          originalRequest.headers.Authorization = `Bearer ${token}`;

          return api(originalRequest);
        } finally {
          refreshing = false;
        }
      }
    }

    return Promise.reject(error);
  },
);
