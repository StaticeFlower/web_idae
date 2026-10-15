import { API_BASE_URL } from "./config";
import { getToken } from "./auth-storage";

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

type HttpOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  query?: Record<string, string | number | undefined | null>;
};

/** fetch wrapper สำหรับ API จริง: แนบ token, แปลง JSON, โยน ApiError เมื่อ response ไม่ ok */
export async function http<T>(path: string, options: HttpOptions = {}): Promise<T> {
  const { body, query, headers, ...rest } = options;

  const qs = query
    ? Object.entries(query)
        .filter(([, v]) => v !== undefined && v !== null && v !== "")
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
        .join("&")
    : "";
  const url = `${API_BASE_URL}${path}${qs ? `?${qs}` : ""}`;

  const token = getToken();
  const res = await fetch(url, {
    ...rest,
    headers: {
      Accept: "application/json",
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    let message = `เกิดข้อผิดพลาด (${res.status})`;
    try {
      const data = await res.json();
      if (data && typeof data.message === "string") message = data.message;
    } catch {
      /* body ไม่ใช่ JSON */
    }
    throw new ApiError(res.status, message);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}
