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

// Requests that must never trigger a refresh-and-retry themselves, or we'd
// loop forever (a 401 from /auth/refresh means the session is genuinely
// dead, not a signal to call /auth/refresh again).
const NO_REFRESH_PATHS = ["/auth/refresh", "/auth/login", "/auth/register", "/auth/google-login"];

let isRefreshing = false;
let pendingQueue = []; // { resolve, reject, config } for requests waiting on an in-flight refresh

function isAuthPath(url = "") {
  return NO_REFRESH_PATHS.some((p) => url.includes(p));
}

/**
 * Dispatched when the session is confirmed dead (refresh itself failed).
 * AuthContext listens for this to clear its user state and let the existing
 * ProtectedRoute/AdminRoute components redirect to /login declaratively -
 * api.js has no router access and shouldn't need any.
 */
function announceLoggedOut() {
  localStorage.removeItem("token");
  delete api.defaults.headers.common["Authorization"];
  window.dispatchEvent(new Event("auth:logged-out"));
}

async function refreshAccessToken() {
  // Deliberately not using the shared `api` instance's interceptors here -
  // a plain axios call avoids recursing back into this same interceptor.
  const { data } = await axios.post(
    `${API}/auth/refresh`,
    {},
    { withCredentials: true, timeout: NORMAL_TIMEOUT }
  );
  localStorage.setItem("token", data.access_token);
  api.defaults.headers.common["Authorization"] = `Bearer ${data.access_token}`;
  return data.access_token;
}

// - 401 on a normal request: the access token (15 min lifetime) has expired.
//   Attempt ONE silent background refresh using the refresh-token cookie; on
//   success, retry the original request transparently (user never sees this
//   happen: no login screen, no error, admin actions just keep working). If
//   several requests 401 around the same time, only one refresh call is made
//   and the rest wait on it.
// - 401 on /auth/refresh itself (or /auth/login etc.): the session is
//   genuinely dead (refresh token expired/revoked, or bad credentials) -
//   clear everything and let the UI react via the auth:logged-out event.
// - No response at all (timeout / connection failure): retry once with a
//   much longer timeout, since Render's free tier cold-starts after ~15 min
//   idle and a normal request timeout is far shorter than that wake-up time.
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;

    if (error.response?.status === 401 && config) {
      if (isAuthPath(config.url)) {
        announceLoggedOut();
        return Promise.reject(error);
      }

      if (config._retriedAfterRefresh) {
        // Already retried once post-refresh and still 401 - refresh token
        // itself must be invalid. Stop here instead of looping.
        announceLoggedOut();
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // A refresh is already in flight - queue this request behind it
        // instead of firing a second /auth/refresh call.
        return new Promise((resolve, reject) => {
          pendingQueue.push({ resolve, reject, config });
        });
      }

      isRefreshing = true;
      try {
        await refreshAccessToken();
        isRefreshing = false;

        const queued = pendingQueue;
        pendingQueue = [];
        queued.forEach(({ resolve, reject, config: qConfig }) => {
          qConfig._retriedAfterRefresh = true;
          api(qConfig).then(resolve).catch(reject);
        });

        config._retriedAfterRefresh = true;
        return api(config);
      } catch (refreshError) {
        isRefreshing = false;

        const queued = pendingQueue;
        pendingQueue = [];
        queued.forEach(({ reject }) => reject(refreshError));

        announceLoggedOut();
        return Promise.reject(error);
      }
    }

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
