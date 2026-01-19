export async function apiGet(path) {
  const res = await fetch(path, {
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status}: ${text || "Request failed"}`);
  }

  return await res.json();
}

