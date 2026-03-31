// src/lib/api.ts
// Same origin now — frontend and API are both served by Next.js on port 3000.
// baseURL is a relative path so no CORS, no port juggling, no withCredentials needed
// for cross-origin (though keeping it doesn't hurt).
import axios from "axios";

const api = axios.create({
  baseURL:         "/api",
  withCredentials: true,
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && typeof window !== "undefined") {
      if (!window.location.pathname.includes("/auth")) {
        window.location.href = "/auth/login";
      }
    }
    return Promise.reject(err);
  }
);

export default api;
