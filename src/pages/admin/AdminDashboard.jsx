import SEO from "../../components/SEO";
import React, { useEffect, useState } from "react";
import { api, INR } from "../../lib/api";
import { Package, AlertCircle, XCircle, ShoppingCart, IndianRupee, BarChart3, RefreshCw } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchStats = () => {
    setLoading(true);
    setError(false);
    api.get("/admin/stats")
      .then((r) => {
        setStats(r.data);
        setLoading(false);
      })
      .catch(() => {
        setStats(null);
        setError(true);
        setLoading(false);
      });
  };

  useEffect(() => { 
    fetchStats();
  }, []);

  const cards = stats ? [
    { label: "Active products", value: stats.active_products, icon: Package, color: "text-green-700 bg-green-50" },
    { label: "Out of stock", value: stats.out_of_stock, icon: AlertCircle, color: "text-yellow-700 bg-yellow-50" },
    { label: "Discontinued", value: stats.discontinued, icon: XCircle, color: "text-stone-700 bg-stone-100" },
    { label: "Total orders", value: stats.total_orders, icon: ShoppingCart, color: "text-blue-700 bg-blue-50" },
    { label: "Awaiting verification", value: stats.awaiting_verification ?? 0, icon: AlertCircle, color: "text-yellow-700 bg-yellow-50" },
    { label: "Revenue", value: INR(stats.total_revenue), icon: IndianRupee, color: "text-primary bg-primary/10" },
    { label: "Total BV / CC", value: `${(stats.total_bv || 0).toFixed(2)} / ${(stats.total_cc || 0).toFixed(3)}`, icon: BarChart3, color: "text-secondary bg-secondary/10" },
  ] : [];

  return (
    <>
    <SEO 
      title="Storefront Administrative Root Dashboard" 
      url="/admin" 
      robots="noindex, nofollow" 
    />
    <div data-testid="admin-dashboard">
      <h1 className="font-heading font-bold text-3xl">Dashboard</h1>
      <p className="text-sm text-muted-foreground mt-1">Overview of your independent distributor metrics</p>

      {/* ERROR STATE */}
      {error && (
        <div className="mt-8 p-6 rounded-2xl border border-destructive/20 bg-destructive/5 flex flex-col items-center justify-center text-center gap-3">
          <AlertCircle className="h-8 w-8 text-destructive" />
          <div>
            <h3 className="font-medium text-destructive">Failed to load metrics</h3>
            <p className="text-sm text-muted-foreground mt-0.5">Please check your network connection and try again.</p>
          </div>
          <button 
            onClick={fetchStats}
            className="mt-2 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-white border border-border rounded-xl shadow-xs hover:bg-muted/50 transition-colors"
          >
            <RefreshCw className="h-4 w-4" /> Retry
          </button>
        </div>
      )}

      {/* METRICS GRID */}
      {!error && (
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* LOADING SKELETONS */}
          {loading && Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="p-5 rounded-2xl bg-white border border-border/60 shadow-sm animate-pulse">
              <div className="h-10 w-10 rounded-full bg-muted/60" />
              <div className="h-3 bg-muted/60 rounded-sm w-24 mt-4" />
              <div className="h-6 bg-muted/80 rounded-md w-16 mt-2" />
            </div>
          ))}

          {/* ACTIVE CARDS */}
          {!loading && cards.map((c) => {
            const safeTestId = `stat-${c.label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
            return (
              <div key={c.label} className="p-5 rounded-2xl bg-white border border-border/60 shadow-sm">
                <div className={`h-10 w-10 rounded-full grid place-items-center ${c.color}`}>
                  <c.icon className="h-5 w-5" />
                </div>
                <div className="mt-3 text-xs text-muted-foreground">{c.label}</div>
                <div className="font-heading font-bold text-2xl mt-1" data-testid={safeTestId}>{c.value}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
    </>
  );
}
