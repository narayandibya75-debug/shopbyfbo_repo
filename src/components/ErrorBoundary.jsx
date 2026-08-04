import React from "react";

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
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.assign("/");
  };

  render() {
    if (this.state.hasError) {
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
