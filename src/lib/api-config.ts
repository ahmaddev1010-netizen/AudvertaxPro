export const API_CONFIG = {
  baseUrl:
    process.env.NEXT_PUBLIC_API_URL && process.env.NEXT_PUBLIC_API_URL.trim().length > 0
      ? process.env.NEXT_PUBLIC_API_URL.trim().replace(/\/+$/, "")
      : "http://localhost:5001",
};

export function getApiBaseUrl() {
  return API_CONFIG.baseUrl;
}
