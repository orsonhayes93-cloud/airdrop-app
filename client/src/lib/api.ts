// API configuration - automatically uses Cloudflare backend URL when deployed
const API_BASE_URL = import.meta.env.VITE_API_URL || window.location.origin;

export async function apiCall(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || "API request failed");
  }
  
  return response.json();
}
