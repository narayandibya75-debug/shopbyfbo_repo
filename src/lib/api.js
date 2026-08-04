import axios from "axios";

const BACKEND_URL =
  process.env.REACT_APP_BACKEND_URL || "https://shopbyfbo-repo.onrender.com";

export const API = `${BACKEND_URL}/api`;

export const api = axios.create({
  baseURL: API,
  withCredentials: true,
  timeout: 15000,
});

// Restore token on page refresh
const token = localStorage.getItem("token");
if (token) {
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

// Auto-clear token on 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      delete api.defaults.headers.common["Authorization"];
    }
    return Promise.reject(error);
  }
);

export function formatApiErrorDetail(detail) {
  if (detail == null) return "Something went wrong.";
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) {
    return detail
      .map((e) => (e && typeof e.msg === "string" ? e.msg : JSON.stringify(e)))
      .join(" ");
  }
  if (detail && typeof detail.msg === "string") return detail.msg;
  return String(detail);
}

/**
 * Resolves a product image URL.
 * - If the image is a full URL (http/https) → use as-is
 * - If it starts with /uploads/ → prefix with BACKEND_URL (local upload)
 * - Otherwise → fallback placeholder
 */
export function productImage(images) {
  const first = (images && images[0]) || "";
  if (!first) {
    return "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=800";
  }
  if (first.startsWith("http")) return first;
  if (first.startsWith("/uploads/")) return `${BACKEND_URL}${first}`;
  return `${BACKEND_URL}/uploads/${first}`;
}

export const INR = (n) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n || 0);

/**
 * List endpoints (/products, /orders, /admin/products, /admin/orders) return
 * a paginated envelope: { items, total, limit, skip, has_more }, not a bare
 * array. This normalizes either shape so callers can safely .map()/.length
 * the result without crashing if the API contract shifts.
 */
export function unwrapList(data) {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.items)) return data.items;
  return [];
}
