import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { toast } from "sonner";
import { Leaf, Loader2 } from "lucide-react";
import { formatApiErrorDetail } from "../lib/api";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import SEO from "../components/SEO";

export default function Register() {
  const { register, googleLogin } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      toast.success("Account created — welcome!");
      navigate("/", { replace: true });
    } catch (err) {
      toast.error(
        formatApiErrorDetail(err?.response?.data?.detail) || err.message
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      await googleLogin(decoded.email, decoded.name, decoded.picture || "");
      toast.success("Signed in with Google!");
      navigate("/", { replace: true });
    } catch (err) {
      console.error(err);
      toast.error(
        formatApiErrorDetail(err?.response?.data?.detail) || "Google login failed"
      );
    }
  };

  return (
    <>
    <SEO
      title="Create Your Member Account | Authorized FBO Retail Hub"
      description="Register an account securely to save shipping addresses, trace transaction logs, and communicate directly with your regional independent business advisor."
      keywords="register user portal, secure storefront account, independent member registration"
      url="/register"
    />
    <div className="min-h-[calc(100vh-5rem)] grid lg:grid-cols-2">
      {/* LEFT SIDE FORM */}
      <div className="flex items-center justify-center p-6 sm:p-10 order-2 lg:order-1">
        <div className="w-full max-w-md" data-testid="register-form">
          <div className="flex items-center gap-2 mb-8">
            <span className="h-9 w-9 rounded-full bg-primary text-primary-foreground grid place-items-center">
              <Leaf className="h-5 w-5" />
            </span>
            <span className="font-heading text-primary font-semibold">Independent FBO Hub</span>
          </div>

          <h1 className="font-heading text-3xl font-bold">Create your account</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Join our independent wellness network today.
          </p>

          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            <div>
              <Label className="mb-1.5 block text-xs">Full name</Label>
              <Input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                data-testid="register-name"
              />
            </div>
            <div>
              <Label className="mb-1.5 block text-xs">Email</Label>
              <Input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                data-testid="register-email"
              />
            </div>
            <div>
              <Label className="mb-1.5 block text-xs">Password (min 6)</Label>
              <Input
                type="password"
                required
                minLength={6}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                data-testid="register-password"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
              data-testid="register-submit"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Creating…
                </>
              ) : (
                "Create account"
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
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-primary hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>

      {/* RIGHT SIDE IMAGE */}
      <div className="hidden lg:block relative order-1 lg:order-2">
        <img
          src="https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=1600"
          alt="Clean geometric vanity items container showcase"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/50 via-primary/50 to-primary" />
        <div className="relative h-full p-12 flex flex-col justify-end text-white">
          <h2 className="font-heading text-4xl font-bold leading-tight max-w-sm">
            Access streamlined ordering benefits.
          </h2>
          <p className="mt-3 text-white/80 max-w-sm">
            Faster checkout parameters, simplified transaction lookup, and direct distribution updates.
          </p>
        </div>
      </div>
    </div>
    </>
  );
}
