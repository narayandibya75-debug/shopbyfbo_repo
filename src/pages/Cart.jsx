import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Trash2,
  Truck,
} from "lucide-react";

import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { INR, productImage } from "../lib/api";
import SEO from "../components/SEO";

const SHIPPING_THRESHOLD = 499;
const SHIPPING_FEE = 49;

export default function Cart() {
  const { cart, update, remove } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const items = cart?.items || [];
  const subtotal = Number(cart?.subtotal || 0);

  const qualifiesForFreeShipping =
    subtotal >= SHIPPING_THRESHOLD;

  const shipping = qualifiesForFreeShipping
    ? 0
    : subtotal > 0
    ? SHIPPING_FEE
    : 0;

  const total = subtotal + shipping;

  const amountRemaining = Math.max(
    0,
    SHIPPING_THRESHOLD - subtotal
  );

  const shippingProgress = Math.min(
    100,
    (subtotal / SHIPPING_THRESHOLD) * 100
  );


  /* ==========================================================
     CHECKOUT
  =========================================================== */

  const goToCheckout = () => {
    if (user) {
      navigate("/checkout");
    } else {
      navigate("/login?redirect=/checkout");
    }
  };


  return (
    <>
      <SEO
        title="Your Cart | ShopVerse"
        description="Review your ShopVerse wellness products, check your order total and continue securely to checkout."
        keywords="ShopVerse cart, wellness products cart, online wellness checkout"
        url="/cart"
      />

      <main
        className="container-ff py-7 sm:py-10"
        data-testid="cart-page"
      >

        {/* ====================================================
            HEADER
        ===================================================== */}

        <div className="mb-8">

          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-5"
          >
            <ArrowLeft className="h-4 w-4" />
            Continue shopping
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">

            <div>

              <div className="overline text-secondary flex items-center gap-2">
                <ShoppingBag className="h-3.5 w-3.5" />
                Your selection
              </div>

              <h1 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight mt-2">
                Your cart
              </h1>

            </div>

            {items.length > 0 && (
              <p className="text-sm text-muted-foreground">
                {items.length} item{items.length === 1 ? "" : "s"}
              </p>
            )}

          </div>

        </div>


        {/* ====================================================
            EMPTY CART
        ===================================================== */}

        {items.length === 0 ? (

          <section className="py-16 sm:py-24">

            <div className="max-w-lg mx-auto text-center">

              <div className="mx-auto h-20 w-20 rounded-3xl bg-muted grid place-items-center">

                <ShoppingBag className="h-8 w-8 text-muted-foreground" />

              </div>

              <h2 className="font-heading font-semibold text-2xl sm:text-3xl mt-6">
                Your cart is empty
              </h2>

              <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                Looks like you haven't added anything yet.
                Explore our wellness collection and find something
                that's right for your routine.
              </p>

              <Link
                to="/shop"
                className="btn-primary mt-7 inline-flex"
                data-testid="cart-empty-shop-btn"
              >
                Explore Products
                <ArrowRight className="h-4 w-4" />
              </Link>

            </div>

          </section>

        ) : (

          /* ==================================================
             CART CONTENT
          =================================================== */

          <div className="grid lg:grid-cols-3 gap-7 lg:gap-10">


            {/* ==================================================
                CART ITEMS
            =================================================== */}

            <section className="lg:col-span-2">

              <div className="space-y-3">

                {items.map((item) => {

                  const product = item.product;

                  return (
                    <CartItem
                      key={product.product_id}
                      item={item}
                      update={update}
                      remove={remove}
                    />
                  );

                })}

              </div>


              {/* CONTINUE SHOPPING */}

              <Link
                to="/shop"
                className="inline-flex items-center gap-2 mt-6 text-sm font-medium text-primary hover:underline"
              >
                <ArrowLeft className="h-4 w-4" />
                Continue shopping
              </Link>

            </section>


            {/* ==================================================
                ORDER SUMMARY
            =================================================== */}

            <aside className="lg:col-span-1">

              <div className="lg:sticky lg:top-24 space-y-4">


                {/* SHIPPING PROGRESS */}

                <div className="rounded-3xl border bg-background p-5">

                  <div className="flex items-start gap-3">

                    <div className="h-10 w-10 rounded-2xl bg-primary/10 grid place-items-center shrink-0">
                      {qualifiesForFreeShipping ? (
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      ) : (
                        <Truck className="h-5 w-5 text-primary" />
                      )}
                    </div>

                    <div className="min-w-0">

                      {qualifiesForFreeShipping ? (
                        <>
                          <p className="text-sm font-semibold text-green-700">
                            Free delivery unlocked
                          </p>

                          <p className="text-xs text-muted-foreground mt-1">
                            Your order qualifies for free delivery.
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="text-sm font-semibold">
                            You're almost there
                          </p>

                          <p className="text-xs text-muted-foreground mt-1">
                            Add {INR(amountRemaining)} more for free delivery.
                          </p>
                        </>
                      )}

                    </div>

                  </div>


                  {!qualifiesForFreeShipping && (
                    <div className="mt-4">

                      <div className="h-1.5 rounded-full bg-muted overflow-hidden">

                        <div
                          className="h-full bg-primary rounded-full transition-all duration-500"
                          style={{
                            width: `${shippingProgress}%`,
                          }}
                        />

                      </div>

                      <div className="flex justify-between mt-1.5 text-[10px] text-muted-foreground">
                        <span>{INR(subtotal)}</span>
                        <span>{INR(SHIPPING_THRESHOLD)}</span>
                      </div>

                    </div>
                  )}

                </div>


                {/* ORDER SUMMARY */}

                <div className="rounded-3xl border bg-background p-5 sm:p-6">

                  <h2 className="font-heading font-semibold text-xl">
                    Order summary
                  </h2>


                  <div className="mt-5 space-y-3 text-sm">

                    <SummaryRow
                      label="Subtotal"
                      value={INR(subtotal)}
                    />


                    <div className="flex items-start justify-between gap-4">

                      <div>

                        <span>Delivery</span>

                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          {qualifiesForFreeShipping
                            ? "Free delivery"
                            : "Standard delivery"}
                        </p>

                      </div>

                      <span
                        className={
                          qualifiesForFreeShipping
                            ? "font-semibold text-green-600"
                            : ""
                        }
                      >
                        {qualifiesForFreeShipping
                          ? "FREE"
                          : INR(SHIPPING_FEE)}
                      </span>

                    </div>


                    <div className="h-px bg-border my-4" />


                    <div className="flex items-center justify-between">

                      <span className="font-medium">
                        Total
                      </span>

                      <span
                        className="font-heading font-bold text-2xl text-primary"
                        data-testid="cart-total"
                      >
                        {INR(total)}
                      </span>

                    </div>

                  </div>


                  {/* CHECKOUT */}

                  <button
                    type="button"
                    onClick={goToCheckout}
                    className="btn-primary w-full mt-6"
                    data-testid="cart-page-checkout-btn"
                  >
                    Proceed to Checkout
                    <ArrowRight className="h-4 w-4" />
                  </button>


                  <p className="text-[11px] text-center text-muted-foreground mt-3">
                    Secure checkout with clear order details
                  </p>


                  {/* TRUST */}

                  <div className="mt-6 pt-5 border-t space-y-3">

                    <TrustRow
                      icon={ShieldCheck}
                      title="Authentic products"
                      text="Supplied through registered distribution channels."
                    />

                    <TrustRow
                      icon={Truck}
                      title="Reliable delivery"
                      text="Order updates provided throughout fulfillment."
                    />

                  </div>


                  {/* BV / CC */}

                  {(cart?.total_bv || cart?.total_cc) && (
                    <div className="mt-5 pt-4 border-t">

                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Total BV</span>
                        <span className="font-medium text-foreground">
                          {Number(cart?.total_bv || 0).toFixed(2)}
                        </span>
                      </div>

                      <div className="flex justify-between text-xs text-muted-foreground mt-2">
                        <span>Total CC</span>
                        <span className="font-medium text-foreground">
                          {Number(cart?.total_cc || 0).toFixed(3)}
                        </span>
                      </div>

                    </div>
                  )}

                </div>

              </div>

            </aside>

          </div>

        )}

      </main>
    </>
  );
}


/* ============================================================
   CART ITEM
============================================================= */

function CartItem({ item, update, remove }) {
  const product = item.product;
  const quantity = Number(item.quantity || 1);

  const lineTotal =
    Number(item.line_total || product.price * quantity);


  return (
    <article className="rounded-3xl border bg-background p-4 sm:p-5">

      <div className="flex gap-4 sm:gap-5">

        {/* IMAGE */}

        <Link
          to={`/product/${product.product_id}`}
          className="shrink-0"
        >

          <div className="h-24 w-24 sm:h-32 sm:w-32 rounded-2xl bg-muted overflow-hidden">

            <img
              src={productImage(product.images)}
              alt={product.name}
              className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
            />

          </div>

        </Link>


        {/* DETAILS */}

        <div className="flex-1 min-w-0">

          <div className="flex items-start justify-between gap-3">

            <div className="min-w-0">

              <div className="overline text-muted-foreground">
                {product.category || "Wellness"}
              </div>

              <Link
                to={`/product/${product.product_id}`}
                className="block mt-1"
              >

                <h2 className="font-heading font-semibold text-base sm:text-lg leading-tight line-clamp-2 hover:text-primary transition-colors">
                  {product.name}
                </h2>

              </Link>

            </div>


            {/* DESKTOP PRICE */}

            <div className="hidden sm:block text-right shrink-0">

              <div className="font-heading font-bold text-lg text-primary">
                {INR(lineTotal)}
              </div>

              {quantity > 1 && (
                <div className="text-[11px] text-muted-foreground">
                  {INR(product.price)} each
                </div>
              )}

            </div>

          </div>


          {/* BV / CC */}

          <div className="text-[11px] text-muted-foreground mt-1.5">
            BV {product.bv ?? 0} · CC {product.cc ?? 0}
          </div>


          {/* MOBILE PRICE */}

          <div className="sm:hidden mt-3">

            <span className="font-heading font-bold text-lg text-primary">
              {INR(lineTotal)}
            </span>

            {quantity > 1 && (
              <span className="text-[11px] text-muted-foreground ml-2">
                {INR(product.price)} each
              </span>
            )}

          </div>


          {/* ACTIONS */}

          <div className="flex flex-wrap items-center gap-3 mt-4">

            {/* QUANTITY */}

            <div className="inline-flex items-center rounded-full border border-border">

              <button
                type="button"
                onClick={() =>
                  update(
                    product.product_id,
                    Math.max(1, quantity - 1)
                  )
                }
                className="h-9 w-9 grid place-items-center hover:bg-muted rounded-l-full transition-colors"
                aria-label={`Decrease quantity of ${product.name}`}
                data-testid={`cartpage-dec-${product.product_id}`}
              >
                <Minus className="h-3.5 w-3.5" />
              </button>


              <span
                className="px-3 text-sm font-semibold min-w-[38px] text-center"
                data-testid={`cartpage-qty-${product.product_id}`}
              >
                {quantity}
              </span>


              <button
                type="button"
                onClick={() =>
                  update(
                    product.product_id,
                    quantity + 1
                  )
                }
                className="h-9 w-9 grid place-items-center hover:bg-muted rounded-r-full transition-colors"
                aria-label={`Increase quantity of ${product.name}`}
                data-testid={`cartpage-inc-${product.product_id}`}
              >
                <Plus className="h-3.5 w-3.5" />
              </button>

            </div>


            {/* REMOVE */}

            <button
              type="button"
              onClick={() =>
                remove(product.product_id)
              }
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground hover:text-destructive transition-colors"
              data-testid={`cartpage-remove-${product.product_id}`}
            >
              <Trash2 className="h-3.5 w-3.5" />
              Remove
            </button>

          </div>

        </div>

      </div>

    </article>
  );
}


/* ============================================================
   SUMMARY ROW
============================================================= */

function SummaryRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4">

      <span>{label}</span>

      <span className="font-medium">
        {value}
      </span>

    </div>
  );
}


/* ============================================================
   TRUST ROW
============================================================= */

function TrustRow({ icon: Icon, title, text }) {
  return (
    <div className="flex gap-3">

      <Icon className="h-4 w-4 text-primary shrink-0 mt-0.5" />

      <div>

        <div className="text-xs font-semibold">
          {title}
        </div>

        <p className="text-[11px] text-muted-foreground leading-relaxed mt-0.5">
          {text}
        </p>

      </div>

    </div>
  );
}
