import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { toast } from "sonner";
import { Leaf, Loader2 } from "lucide-react";
import { formatApiErrorDetail } from "../lib/api";
import { GoogleLogin } from "@react-oauth/google";
import SEO from "../components/SEO";

export default function Login() {
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();
  const [sp] = useSearchParams();
  const redirect = sp.get("redirect") || "/";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Welcome back!");
      navigate(redirect, { replace: true });
    } catch (err) {
      toast.error(formatApiErrorDetail(err?.response?.data?.detail) || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      // Send the raw ID token to the backend and let it verify the token
      // with Google. Never trust client-decoded JWT claims for auth - they
      // aren't proof of anything since anyone can construct a similar-looking
      // payload without the signed token.
      await googleLogin(credentialResponse.credential);
      toast.success("Signed in with Google!");
      navigate(redirect, { replace: true });
    } catch (err) {
      console.error(err);
      toast.error(formatApiErrorDetail(err?.response?.data?.detail) || "Google login failed");
    }
  };

  return (
    <>
    <SEO
      title="Secure Member Access | Authorized Distributor Portal"
      description="Access your independent profile securely. Review dispatch tracking updates, personal logs, and manage session checkouts cleanly."
      keywords="secure user portal, profile authentication gateway, distributor dashboard access"
      url="/login"
    />
    <div className="min-h-[calc(100vh-5rem)] grid lg:grid-cols-2">
      <div className="hidden lg:block relative">
        <img
          src="https://unsplash.com"
          alt="Natural green botanical growth closeup"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/70 via-primary/40 to-secondary/30" />
        <div className="relative h-full p-12 flex flex-col justify-end text-white">
          <div className="flex items-center gap-2 mb-5">
            <span className="h-10 w-10 rounded-full bg-white/20 grid place-items-center">
              <Leaf className="h-5 w-5" />
            </span>
            <span className="font-heading text-xl">Independent FBO Hub</span>
          </div>
          <h2 className="font-heading text-4xl font-bold leading-tight max-w-sm">
            Pure plant power, curated by your independent partner.
          </h2>
          <p className="mt-3 text-white/80 max-w-sm">
            Log in to continue shopping, verify active transactions, and oversee personal delivery records.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md" data-testid="login-form">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <span className="h-9 w-9 rounded-full bg-primary text-primary-foreground grid place-items-center">
              <Leaf className="h-5 w-5" />
            </span>
            <span className="font-heading text-primary font-semibold">Independent FBO Hub</span>
          </div>
          <h1 className="font-heading text-3xl font-bold">Welcome back</h1>
          <p className="text-sm text-muted-foreground mt-1">Login to your account to continue</p>

          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            <div>
              <Label className="mb-1.5 block text-xs">Email</Label>
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                data-testid="login-email"
              />
            </div>
            <div>
              <Label className="mb-1.5 block text-xs">Password</Label>
              <Input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                data-testid="login-password"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
              data-testid="login-submit"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Logging in…
                </>
              ) : (
                "Login"
              )}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
            <div className="h-px bg-border flex-1" />
            or continue with
            <div className="h-px bg-border flex-1" />
          </div>

          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => toast.error("Google Login Failed")}
            />
          </div>

          <p className="mt-8 text-sm text-center text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-primary hover:underline"
              data-testid="register-link"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
    </>
  );
}
