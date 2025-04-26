import axios from "axios";
import SummaryApi, { API_BASE_URL } from "@/api/Userauth";

const Axios = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Ensure cookies are included (for session-based authentication)
});

// ✅ Attach access token to every request
Axios.interceptors.request.use(
  async (config) => {
    const accessToken = localStorage.getItem("accessToken"); // ✅ Fixed casing

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response interceptor to handle token expiration (401 errors)
Axios.interceptors.response.use(
  (response) => response, // Return successful responses
  async (error) => {
    const originalRequest = error.config;

    // If the token expired and request hasn't been retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        const newAccessToken = await refreshAccessToken(refreshToken);

        if (newAccessToken) {
          // ✅ Attach new token and retry the failed request
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return Axios(originalRequest);
        }
      }

      // ❌ If refresh fails, logout user
      logoutUser();
    }

    return Promise.reject(error);
  }
);

// ✅ Refresh Access Token
const refreshAccessToken = async (refreshToken: string): Promise<string | null> => {
  try {
    const response = await Axios({
      ...SummaryApi.auth.refreshToken,
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    });

    const newAccessToken = response.data?.accessToken;
    if (newAccessToken) {
      localStorage.setItem("accessToken", newAccessToken);
      return newAccessToken;
    }
  } catch (error) {
    console.error("Token refresh failed:", error);
  }

  return null;
};


// ✅ Logout user (clears tokens and redirects to login)
const logoutUser = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  window.location.href = "/"; // Changed from "/Login-Page" to "/"
  window.location.reload(); // Ensure complete state reset
};

export default Axios;
