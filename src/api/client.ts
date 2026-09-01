import axios from "axios";

import {
  clearSiteAccessToken,
  getSiteAccessToken,
  SITE_ACCESS_REQUIRED_EVENT,
} from "./siteAccessStorage";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000/api/v1";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach staff JWT (if present) for admin-only calls; public GETs work without it.
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("tahweel_access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  const siteAccessToken = getSiteAccessToken();
  if (siteAccessToken) {
    config.headers["X-Site-Access"] = siteAccessToken;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAccessFailure =
      error.response?.status === 403 && error.response?.data?.code === "site_access_required";

    if (isAccessFailure) {
      clearSiteAccessToken();
      window.dispatchEvent(new Event(SITE_ACCESS_REQUIRED_EVENT));
    }

    return Promise.reject(error);
  }
);
