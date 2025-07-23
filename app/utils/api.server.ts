import { getSession, logout } from "./auth.server";
import { env } from "./env.server";

type ApiFetchOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  data?: FormData | Record<string, any>;
};

if (!env.apiUrl) {
  throw new Error("API_URL must be set in environment variables.");
}

export async function apiFetch(
  request: Request,
  url: string,
  options: ApiFetchOptions = {}
): Promise<{ error?: string; data?: any } | Response> {
  try {
    const session = await getSession(request);
    const token = session.get("token");

    const { method = "GET", data } = options;

    const isFormData =
      typeof FormData !== "undefined" && data instanceof FormData;

    const headers: HeadersInit = {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      Authorization: `Bearer ${token ?? ""}`,
    };

    const res = await fetch(env.apiUrl + url, {
      method,
      headers,
      body: data ? (isFormData ? data : JSON.stringify(data)) : undefined,
    });

    const contentType = res.headers.get("content-type");
    const isJson = contentType?.includes("application/json");

    const responseBody = isJson ? await res.json() : await res.text();

    // 🔐 Handle 401 or 403
    if (res.status === 401 || res.status === 403) {
      return logout(request, "/auth/login");
    }

    if (!res.ok) {
      const message =
        typeof responseBody === "string"
          ? responseBody
          : responseBody.message || "API request failed";

      return { error: message };
    }

    return { data: responseBody.data };
  } catch (err: any) {
    return { error: err.message || "Something went wrong" };
  }
}
