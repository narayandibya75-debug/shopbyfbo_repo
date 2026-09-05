import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  ShoppingBag,
} from "lucide-react";
import { toast } from "sonner";

import { INR, productImage } from "../lib/api";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";

export default function ProductCard({ product }) {
  const { add } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [adding, setAdding] = useState(false);

  const disabled = product.status !== "active";

  const hasDiscount =
    product.mrp &&
    product.price &&
    Number(product.mrp) > Number(product.price);

  const discountAmount = hasDiscount
    ? Number(product.mrp) - Number(product.price)
    : 0;

  const discountPercent = hasDiscount
    ? Math.round(
        ((Number(product.mrp) - Number(product.price)) /
          Number(product.mrp)) *
          100
      )
    : 0;


  /* ==========================================================
     ADD TO CART
  =========================================================== */

  const onAdd = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (disabled || adding) return;

    if (!user) {
      toast("Please login to add this product to your cart");
      navigate(
        `/login?redirect=/product/${product.product_id}`
      );
      return;
    }

    try {
      setAdding(true);

      await add(product.product_id, 1);

      toast.success(
        `${product.name} added to your cart`
      );
    } catch (err) {
      toast.error(
        err?.response?.data?.detail ||
          "Could not add this product to your cart"
      );
    } finally {
      setAdding(false);
    }
  };


  /* ==========================================================
     CARD
  =========================================================== */

  return (
    <article
      className="group card-soft overflow-hidden flex flex-col bg-background"
      data-testid={`product-card-${product.product_id}`}
    >

      {/* ======================================================
          IMAGE
      ======================================================= */}

      <Link
        to={`/product/${product.product_id}`}
        className="block"
        aria-label={`View ${product.name}`}
      >
        <div className="relative aspect-[4/3] bg-muted overflow-hidden">

          <img
            src={productImage(product.images)}
            alt={product.name}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />


          {/* BADGES */}

          <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2">

            <div className="flex flex-col gap-1.5">

              {product.featured && (
                <span className="inline-flex items-center gap-1 rounded-full bg-background/90 backdrop-blur-sm text-primary border border-border px-2.5 py-1 text-[11px] font-medium shadow-sm">
                  <BadgeCheck className="h-3 w-3" />
                  Featured
                </span>
              )}

              {product.status === "out_of_stock" && (
                <span className="inline-flex rounded-full bg-black/75 text-white backdrop-blur-sm px-2.5 py-1 text-[11px] font-medium">
                  Out of stock
                </span>
              )}

              {product.status === "discontinued" && (
                <span className="inline-flex rounded-full bg-black/75 text-white backdrop-blur-sm px-2.5 py-1 text-[11px] font-medium">
                  Discontinued
                </span>
              )}

            </div>


            {/* DISCOUNT */}

            {hasDiscount && discountPercent > 0 && (
              <span className="rounded-full bg-green-600 text-white px-2.5 py-1 text-[11px] font-semibold shadow-sm">
                {discountPercent}% OFF
              </span>
            )}

          </div>

        </div>
      </Link>


      {/* ======================================================
          PRODUCT INFORMATION
      ======================================================= */}

      <div className="p-5 flex flex-col flex-1">

        {/* CATEGORY */}

        <Link
          to={`/shop?category=${encodeURIComponent(
            product.category || ""
          )}`}
          className="overline text-muted-foreground hover:text-primary transition-colors w-fit"
        >
          {product.category || "Wellness"}
        </Link>


        {/* PRODUCT NAME */}

        <Link
          to={`/product/${product.product_id}`}
          className="mt-1"
        >
          <h3 className="font-heading font-semibold text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>


        {/* PRICE */}

        <div className="mt-4">

          <div className="flex items-baseline gap-2 flex-wrap">

            <span
              className="font-heading font-bold text-xl text-primary"
              data-testid={`product-price-${product.product_id}`}
            >
              {INR(product.price)}
            </span>

            {hasDiscount && (
              <span className="text-xs text-muted-foreground line-through">
                {INR(product.mrp)}
              </span>
            )}

          </div>

          {hasDiscount && discountAmount > 0 && (
            <p className="text-[11px] text-green-700 mt-0.5">
              Save {INR(discountAmount)}
            </p>
          )}

        </div>


        {/* BV / CC */}

        <div className="mt-2 text-[11px] text-muted-foreground">
          BV {product.bv ?? 0} · CC {product.cc ?? 0}
        </div>


        {/* ====================================================
            ACTIONS
        ===================================================== */}

        <div className="mt-5 pt-4 border-t flex items-center gap-2">

          {/* VIEW PRODUCT */}

          <Link
            to={`/product/${product.product_id}`}
            className="flex-1 inline-flex items-center justify-center gap-1.5 h-10 rounded-full border border-border text-sm font-medium hover:bg-muted transition-colors"
          >
            View Product
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>


          {/* ADD TO CART */}

          <button
            type="button"
            onClick={onAdd}
            disabled={disabled || adding}
            className="h-10 w-10 shrink-0 grid place-items-center rounded-full bg-primary text-primary-foreground hover:bg-[hsl(var(--primary-hover))] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label={
              disabled
                ? "Product unavailable"
                : `Add ${product.name} to cart`
            }
            title={
              disabled
                ? "Product unavailable"
                : "Add to cart"
            }
            data-testid={`add-to-cart-${product.product_id}`}
          >
            <ShoppingBag
              className={`h-4 w-4 ${
                adding ? "animate-pulse" : ""
              }`}
            />
          </button>

        </div>


        {/* AVAILABILITY */}

        {product.status === "active" && (
          <div className="mt-3 text-[11px] text-muted-foreground text-center">
            Available to order
          </div>
        )}

        {product.status === "out_of_stock" && (
          <div className="mt-3 text-[11px] text-red-600 text-center">
            Currently unavailable
          </div>
        )}

        {product.status === "discontinued" && (
          <div className="mt-3 text-[11px] text-muted-foreground text-center">
            No longer available
          </div>
        )}

      </div>

    </article>
  );
}
