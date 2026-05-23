const BASE_URL =
  (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, "") ||
  "http://localhost:8000";

export type ApiError = { status: number; detail: string };

async function request<T>(
  path: string,
  init: RequestInit & { token?: string | null } = {},
): Promise<T> {
  const { token, headers, ...rest } = init;
  const res = await fetch(`${BASE_URL}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(headers || {}),
    },
  });
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) {
    const err: ApiError = {
      status: res.status,
      detail: (data && (data.detail || data.message)) || res.statusText,
    };
    throw err;
  }
  return data as T;
}

export type AuthResponse = {
  access_token: string;
  token_type: string;
  user: {
    id: string;
    email: string;
    full_name: string;
  };
};

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  plan_type: "Free" | "Premium" | "Ultra";
  generations_used: number;
  max_generations: number;
};

export type Generation = {
  id: string;
  user_id: string;
  original_prompt: string;
  final_prompt: string;
  image_url: string;
  image_size: string;
  style: string;
  mood: string;
  created_at: string;
};

export const api = {
  signup: (body: {
    email: string;
    password: string;
  }) =>
    request<AuthResponse>("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  login: (body: { email: string; password: string }) =>
    request<AuthResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  me: (token: string) =>
    request<Profile>("/api/users/me", { method: "GET", token }),

  generate: (
    token: string,
    body: {
      prompt: string;
      style?: string;
      mood?: string;
      width?: number;
      height?: number;
    },
  ) =>
    request<Generation>("/api/emoji/generate", {
      method: "POST",
      token,
      body: JSON.stringify(body),
    }),

  history: (token: string) =>
    request<{ generations: Generation[] }>("/api/emoji/history", {
      method: "GET",
      token,
    }),
};
