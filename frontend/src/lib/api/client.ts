const BASE = "/api"

function getToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("token")
}

export async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken()
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  }

  if (token) headers["Authorization"] = `Bearer ${token}`

  const res = await fetch(`${BASE}${path}`, { ...options, headers })

  if (res.status === 401) {
    if (path === "/auth/login" || path === "/auth/register") {
      const body = await res.json().catch(() => ({ error: "Unauthorized" }))
      throw new Error((body as { error: string }).error)
    }
    localStorage.removeItem("token")
    window.location.href = "/login"
    throw new Error("Unauthorized")
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: "Request failed" }))
    throw new Error((body as { error: string }).error)
  }

  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}