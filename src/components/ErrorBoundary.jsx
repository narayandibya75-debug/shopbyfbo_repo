import React from "react";

const RELOAD_FLAG_KEY = "ff-chunk-reload-attempted";

/**
 * Detects the specific failure mode where a lazy-loaded route chunk
 * (React.lazy(() => import(...))) 404s because the browser is still running
 * an older index.html/main.js that references chunk filenames from a
 * previous deploy which Vercel has since replaced. This is extremely common
 * in code-split apps and shows up as a generic-looking crash unless handled
 * explicitly - the fix is a one-time hard reload to fetch the current build.
 */
function isChunkLoadError(error) {
  if (!error) return false;
  const msg = String(error.message || error);
  return (
    error.name === "ChunkLoadError" ||
    /loading chunk .* failed/i.test(msg) ||
    /loading css chunk .* failed/i.test(msg) ||
    /failed to fetch dynamically imported module/i.test(msg)
  );
}

/**
 * Top-level error boundary.
 * Prevents a single component crash from taking down the whole app
 * (a blank white screen), and gives the user a way to recover.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Hook point for an error-reporting service (Sentry, LogRocket, etc.)
    // Kept as console.error only — no PII, no silent swallowing.
    console.error("Unhandled UI error:", error, errorInfo);

    if (isChunkLoadError(error)) {
      // Only auto-reload once per browser session, so a *genuinely* broken
      // chunk (rather than a stale one) doesn't reload-loop forever.
      const alreadyTried = sessionStorage.getItem(RELOAD_FLAG_KEY);
      if (!alreadyTried) {
        sessionStorage.setItem(RELOAD_FLAG_KEY, "1");
        console.warn("Stale chunk detected — reloading to fetch the current build.");
        window.location.reload();
      }
    }
  }

  handleReload = () => {
    sessionStorage.removeItem(RELOAD_FLAG_KEY);
    this.setState({ hasError: false, error: null });
    window.location.assign("/");
  };

  render() {
    if (this.state.hasError) {
      // First time we've seen a chunk-load error this session: componentDidCatch
      // just triggered a reload, so show a spinner instead of a dead-end screen
      // while that reload happens. If we're seeing it again after already having
      // reloaded once (flag already set), stop looping and show the real error.
      if (isChunkLoadError(this.state.error) && !sessionStorage.getItem(RELOAD_FLAG_KEY)) {
        return (
          <div className="min-h-screen flex items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        );
      }

      return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 py-24">
          <h1 className="text-2xl font-semibold mb-2">Something went wrong</h1>
          <p className="text-muted-foreground mb-6 max-w-md">
            We hit an unexpected error loading this page. Please try again, and
            contact us if the problem keeps happening.
          </p>
          <button
            onClick={this.handleReload}
            className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-5 py-2.5 text-sm font-medium hover:opacity-90 transition"
          >
            Back to Home
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
