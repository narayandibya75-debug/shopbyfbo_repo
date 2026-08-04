import React, { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings, 
  BarChart3, 
  LogOut, 
  Menu, 
  X,
  Home
} from "lucide-react";
import { useAuth } from '../../contexts/AuthContext';  // ✅ Correct path

import { toast } from "sonner";
import SEO from "../../components/SEO";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  // FIXED: Destructured active session loading flags to prevent loop traps
  const { user, logout, loading } = useAuth();

  const navItems = [
    { path: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { path: "/admin/products", label: "Products", icon: Package },
    { path: "/admin/orders", label: "Orders", icon: ShoppingCart },
    { path: "/admin/analytics", label: "Analytics", icon: BarChart3 },
    { path: "/admin/users", label: "Users", icon: Users },
    { path: "/admin/settings", label: "Settings", icon: Settings },
  ];

  // Administrative verification barrier
  useEffect(() => {
    if (!loading) {
      if (!user || user.role !== "admin") {
        toast.error("Access denied. Admin authorization required.");
        navigate("/");
      }
    }
  }, [user, loading, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
    toast.success("Logged out successfully");
  };

  const isActive = (path) => {
    if (path === "/admin") {
      return location.pathname === "/admin";
    }
    return location.pathname.startsWith(path);
  };

  // Safe exit point when authentication promises remain unresolved
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  // Double down on path visibility barriers
  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <>
    {/* ROBOTS COUPLING GATEWAY - ISOLATES AREA FROM SEARCH INDEXING */}
    <SEO
      title="System Administration Dashboard"
      description="Protected metrics portal. Access restricted to authorized FBO administrators."
      url="/admin"
      robots="noindex, nofollow" 
    />
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar toggle button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-md border border-gray-100"
        aria-label="Toggle Dashboard Menu"
      >
        {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Primary Sidebar Drawer Layout */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen w-64 bg-white border-r border-gray-200 transition-transform duration-300 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Dashboard Operator Label header */}
          <div className="p-6 border-b border-gray-200">
            <h1 className="font-heading font-bold text-xl text-primary">Admin Panel</h1>
            <p className="text-xs text-gray-500 mt-1 truncate">{user?.email}</p>
          </div>

          {/* Core navigation maps rendering */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                    active
                      ? "bg-primary text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  <span className="font-medium text-sm">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Action layouts navigation footer */}
          <div className="p-4 border-t border-gray-200 bg-gray-50/50">
            <Link
              to="/"
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100 mb-2 transition-colors"
            >
              <Home className="h-5 w-5 text-gray-400" />
              <span className="font-medium text-sm">Back to Store</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-red-600 hover:bg-red-50 w-full transition-colors text-left"
            >
              <LogOut className="h-5 w-5 shrink-0" />
              <span className="font-medium text-sm">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Render child pages directly inside primary window layout */}
      <div className="lg:ml-64 min-h-screen flex flex-col">
        <main className="flex-1 p-6 lg:p-8 pt-20 lg:pt-8">
          <Outlet />
        </main>
      </div>

      {/* Dimmer blur blanket overlay for responsive mobile views */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
    </>
  );
}
