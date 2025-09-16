const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export const post = async (path: string, data: unknown, token?: string) => {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify(data)
  });
  return res.json();
};

export const put = async (path: string, data: unknown, token?: string) => {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify(data)
  });
  return res.json();
};

export const get = async (path: string, token?: string) => {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  });
  return res.json();
};
