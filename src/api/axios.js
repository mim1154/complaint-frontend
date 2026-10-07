import axios from "axios";

export const API_URL = "http://127.0.0.1:8002";

const api = axios.create({ baseURL: API_URL });

// প্রতিটা request-এ token জুড়ে দাও
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// 401 এলে refresh চেষ্টা করো, না হলে logout
let refreshing = null;

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    const isAuthCall = original.url?.includes("/auth/login") || original.url?.includes("/auth/refresh");

    if (error.response?.status === 401 && !original._retry && !isAuthCall) {
      original._retry = true;
      const refreshToken = localStorage.getItem("refresh_token");

      if (refreshToken) {
        try {
          if (!refreshing) {
            refreshing = axios
              .post(`${API_URL}/auth/refresh`, { refresh_token: refreshToken })
              .finally(() => (refreshing = null));
          }
          const { data } = await refreshing;
          localStorage.setItem("access_token", data.access_token);
          original.headers.Authorization = `Bearer ${data.access_token}`;
          return api(original);
        } catch {
          // refresh-ও ব্যর্থ, নিচে logout
        }
      }

      localStorage.clear();
      window.dispatchEvent(new Event("auth-expired"));
    }
    return Promise.reject(error);
  }
);

export default api;