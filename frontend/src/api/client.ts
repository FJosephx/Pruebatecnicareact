const API_URL = import.meta.env.VITE_API_URL as string | undefined;

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export const apiFetch = async <T>(path: string, init?: RequestInit): Promise<T> => {
  if (!API_URL) {
    throw new Error("VITE_API_URL is not set");
  }

  const headers = {
    "Content-Type": "application/json",
    ...(init?.headers ?? {})
  };

  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers
  });

  if (!response.ok) {
    throw new ApiError(`Request failed with ${response.status}`, response.status);
  }

  return (await response.json()) as T;
};
