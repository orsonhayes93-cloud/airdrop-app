// src/lib/api.ts

// Base URL from environment variable
const API_BASE_URL = import.meta.env.VITE_API_URL as string;

if (!API_BASE_URL) {
  throw new Error(
    "VITE_API_URL is not defined. Make sure you have a .env file (for local) or Netlify environment variable (for production)."
  );
}

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
    // Try to parse the error from JSON, fallback to generic
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "API request failed");
  }

  return response.json();
}
