const FALLBACK_DEV_BACKEND = (() => {
  if (typeof window === "undefined") return "http://localhost:3003";
  const protocol = window.location.protocol;
  const host = window.location.hostname || "localhost";
  return `${protocol}//${host}:3003`;
})();

export const serverURL =
  (typeof __BACKEND_URL__ !== "undefined" && __BACKEND_URL__) ||
  (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_API_URL) ||
  FALLBACK_DEV_BACKEND;

export const getAuthHeaders = () => {
  const token = localStorage.getItem("JWT_AUTH_TOKEN");
  return token
    ? {
        "Content-type": "application/json; charset=UTF-8",
        Authorization: `Bearer ${token}`,
      }
    : { "Content-type": "application/json; charset=UTF-8" };
};

export const request = async (path, { method = "GET", body, headers = {}, raw = false } = {}) => {
  const opts = {
    method,
    headers: { ...getAuthHeaders(), ...headers },
  };
  if (body !== undefined) {
    if (body instanceof FormData) {
      const fdHeaders = { ...opts.headers };
      delete fdHeaders["Content-type"];
      opts.body = body;
      opts.headers = fdHeaders;
    } else {
      opts.body = JSON.stringify(body);
    }
  }

  const response = await fetch(`${serverURL}${path}`, opts);
  const isJson = response.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await response.json().catch(() => null) : await response.text();

  if (!response.ok) {
    const error = new Error(
      (data && (data.error?.message || data.error || data.message)) || `Request failed: ${response.status}`
    );
    error.status = response.status;
    error.data = data;
    throw error;
  }
  return raw ? response : data;
};

export const profilePictureUrl = (id) => (id ? `${serverURL}/user/profilePicture/${id}` : null);
export const postImageUrl = (id) => (id ? `${serverURL}/post/image/${id}` : null);

export const debounce = (fn, delay = 300) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};
