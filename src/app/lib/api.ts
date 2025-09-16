const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export const post = async (path: string, data: unknown, token?: string) => {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify(data)
    });
    
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }
    
    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await res.text();
      throw new Error(`Expected JSON response, got: ${text.substring(0, 100)}...`);
    }
    
    return await res.json();
  } catch (error) {
    console.error(`API POST error for ${path}:`, error);
    throw error;
  }
};

export const put = async (path: string, data: unknown, token?: string) => {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify(data)
    });
    
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }
    
    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await res.text();
      throw new Error(`Expected JSON response, got: ${text.substring(0, 100)}...`);
    }
    
    return await res.json();
  } catch (error) {
    console.error(`API PUT error for ${path}:`, error);
    throw error;
  }
};

export const get = async (path: string, token?: string) => {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }
    
    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await res.text();
      throw new Error(`Expected JSON response, got: ${text.substring(0, 100)}...`);
    }
    
    return await res.json();
  } catch (error) {
    console.error(`API GET error for ${path}:`, error);
    throw error;
  }
};
