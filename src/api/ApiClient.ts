import axios from "axios";

const apiClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}`,
  withCredentials: true,
});

// Request interceptor
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/refresh-token`,
          {},
          { withCredentials: true },
        );

        const newAccessToken = res.data.accessToken;

        localStorage.setItem("access_token", newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return apiClient(originalRequest);
      } catch (err) {
        localStorage.removeItem("access_token");
        window.location.href = "/sign-in";
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
