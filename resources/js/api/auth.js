const KEY = "token";

export const token = {
  get: () => localStorage.getItem(KEY),
  set: (t) => localStorage.setItem(KEY, t),
  clear: () => localStorage.removeItem(KEY),
};

async function api(path, { method = "GET", body } = {}) {
  const headers = { Accept: "application/json" };
  const t = token.get();
  if (t) headers.Authorization = `Bearer ${t}`;
  if (body) headers["Content-Type"] = "application/json";

  const res = await fetch(path, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `HTTP ${res.status}`);
  }

  return await res.json();
}

export const authApi = {
  login: (email, password) => api("/api/auth/login", { method: "POST", body: { email, password } }),
  me: () => api("/api/auth/me"),
  logout: () => api("/api/auth/logout", { method: "POST" }),
};

