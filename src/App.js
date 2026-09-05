import React, { Suspense, lazy } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { Toaster } from "./components/ui/sonner";
import { useAnalytics } from "./hooks/useAnalytics";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import CartDrawer from "./components/CartDrawer";
import Chatbot from "./components/Chatbot";

import { ProtectedRoute, AdminRoute } from "./components/ProtectedRoute";
import ErrorBoundary from "./components/ErrorBoundary";
import ScrollToTop from "./components/ScrollToTop";
import PageLoader from "./components/PageLoader";

// Route-level code splitting
const Home = lazy(() => import("./pages/Home"));
const Shop = lazy(() => import("./pages/Shop"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const Orders = lazy(() => import("./pages/Orders"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const Terms = lazy(() => import("./pages/Terms"));
const NotFound = lazy(() => import("./pages/NotFound"));

const AdminLayout = lazy(() => import("./pages/admin/AdminLayout"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminProducts = lazy(() => import("./pages/admin/AdminProducts"));
const AdminOrders = lazy(() => import("./pages/admin/AdminOrders"));
const AdminAnalytics = lazy(() => import("./pages/admin/AdminAnalytics"));

function AppShell() {
  const location = useLocation();

  const isAuthPage = ["/login", "/register"].includes(location.pathname);
  const isAdmin = location.pathname.startsWith("/admin");

  // Track visitor metrics
  useAnalytics();

  // Show normal customer navigation only on public pages
  const showCustomerUI = !isAuthPage && !isAdmin;

  return (
    <div className="App flex flex-col min-h-screen">
      <ScrollToTop />

      {/* Customer navigation */}
      {showCustomerUI && <Navbar />}

      {/* Cart drawer only for customer-facing pages */}
      {!isAuthPage && !isAdmin && <CartDrawer />}

      <main className="flex-1">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* =========================
                PUBLIC STORE ROUTES
            ========================== */}

            <Route path="/" element={<Home />} />

            <Route path="/shop" element={<Shop />} />

            <Route
              path="/product/:id"
              element={<ProductDetail />}
            />

            <Route
              path="/cart"
              element={<Cart />}
            />

            {/* =========================
                CUSTOMER ACCOUNT ROUTES
            ========================== */}

            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              }
            />

            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <Orders />
                </ProtectedRoute>
              }
            />

            <Route
              path="/login"
              element={<Login />}
            />

            <Route
              path="/register"
              element={<Register />}
            />

            {/* =========================
                INFORMATIONAL ROUTES
            ========================== */}

            <Route
              path="/about"
              element={<About />}
            />

            <Route
              path="/contact"
              element={<Contact />}
            />

            <Route
              path="/privacy-policy"
              element={<PrivacyPolicy />}
            />

            <Route
              path="/terms"
              element={<Terms />}
            />

            {/* =========================
                ADMIN ROUTES
            ========================== */}

            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminLayout />
                </AdminRoute>
              }
            >
              <Route
                index
                element={<AdminDashboard />}
              />

              <Route
                path="products"
                element={<AdminProducts />}
              />

              <Route
                path="orders"
                element={<AdminOrders />}
              />

              <Route
                path="analytics"
                element={<AdminAnalytics />}
              />
            </Route>

            {/* =========================
                404
            ========================== */}

            <Route
              path="*"
              element={<NotFound />}
            />
          </Routes>
        </Suspense>
      </main>

      {/* Customer footer */}
      {showCustomerUI && <Footer />}

      {/* =================================
          GEMINI CUSTOMER SUPPORT CHATBOT
          Hidden automatically on admin/auth
      ================================== */}
      {showCustomerUI && <Chatbot />}

      <Toaster
        position="top-right"
        richColors
      />
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <CartProvider>
              <AppShell />
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
