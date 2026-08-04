import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { INR, productImage } from "../lib/api";
import { Minus, Plus, Trash2, ArrowRight } from "lucide-react";
import SEO from "../components/SEO";

export default function Cart() {
  const { cart, update, remove } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const items = cart.items || [];
  const SHIPPING_THRESHOLD = 499; // Centralized threshold rule

  return (
    <>
    <SEO
      title="Review Your Secure Shopping Cart | FBO Distribution Node"
      description="Review items added to your current session. Check transparent point values and track your tier progress for automated nationwide delivery options."
      keywords="secure shopping cart checkout, product point verification, item list tracker"
      url="/cart"
    />
    <div className="container-ff py-10" data-testid="cart-page">
      <h1 className="font-heading font-bold text-3xl sm:text-4xl">Your cart</h1>
      <p className="text-sm text-muted-foreground mt-1">{items.length} item{items.length === 1 ? "" : "s"}</p>

      {items.length === 0 ? (
        <div className="mt-12 p-12 rounded-3xl border border-dashed text-center">
          <p className="text-lg font-heading">Your cart is empty</p>
          <Link to="/shop" className="btn-primary mt-5" data-testid="cart-empty-shop-btn">Continue shopping <ArrowRight className="h-4 w-4" /></Link>
        </div>
      ) : (
        <div className="mt-8 grid lg:grid-cols-3 gap-8">
          <ul className="lg:col-span-2 space-y-4">
            {items.map((it) => (
              <li key={it.product.product_id} className="flex gap-4 p-4 rounded-2xl bg-white border border-border/60">
                <img src={productImage(it.product.images)} alt="" className="h-28 w-28 rounded-xl object-cover" />
                <div className="flex-1 min-w-0">
                  <div className="overline text-muted-foreground">{it.product.category}</div>
                  <h3 className="font-heading font-semibold line-clamp-2">{it.product.name}</h3>
                  <div className="text-xs text-muted-foreground mt-1">BV {it.product.bv ?? 0} · CC {it.product.cc ?? 0}</div>
                  <div className="mt-3 flex items-center gap-3">
                    <div className="inline-flex items-center rounded-full border border-border">
                      <button onClick={() => update(it.product.product_id, it.quantity - 1)} className="h-9 w-9 grid place-items-center hover:bg-muted rounded-l-full" data-testid={`cartpage-dec-${it.product.product_id}`}>
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="px-3 text-sm font-medium">{it.quantity}</span>
                      <button onClick={() => update(it.product.product_id, it.quantity + 1)} className="h-9 w-9 grid place-items-center hover:bg-muted rounded-r-full" data-testid={`cartpage-inc-${it.product.product_id}`}>
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <button onClick={() => remove(it.product.product_id)} className="text-muted-foreground hover:text-destructive inline-flex items-center gap-1 text-sm" data-testid={`cartpage-remove-${it.product.product_id}`}>
                      <Trash2 className="h-4 w-4" /> Remove
                    </button>
                  </div>
                </div>
                <div className="font-heading font-semibold text-primary">{INR(it.line_total)}</div>
              </li>
            ))}
          </ul>

          <aside className="h-max p-6 rounded-2xl bg-white border border-border/60 sticky top-24">
            <h2 className="font-heading font-semibold text-lg mb-4">Order summary</h2>
            <div className="space-y-2 text-sm">
              <Row label="Subtotal" value={INR(cart.subtotal)} />
              
              {/* Shipping Row with fixed parameters */}
              <div className="flex justify-between">
                <div>
                  <span>Shipping</span>
                  {cart.subtotal >= SHIPPING_THRESHOLD ? (
                    <div className="text-xs text-green-600">Free delivery</div>
                  ) : (
                    <div className="text-xs text-muted-foreground">Standard delivery (3-5 days)</div>
                  )}
                </div>
                <div>
                  {cart.subtotal >= SHIPPING_THRESHOLD ? (
                    <span className="text-green-600 font-semibold">FREE</span>
                  ) : (
                    <span>{INR(49)}</span>
                  )}
                </div>
              </div>
              
              {/* GST calculations */}
              {cart.subtotal < SHIPPING_THRESHOLD && cart.subtotal > 0 && (
                <div className="flex justify-between text-xs text-muted-foreground pl-4">
                  <span>Incl. GST (18%) on shipping</span>
                  <span>{INR((49 * 18) / 100)}</span>
                </div>
              )}
              
              <div className="h-px bg-border my-3" />
              <Row label="Total" value={INR(cart.subtotal + (cart.subtotal >= SHIPPING_THRESHOLD ? 0 : 49))} bold />
              <Row label="Total BV" value={(cart.total_bv || 0).toFixed(2)} muted />
              <Row label="Total CC" value={(cart.total_cc || 0).toFixed(3)} muted />
            </div>
            
            {/* Dynamic system thresholds messages */}
            {cart.subtotal < SHIPPING_THRESHOLD && cart.subtotal > 0 && (
              <div className="mt-3 p-2 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-700">
                  🚚 Add {INR(SHIPPING_THRESHOLD - cart.subtotal)} more to qualify for FREE shipping
                </p>
              </div>
            )}
            
            {cart.subtotal >= SHIPPING_THRESHOLD && (
              <div className="mt-3 p-2 bg-green-50 rounded-lg">
                <p className="text-xs text-green-700 font-medium">
                  ✨ You've qualified for FREE shipping! ✨
                </p>
              </div>
            )}
            
            <button
              onClick={() => navigate(user ? "/checkout" : "/login?redirect=/checkout")}
              className="btn-primary w-full mt-5"
              data-testid="cart-page-checkout-btn"
            >
              Checkout <ArrowRight className="h-4 w-4" />
            </button>
          </aside>
        </div>
      )}
    </div>
    </>
  );
}

function Row({ label, value, bold, muted }) {
  return (
    <div className={`flex justify-between ${muted ? "text-xs text-muted-foreground" : ""}`}>
      <span>{label}</span>
      <span className={bold ? "font-heading font-bold text-primary text-lg" : ""}>{value}</span>
    </div>
  );
}
