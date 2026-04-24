import axios from "axios";

const apiClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}`,
  withCredentials: true,
});

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
    const role = localStorage.getItem("role")
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const endpoint = role === "center" ? "auth/refresh-token" : 'teachers/refresh-token'
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/${endpoint}`,
          {},
          { withCredentials: true },
        );

        const newAccessToken = res.data.accessToken;

        localStorage.setItem("access_token", newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return apiClient(originalRequest);
      } catch (err) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("role");
        localStorage.removeItem("id");
        window.location.href = "/";
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
