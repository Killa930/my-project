export async function apiGet(path) {
  const base = import.meta.env.VITE_API_URL;
  const res = await fetch(`${base}${path}`, {
    method: "GET",
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status}: ${text || "Request failed"}`);
  }

  return await res.json();
}
