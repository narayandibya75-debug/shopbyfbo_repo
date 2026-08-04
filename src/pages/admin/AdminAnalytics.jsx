import React, { useEffect, useState } from "react";
import { api } from "../../lib/api";
import SEO from "../../components/SEO";
import { toast } from "sonner";
import {
  Users, Eye, MousePointerClick, Monitor, Smartphone,
  Globe, TrendingUp, RefreshCw, Loader2, Tablet, Search,
  Share2, Link2
} from "lucide-react";

const PLATFORM_CONFIG = {
  instagram:  { color: "bg-pink-500",   light: "bg-pink-50 text-pink-700",     label: "Instagram" },
  facebook:   { color: "bg-blue-600",   light: "bg-blue-50 text-blue-700",     label: "Facebook" },
  whatsapp:   { color: "bg-green-500",  light: "bg-green-50 text-green-700",   label: "WhatsApp" },
  linkedin:   { color: "bg-blue-700",   light: "bg-blue-50 text-blue-800",     label: "LinkedIn" },
  twitter:    { color: "bg-sky-500",    light: "bg-sky-50 text-sky-700",       label: "Twitter / X" },
  youtube:    { color: "bg-red-500",    light: "bg-red-50 text-red-700",       label: "YouTube" },
  telegram:   { color: "bg-cyan-500",   light: "bg-cyan-50 text-cyan-700",     label: "Telegram" },
  threads:    { color: "bg-gray-800",   light: "bg-gray-100 text-gray-800",    label: "Threads" },
  pinterest:  { color: "bg-red-600",    light: "bg-red-50 text-red-700",       label: "Pinterest" },
  snapchat:   { color: "bg-yellow-400", light: "bg-yellow-50 text-yellow-700", label: "Snapchat" },
  google:     { color: "bg-yellow-500", light: "bg-yellow-50 text-yellow-700", label: "Google" },
  other:      { color: "bg-primary",    light: "bg-primary/10 text-primary",   label: "Other" },
};

const PLATFORM_EMOJIS = {
  instagram: "📸", facebook: "👥", whatsapp: "💬", linkedin: "💼",
  twitter: "🐦", youtube: "▶️", telegram: "✈️", threads: "🧵",
  pinterest: "📌", snapchat: "👻", google: "🔍", other: "🔗",
};

export default function AdminAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const { data: d } = await api.get("/admin/analytics");
      setData(d);
    } catch (e) {
      toast.error("Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  if (loading) return (
    <div className="flex items-center justify-center py-24" data-testid="admin-analytics-loading">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );

  if (!data) return null;

  // Safely access nested data with fallbacks
  const safeData = {
    total_visits: data?.total_visits || 0,
    unique_visitors: data?.unique_visitors || 0,
    today_visits: data?.today_visits || 0,
    top_pages: data?.top_pages || [],
    devices: data?.devices || [],
    browsers: data?.browsers || [],
    os_list: data?.os_list || [],
    referrers: data?.referrers || [],
    top_clicks: data?.top_clicks || [],
    daily: data?.daily || [],
    utm_sources: (data?.utm_sources || []).filter(d => d?.source),
    utm_campaigns: data?.utm_campaigns || [],
    recent: data?.recent || [],
  };

  const totalClicks = safeData.top_clicks.reduce((a, c) => a + (c?.count || 0), 0);
  const maxDaily = Math.max(...safeData.daily.map(d => d?.visits || 0), 1);
  const socialPlatforms = safeData.utm_sources;
  const totalSocialVisits = socialPlatforms.reduce((a, c) => a + (c?.count || 0), 0);
  const seoVisits = safeData.referrers.filter(r =>
    r?.referrer && (
      r.referrer.includes("google") || r.referrer.includes("bing") ||
      r.referrer.includes("yahoo") || r.referrer.includes("duckduckgo")
    )
  ).reduce((a, c) => a + (c?.count || 0), 0);
  const directVisits = Math.max(0, safeData.total_visits - totalSocialVisits - seoVisits);

  return (
    <div className="space-y-6" data-testid="admin-analytics">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading font-bold text-2xl">Visitor Analytics</h1>
          <p className="text-sm text-muted-foreground mt-1">Track visitors, social media and SEO performance</p>
        </div>
        <button 
          onClick={load} 
          className="btn-outline !py-2 !px-4 text-sm flex items-center gap-2"
          data-testid="refresh-analytics"
        >
          <RefreshCw className="h-4 w-4" /> Refresh
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Eye} label="Total Visits" value={safeData.total_visits} color="bg-blue-50 text-blue-600" />
        <StatCard icon={Users} label="Unique Visitors" value={safeData.unique_visitors} color="bg-green-50 text-green-600" />
        <StatCard icon={TrendingUp} label="Today's Visits" value={safeData.today_visits} color="bg-yellow-50 text-yellow-600" />
        <StatCard icon={MousePointerClick} label="Total Clicks" value={totalClicks} color="bg-purple-50 text-purple-600" />
      </div>

      {/* Traffic Source Overview */}
      <div className="p-6 rounded-2xl bg-white border border-border/60">
        <h2 className="font-heading font-semibold text-lg mb-4">Traffic Source Overview</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-pink-50 border border-pink-100 text-center">
            <Share2 className="h-6 w-6 text-pink-600 mx-auto mb-2" />
            <div className="font-heading font-bold text-2xl text-pink-600">{totalSocialVisits}</div>
            <div className="text-xs text-pink-700 font-medium mt-1">Social Media</div>
            <div className="text-xs text-muted-foreground mt-0.5">
              {safeData.total_visits > 0 ? Math.round((totalSocialVisits / safeData.total_visits) * 100) : 0}% of total
            </div>
          </div>
          <div className="p-4 rounded-xl bg-green-50 border border-green-100 text-center">
            <Search className="h-6 w-6 text-green-600 mx-auto mb-2" />
            <div className="font-heading font-bold text-2xl text-green-600">{seoVisits}</div>
            <div className="text-xs text-green-700 font-medium mt-1">SEO / Search</div>
            <div className="text-xs text-muted-foreground mt-0.5">
              {safeData.total_visits > 0 ? Math.round((seoVisits / safeData.total_visits) * 100) : 0}% of total
            </div>
          </div>
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 text-center">
            <Link2 className="h-6 w-6 text-gray-600 mx-auto mb-2" />
            <div className="font-heading font-bold text-2xl text-gray-600">{directVisits}</div>
            <div className="text-xs text-gray-700 font-medium mt-1">Direct / Other</div>
            <div className="text-xs text-muted-foreground mt-0.5">
              {safeData.total_visits > 0 ? Math.round((directVisits / safeData.total_visits) * 100) : 0}% of total
            </div>
          </div>
        </div>
      </div>

      {/* Social Media Breakdown */}
      <div className="p-6 rounded-2xl bg-white border border-border/60">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-heading font-semibold text-lg">Social Media Traffic</h2>
          <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">via UTM links</span>
        </div>
        <p className="text-xs text-muted-foreground mb-4">
          Only counted when visitors click your UTM tracking links
        </p>

        {socialPlatforms.length === 0 ? (
          <div className="py-6 text-center">
            <Share2 className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm font-medium text-muted-foreground">No social media traffic yet</p>
            <p className="text-xs text-muted-foreground mt-1">Share your UTM links on social platforms</p>
          </div>
        ) : (
          <div className="space-y-3">
            {socialPlatforms.map((d) => {
              const config = PLATFORM_CONFIG[d.source] || PLATFORM_CONFIG.other;
              const pct = safeData.total_visits > 0 ? Math.round((d.count / safeData.total_visits) * 100) : 0;
              return (
                <div key={d.source} className="flex items-center gap-3">
                  <div className={`h-9 w-9 rounded-full grid place-items-center text-base shrink-0 ${config.light}`}>
                    {PLATFORM_EMOJIS[d.source] || "🔗"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">{config.label}</span>
                      <span className="text-muted-foreground">{d.count} visits ({pct}%)</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${config.color}`} style={{ width: `${Math.max(pct, 2)}%` }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* UTM Links */}
        <div className="mt-6 pt-4 border-t border-border/60">
          <p className="text-xs font-medium text-foreground mb-3">Your trackable links — copy and share:</p>
          <div className="space-y-1.5">
            {["instagram","facebook","whatsapp","linkedin","twitter","telegram","threads","youtube","pinterest"].map(platform => {
              const config = PLATFORM_CONFIG[platform];
              if (!config) return null;
              return (
                <div key={platform} className="flex items-center gap-2 p-2 bg-muted/40 rounded-lg">
                  <span className="text-sm shrink-0">{PLATFORM_EMOJIS[platform] || "🔗"}</span>
                  <span className="text-[11px] text-muted-foreground w-20 shrink-0 font-medium">
                    {config.label}
                  </span>
                  <code className="text-[10px] text-foreground break-all flex-1">
                    https://shopbyfbo.vercel.app?utm_source={platform}&utm_medium=social
                  </code>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* SEO Traffic */}
      <div className="p-6 rounded-2xl bg-white border border-border/60">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-heading font-semibold text-lg">SEO / Search Engine Traffic</h2>
          <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">organic</span>
        </div>
        <p className="text-xs text-muted-foreground mb-4">
          Visitors who found your site through Google, Bing or other search engines
        </p>
        {seoVisits === 0 ? (
          <div className="py-6 text-center">
            <Search className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm font-medium text-muted-foreground">No SEO traffic yet</p>
            <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto">
              SEO takes 2-3 months. Submit your sitemap to Google Search Console.
            </p>
            <a href="https://search.google.com/search-console" target="_blank" rel="noreferrer"
               className="inline-block mt-3 text-xs text-primary hover:underline">
              → Open Google Search Console
            </a>
          </div>
        ) : (
          <div className="space-y-3">
            {safeData.referrers
              .filter(r => r?.referrer && (
                r.referrer.includes("google") || r.referrer.includes("bing") ||
                r.referrer.includes("yahoo") || r.referrer.includes("duckduckgo")
              ))
              .map((d, i) => {
                const pct = safeData.total_visits > 0 ? Math.round((d.count / safeData.total_visits) * 100) : 0;
                const engine = d.referrer.includes("google") ? "🔍 Google" :
                               d.referrer.includes("bing") ? "🔎 Bing" :
                               d.referrer.includes("yahoo") ? "🟣 Yahoo" : "🔍 Search";
                return (
                  <div key={i} className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full grid place-items-center text-base shrink-0 bg-green-50">🔍</div>
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium">{engine}</span>
                        <span className="text-muted-foreground">{d.count} visits ({pct}%)</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-green-500" style={{ width: `${Math.max(pct, 2)}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>

      {/* Campaigns */}
      {safeData.utm_campaigns.length > 0 && (
        <div className="p-6 rounded-2xl bg-white border border-border/60">
          <h2 className="font-heading font-semibold text-lg mb-4">Campaigns</h2>
          <div className="space-y-3">
            {safeData.utm_campaigns.map((d) => (
              <BarRow key={d.campaign} label={d.campaign} value={d.count}
                total={safeData.total_visits} icon={TrendingUp} color="bg-secondary" />
            ))}
          </div>
        </div>
      )}

      {/* Daily Chart */}
      <div className="p-6 rounded-2xl bg-white border border-border/60">
        <h2 className="font-heading font-semibold text-lg mb-4">Visits — Last 7 Days</h2>
        <div className="flex items-end gap-2 h-36">
          {safeData.daily.map((d) => (
            <div key={d.date} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-xs text-muted-foreground">{d.visits}</span>
              <div className="w-full rounded-t-md bg-primary transition-all"
                style={{ height: `${Math.max((d.visits / maxDaily) * 100, 4)}%` }} />
              <span className="text-[10px] text-muted-foreground">
                {new Date(d.date).toLocaleDateString("en-IN", { weekday: "short" })}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-white border border-border/60">
          <h2 className="font-heading font-semibold text-lg mb-4">Devices</h2>
          <div className="space-y-3">
            {safeData.devices.map((d) => (
              <BarRow key={d.device} label={d.device} value={d.count} total={safeData.total_visits}
                icon={d.device === "Mobile" ? Smartphone : d.device === "Tablet" ? Tablet : Monitor}
                color="bg-blue-500" />
            ))}
            {safeData.devices.length === 0 && <Empty />}
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-border/60">
          <h2 className="font-heading font-semibold text-lg mb-4">Browsers</h2>
          <div className="space-y-3">
            {safeData.browsers.map((d) => (
              <BarRow key={d.browser} label={d.browser} value={d.count} total={safeData.total_visits}
                icon={Globe} color="bg-green-500" />
            ))}
            {safeData.browsers.length === 0 && <Empty />}
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-border/60">
          <h2 className="font-heading font-semibold text-lg mb-4">Operating Systems</h2>
          <div className="space-y-3">
            {safeData.os_list.map((d) => (
              <BarRow key={d.os} label={d.os} value={d.count} total={safeData.total_visits}
                icon={Monitor} color="bg-orange-500" />
            ))}
            {safeData.os_list.length === 0 && <Empty />}
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-border/60">
          <h2 className="font-heading font-semibold text-lg mb-4">All Traffic Sources</h2>
          <div className="space-y-3">
            {safeData.referrers.length === 0 ? (
              <p className="text-sm text-muted-foreground">Most visitors came directly</p>
            ) : safeData.referrers.map((d) => (
              <BarRow key={d.referrer}
                label={d.referrer.replace(/^https?:\/\//, "").slice(0, 40)}
                value={d.count} total={safeData.total_visits} icon={Globe} color="bg-purple-500" />
            ))}
          </div>
        </div>
      </div>

      {/* Top Pages */}
      <div className="p-6 rounded-2xl bg-white border border-border/60">
        <h2 className="font-heading font-semibold text-lg mb-4">Top Pages</h2>
        <div className="space-y-3">
          {safeData.top_pages.map((d) => (
            <BarRow key={d.page} label={d.page || "/"} value={d.count}
              total={safeData.total_visits} icon={Eye} color="bg-primary" />
          ))}
          {safeData.top_pages.length === 0 && <Empty />}
        </div>
      </div>

      {/* Top Clicks */}
      <div className="p-6 rounded-2xl bg-white border border-border/60">
        <h2 className="font-heading font-semibold text-lg mb-4">Most Clicked Elements</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/60">
                <th className="text-left py-2 px-3 text-muted-foreground font-medium">Element</th>
                <th className="text-left py-2 px-3 text-muted-foreground font-medium">Label</th>
                <th className="text-left py-2 px-3 text-muted-foreground font-medium">Page</th>
                <th className="text-right py-2 px-3 text-muted-foreground font-medium">Clicks</th>
              </tr>
            </thead>
            <tbody>
              {safeData.top_clicks.map((d, i) => (
                <tr key={i} className="border-b border-border/30 hover:bg-muted/30">
                  <td className="py-2 px-3"><span className="chip bg-muted text-muted-foreground font-mono text-[11px]">{d.element}</span></td>
                  <td className="py-2 px-3 text-foreground max-w-[200px] truncate">{d.label || "—"}</td>
                  <td className="py-2 px-3 text-muted-foreground">{d.page || "/"}</td>
                  <td className="py-2 px-3 text-right font-semibold text-primary">{d.count}</td>
                </tr>
              ))}
              {safeData.top_clicks.length === 0 && (
                <tr><td colSpan={4} className="py-6 text-center text-muted-foreground">No click data yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Visits */}
      <div className="p-6 rounded-2xl bg-white border border-border/60">
        <h2 className="font-heading font-semibold text-lg mb-4">Recent Visits</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/60">
                <th className="text-left py-2 px-3 text-muted-foreground font-medium">Page</th>
                <th className="text-left py-2 px-3 text-muted-foreground font-medium">Source</th>
                <th className="text-left py-2 px-3 text-muted-foreground font-medium">Device</th>
                <th className="text-left py-2 px-3 text-muted-foreground font-medium">Browser</th>
                <th className="text-left py-2 px-3 text-muted-foreground font-medium">Time</th>
              </tr>
            </thead>
            <tbody>
              {safeData.recent.map((v, i) => {
                const source = v.utm_source
                  ? `${PLATFORM_EMOJIS[v.utm_source] || "🔗"} ${PLATFORM_CONFIG[v.utm_source]?.label || v.utm_source}`
                  : v.referrer
                    ? (v.referrer.includes("google") ? "🔍 Google"
                      : v.referrer.includes("bing") ? "🔎 Bing"
                      : `🔗 ${v.referrer.replace(/^https?:\/\//, "").slice(0, 20)}`)
                    : "🔗 Direct";
                return (
                  <tr key={i} className="border-b border-border/30 hover:bg-muted/30">
                    <td className="py-2 px-3 font-medium max-w-[140px] truncate">{v.page || "/"}</td>
                    <td className="py-2 px-3 text-xs text-muted-foreground">{source}</td>
                    <td className="py-2 px-3">
                      <span className={`chip text-[11px] ${
                        v.device === "Mobile" ? "bg-blue-50 text-blue-600" :
                        v.device === "Tablet" ? "bg-yellow-50 text-yellow-600" :
                        "bg-gray-100 text-gray-600"
                      }`}>{v.device || "?"}</span>
                    </td>
                    <td className="py-2 px-3 text-muted-foreground">{v.browser || "?"}</td>
                    <td className="py-2 px-3 text-muted-foreground text-xs">
                      {new Date(v.timestamp).toLocaleString("en-IN", { dateStyle: "short", timeStyle: "short" })}
                    </td>
                  </tr>
                );
              })}
              {safeData.recent.length === 0 && (
                <tr><td colSpan={5} className="py-6 text-center text-muted-foreground">No visits yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="p-5 rounded-2xl bg-white border border-border/60">
      <div className={`h-10 w-10 rounded-xl grid place-items-center mb-3 ${color}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="font-heading font-bold text-2xl">{(value || 0).toLocaleString()}</div>
      <div className="text-xs text-muted-foreground mt-1">{label}</div>
    </div>
  );
}

function BarRow({ icon: Icon, label, value, total, color }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="flex justify-between text-sm mb-1">
          <span className="truncate font-medium">{label}</span>
          <span className="text-muted-foreground ml-2 shrink-0">{value} ({pct}%)</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div className={`h-full rounded-full ${color}`} style={{ width: `${Math.max(pct, 1)}%` }} />
        </div>
      </div>
    </div>
  );
}

function Empty() {
  return <p className="text-sm text-muted-foreground">No data yet</p>;
}
