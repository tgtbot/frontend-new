import { default as axiosLib } from "axios";
import { QueryClient, QueryCache } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: console.error,
  }),
  defaultOptions: {
    queries: {
      retry: 1,
    },
  },
});

export const axios = axiosLib.create({
  baseURL: "https://backend-rebuild-production.up.railway.app",
  headers: { "Content-Type": "application/json" },
});

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token && !config.url?.startsWith("/auth")) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }

  return config;
});

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      console.log("401", error.response);
      // localStorage.removeItem("token");
      // localStorage.removeItem("userName");
      // window.location.href = "/login?redirect=" + window.location.pathname;
    }
    return Promise.reject(error);
  }
);
