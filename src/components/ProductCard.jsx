import React from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, BadgeCheck } from "lucide-react";
import { INR, productImage } from "../lib/api";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function ProductCard({ product }) {
  const { add } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const disabled = product.status !== "active";
  const onAdd = async (e) => {
    e.preventDefault();
    if (!user) {
      toast("Please login to add to cart");
      navigate("/login");
      return;
    }
    try {
      await add(product.product_id, 1);
      toast.success(`${product.name} added to cart`);
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Could not add to cart");
    }
  };

  return (
    <Link
      to={`/product/${product.product_id}`}
      className="group card-soft overflow-hidden flex flex-col"
      data-testid={`product-card-${product.product_id}`}
    >
      <div className="relative aspect-[4/3] bg-muted overflow-hidden">
        <img
          src={productImage(product.images)}
          alt={product.name}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {product.featured && (
            <span className="chip bg-secondary/10 text-secondary-foreground border border-secondary/30 !text-secondary">
              <BadgeCheck className="h-3 w-3" /> Featured
            </span>
          )}
          {product.status === "out_of_stock" && (
            <span className="chip bg-red-50 text-red-700 border border-red-100">Out of stock</span>
          )}
          {product.status === "discontinued" && (
            <span className="chip bg-stone-100 text-stone-700 border border-stone-200">Discontinued</span>
          )}
        </div>
      </div>
      <div className="p-5 flex flex-col gap-2 flex-1">
        <div className="overline text-muted-foreground">{product.category}</div>
        <h3 className="font-heading font-semibold text-lg leading-tight line-clamp-2">{product.name}</h3>
        <div className="mt-auto pt-2 flex items-end justify-between">
          <div>
            <div className="font-heading font-bold text-xl text-primary" data-testid={`product-price-${product.product_id}`}>
              {INR(product.price)}
            </div>
            <div className="text-[11px] text-muted-foreground">
              BV {product.bv ?? 0} · CC {product.cc ?? 0}
            </div>
          </div>
          <button
            onClick={onAdd}
            disabled={disabled}
            className="h-10 w-10 grid place-items-center rounded-full bg-primary text-primary-foreground hover:bg-[hsl(var(--primary-hover))] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Add to cart"
            data-testid={`add-to-cart-${product.product_id}`}
          >
            <ShoppingBag className="h-4 w-4" />
          </button>
        </div>
      </div>
    </Link>
  );
}
