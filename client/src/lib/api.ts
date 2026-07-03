import type { User } from "@/features/auth/types/Auth";
import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";

export interface ApiError {
  detail: string;
  error: string;
  status: number;
}

const API_URL = import.meta.env.VITE_API_URL;

export const api = axios.create({
  baseURL: API_URL,
});

let logoutCallback: () => void | null;

export const setLogoutCallback = (cb: () => void) => {
  logoutCallback = cb;
};

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (config.headers) {
    config.headers.Accept = "application/json";
  }
  config.withCredentials = true;
  const savedUser = localStorage.getItem("user");
  if (savedUser) {
    const user: User = JSON.parse(savedUser);
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError<ApiError>) => {
    if (error.response?.status === 401) {
      // console.log("Error 401: Unauthorized token. Clearing local storage token")
      logoutCallback();
    }
    console.log(error);
    const normalizedError = {
      message: error.response?.data?.detail ?? "Unknown error",
      error: error.response?.data?.error ?? "UNKNOWN_ERROR",
      status: error.response?.status,
    };

    return Promise.reject(normalizedError);
  },
);
