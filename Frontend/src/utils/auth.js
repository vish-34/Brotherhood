// Backend base URL
export const API_URL = `${import.meta.env.VITE_API_URL}/api`;

/* =======================
   AUTH STORAGE
======================= */

/* Save auth data after login/signup */
export const saveAuth = ({ token, user }) => {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
};

/* Get JWT token */
export const getToken = () => {
  return localStorage.getItem("token");
};

/* Get logged-in user */
export const getUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

/* Check if user is authenticated */
export const isAuthenticated = () => {
  return !!getToken();
};

/* Logout user */
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

/* =======================
   AUTH FETCH HELPER
   (VERY IMPORTANT)
======================= */

/**
 * Automatically attaches JWT token
 * Usage:
 * authFetch("/user/me")
 */
export const authFetch = async (endpoint, options = {}) => {
  const token = getToken();

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  if (res.status === 401) {
    logout();
    throw new Error("Session expired. Please login again.");
  }

  return res.json();
};
