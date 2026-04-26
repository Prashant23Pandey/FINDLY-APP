const API = "/api";

const getToken = () =>
  typeof window !== "undefined" ? localStorage.getItem("findly_token") : null;

const authHeaders = () => ({
  "Content-Type": "application/json",
  "Bypass-Tunnel-Reminder": "true",
  ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
});

export const apiGet = async (path: string) => {
  const res = await fetch(`${API}${path}`, { headers: authHeaders() });
  return res.json();
};

export const apiPost = async (path: string, body: object) => {
  const res = await fetch(`${API}${path}`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(body),
  });
  return { ok: res.ok, data: await res.json() };
};

export const apiPatch = async (path: string, body?: object) => {
  const res = await fetch(`${API}${path}`, {
    method: "PATCH",
    headers: authHeaders(),
    body: body ? JSON.stringify(body) : undefined,
  });
  return { ok: res.ok, data: await res.json() };
};

export const apiDelete = async (path: string) => {
  const res = await fetch(`${API}${path}`, { method: "DELETE", headers: authHeaders() });
  return { ok: res.ok, data: await res.json() };
};
