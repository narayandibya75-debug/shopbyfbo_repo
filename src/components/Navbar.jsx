import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { ShoppingBag, Search, User, Menu, X, LogOut, Leaf, ShieldCheck, Sun, Moon } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import { useTheme } from "../contexts/ThemeContext";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Input } from "./ui/input";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger
} from "./ui/dropdown-menu";

const links = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/shop?category=Aloe%20Drinks", label: "Aloe" },
  { to: "/shop?category=Nutrition", label: "Nutrition" },
  { to: "/shop?category=Skincare", label: "Skincare" },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const { itemCount, setOpen } = useCart();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  const onSearch = (e) => {
    e.preventDefault();
    navigate(`/shop?q=${encodeURIComponent(q)}`);
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 glass border-b border-border/50" data-testid="navbar">
      <div className="container-ff flex items-center gap-4 py-4">
        <Link to="/" className="flex items-center gap-2 shrink-0" data-testid="logo-link">
          <span className="h-9 w-9 rounded-full bg-primary text-primary-foreground grid place-items-center">
            <Leaf className="h-5 w-5" />
          </span>
          <div className="leading-tight">
            <div className="font-heading font-semibold text-lg text-primary">ShopVerse</div>
            <div className="overline text-muted-foreground text-[10px]">Forever FBO</div>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-6 ml-6">
          {links.map((l) => (
            <NavLink
              key={l.label}
              to={l.to}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${isActive ? "text-primary" : "text-muted-foreground hover:text-primary"}`
              }
              data-testid={`nav-link-${l.label.toLowerCase()}`}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <form onSubmit={onSearch} className="hidden md:flex ml-auto flex-1 max-w-md relative">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search aloe, bee, nutrition…"
            className="pl-9 rounded-full bg-muted/60 border-transparent focus-visible:border-primary dark:focus-visible:bg-card focus-visible:bg-white"
            data-testid="search-input"
          />
        </form>

        <div className="ml-auto md:ml-2 flex items-center gap-2">

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="h-10 w-10 grid place-items-center rounded-full hover:bg-muted transition-colors"
            aria-label="Toggle theme"
            data-testid="theme-toggle"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5 text-secondary" />
            ) : (
              <Moon className="h-5 w-5 text-muted-foreground" />
            )}
          </button>

          <button
            onClick={() => setOpen(true)}
            className="relative h-10 w-10 grid place-items-center rounded-full hover:bg-muted transition-colors"
            aria-label="Open cart"
            data-testid="cart-button"
          >
            <ShoppingBag className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 min-w-5 px-1 rounded-full bg-secondary text-secondary-foreground text-[11px] font-bold grid place-items-center"
                    data-testid="cart-count-badge">
                {itemCount}
              </span>
            )}
          </button>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="h-10 w-10 grid place-items-center rounded-full hover:bg-muted transition-colors" data-testid="user-menu-trigger">
                  <User className="h-5 w-5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-heading">Hi, {user.name?.split(" ")[0]}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/orders")} data-testid="menu-orders">
                  My Orders
                </DropdownMenuItem>
                {user.role === "admin" && (
                  <DropdownMenuItem onClick={() => navigate("/admin")} data-testid="menu-admin">
                    <ShieldCheck className="h-4 w-4 mr-2" /> FBO Admin
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={async () => { await logout(); navigate("/"); }} data-testid="menu-logout">
                  <LogOut className="h-4 w-4 mr-2" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/login" className="btn-outline !py-2 !px-4 text-sm" data-testid="login-link">
              Login
            </Link>
          )}

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <button className="lg:hidden h-10 w-10 grid place-items-center rounded-full hover:bg-muted" aria-label="Open menu" data-testid="mobile-menu-trigger">
                <Menu className="h-5 w-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[88%] sm:w-96">
              <div className="flex items-center justify-between mb-6">
                <div className="font-heading text-xl text-primary">ShopVerse</div>
                <button onClick={() => setMobileOpen(false)} aria-label="Close"><X className="h-5 w-5" /></button>
              </div>
              <form onSubmit={onSearch} className="mb-4 relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search…" className="pl-9 rounded-full bg-muted/60" />
              </form>
              <div className="flex flex-col gap-3">
                {links.map((l) => (
                  <Link key={l.label} to={l.to} onClick={() => setMobileOpen(false)}
                        className="py-2 text-base font-medium text-foreground hover:text-primary" data-testid={`mobile-nav-${l.label.toLowerCase()}`}>
                    {l.label}
                  </Link>
                ))}
              </div>
              {/* Mobile theme toggle */}
              <div className="mt-6 pt-6 border-t border-border">
                <button
                  onClick={toggleTheme}
                  className="flex items-center gap-3 w-full py-2 text-base font-medium text-foreground hover:text-primary"
                >
                  {theme === "dark" ? <Sun className="h-5 w-5 text-secondary" /> : <Moon className="h-5 w-5" />}
                  {theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
                </button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
