import axios from "axios";
import { toast } from "sonner";

const BACKEND_URL =
  process.env.REACT_APP_BACKEND_URL || "https://shopverse-1-la3b.onrender.com";

export const API = `${BACKEND_URL}/api`;

// Render's free tier spins the backend down after ~15 min of inactivity.
// The next request has to "cold start" it back up, which commonly takes
// 30-60s. A normal request timeout is far shorter than that, so the first
// request after any idle period looks exactly like a dead server / CORS
// failure in the browser (net::ERR_FAILED, no CORS header on the response,
// because there IS no response yet). NORMAL_TIMEOUT keeps everyday requests
// snappy; COLD_START_TIMEOUT is only used for the one-time retry below.
const NORMAL_TIMEOUT = 15000;
const COLD_START_TIMEOUT = 60000;

export const api = axios.create({
  baseURL: API,
  withCredentials: true,
  timeout: NORMAL_TIMEOUT,
});

// Restore token on page refresh
const token = localStorage.getItem("token");
if (token) {
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

let wakingToastShown = false;

// Auto-clear token on 401, and retry once with a much longer timeout if the
// request never got a response at all (timeout, or a connection-level
// failure that surfaces as a CORS error with no Access-Control headers).
// This does NOT retry on requests that got a real response (4xx/5xx) - only
// on the "nothing came back" case, which is the cold-start signature.
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      delete api.defaults.headers.common["Authorization"];
      return Promise.reject(error);
    }

    const config = error.config;
    const looksLikeNoResponse =
      !error.response && (error.code === "ECONNABORTED" || error.message === "Network Error");

    if (config && looksLikeNoResponse && !config._coldStartRetry) {
      config._coldStartRetry = true;
      config.timeout = COLD_START_TIMEOUT;

      if (!wakingToastShown) {
        wakingToastShown = true;
        toast.info("Waking up the server — this can take up to a minute after inactivity.");
        setTimeout(() => { wakingToastShown = false; }, COLD_START_TIMEOUT);
      }

      return api(config);
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
