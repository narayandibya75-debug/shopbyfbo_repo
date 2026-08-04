import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api, INR, productImage } from "../lib/api";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { Minus, Plus, ShieldCheck, Truck, RotateCcw, Leaf as IoLeaf } from "lucide-react";
import { toast } from "sonner";
import SEO from "../components/SEO";

// Renders description with bold headings and paragraph content
// Format: "Heading: content. Another Heading: content."
function ProductDescription({ text }) {
  if (!text) return null;

  // Split by **bold** markers
  const parts = text.split(/\*\*(.*?)\*\*/g);

  if (parts.length <= 1) {
    return (
      <p className="text-sm text-muted-foreground leading-relaxed">{text}</p>
    );
  }

  const elements = [];
  parts.forEach((part, i) => {
    if (i % 2 === 1) {
      // This is a heading (inside **)
      elements.push(
        <p key={i} className="font-semibold text-foreground text-sm mt-4 mb-1">
          {part}
        </p>
      );
    } else if (part.trim()) {
      // This is content
      elements.push(
        <p key={i} className="text-sm text-muted-foreground leading-relaxed">
          {part.trim()}
        </p>
      );
    }
  });

  return <div className="space-y-1">{elements}</div>;
}

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [active, setActive] = useState(0);
  const { add } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    api.get(`/products/${id}`)
      .then((r) => { setProduct(r.data); setActive(0); })
      .catch(() => setProduct(false));
  }, [id]);

  if (product === null) return (
    <div className="container-ff py-24 text-center text-muted-foreground">
      Loading…
    </div>
  );
  if (product === false) return (
    <div className="container-ff py-24 text-center">
      Product not found.
    </div>
  );

  const disabled = product.status !== "active";
  const images = (product.images && product.images.length > 0) ? product.images : [""];

  const addToCart = async () => {
    if (!user) { toast("Please login first"); navigate("/login?redirect=/product/" + id); return; }
    try {
      await add(product.product_id, qty);
      toast.success(`${product.name} × ${qty} added to cart`);
    } catch (e) {
      toast.error(e?.response?.data?.detail || "Failed to add to cart");
    }
  };

  const buyNow = async () => {
    if (!user) { navigate("/login?redirect=/product/" + id); return; }
    await addToCart();
    navigate("/checkout");
  };

  return (
    <>
      <SEO
        title={product.name}
        description={product.description?.substring(0, 160) || `Buy ${product.name} at best price. Authentic Forever Living product with BV ${product.bv} and CC ${product.cc}.`}
        keywords={`${product.name}, forever living ${product.category}, buy ${product.name} india, aloe vera, bee products, forever nutrition`}
        url={`/product/${id}`}
        image={product.images?.[0]}
      />
      <div className="container-ff py-10" data-testid="product-detail-page">
        <div className="grid lg:grid-cols-2 gap-10">

          {/* LEFT — Images */}
          <div>
            <div className="aspect-square bg-muted rounded-3xl overflow-hidden mb-4">
              <img
                src={productImage([images[active]])}
                alt={product.name}
                className="w-full h-full object-cover"
                data-testid="product-main-image"
              />
            </div>
            {images.length > 1 && (
              <div className="flex gap-3">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActive(i)}
                    className={`h-20 w-20 rounded-xl overflow-hidden border-2 transition ${
                      active === i ? "border-primary" : "border-transparent"
                    }`}
                  >
                    <img src={productImage([img])} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT — Details */}
          <div>
            <div className="overline text-muted-foreground">{product.category}</div>
            <h1 className="font-heading font-bold text-3xl sm:text-4xl mt-2">{product.name}</h1>
            {product.sku && (
              <div className="text-xs text-muted-foreground mt-1">SKU: {product.sku}</div>
            )}

            {/* Price */}
            <div className="mt-5 flex items-baseline gap-4">
              <span className="font-heading font-bold text-3xl text-primary" data-testid="product-detail-price">
                {INR(product.price)}
              </span>
              {product.mrp > product.price && (
                <span className="text-sm line-through text-muted-foreground">{INR(product.mrp)}</span>
              )}
            </div>

            {/* Chips */}
            <div className="mt-3 flex gap-2 flex-wrap">
              <span className="chip bg-primary/10 text-primary">BV {product.bv ?? 0}</span>
              <span className="chip bg-secondary/10 text-secondary">CC {product.cc ?? 0}</span>
              {product.status === "out_of_stock" && (
                <span className="chip bg-red-50 text-red-700">Out of stock</span>
              )}
              {product.status === "discontinued" && (
                <span className="chip bg-stone-100 text-stone-700">Discontinued</span>
              )}
              {product.status === "active" && (
                <span className="chip bg-green-50 text-green-700">In stock</span>
              )}
            </div>

            {/* Quantity + Add to cart */}
            {!disabled && (
              <div className="mt-8 flex items-center gap-4 flex-wrap">
                <div className="inline-flex items-center rounded-full border border-border">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="h-11 w-11 grid place-items-center hover:bg-muted rounded-l-full"
                    aria-label="dec"
                    data-testid="qty-dec"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-4 font-medium" data-testid="qty-value">{qty}</span>
                  <button
                    onClick={() => setQty(qty + 1)}
                    className="h-11 w-11 grid place-items-center hover:bg-muted rounded-r-full"
                    aria-label="inc"
                    data-testid="qty-inc"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <button onClick={addToCart} className="btn-outline" data-testid="add-to-cart-btn">
                  Add to cart
                </button>
                <button onClick={buyNow} className="btn-primary" data-testid="buy-now-btn">
                  Buy now
                </button>
              </div>
            )}

            {/* Trust badges */}
            <div className="mt-10 grid grid-cols-3 gap-4 text-sm">
              {[
                { icon: ShieldCheck, t: "100% Authentic", s: "Sealed Forever originals" },
                { icon: Truck, t: "Ships in 24-48h", s: "Free above ₹499" },
                { icon: IoLeaf, t: "Eco Friendly", s: "Good Wellness" },
              ].map((x, i) => (
                <div key={i} className="p-4 rounded-2xl border border-border/60 bg-white">
                  <x.icon className="h-5 w-5 text-primary mb-2" />
                  <div className="font-heading font-semibold">{x.t}</div>
                  <div className="text-xs text-muted-foreground">{x.s}</div>
                </div>
              ))}
            </div>

            {/* Description - ADDED THIS SECTION */}
            <div className="mt-6 p-5 rounded-2xl bg-muted/30 border border-border/40">
              <ProductDescription text={product.description} />
            </div>

            {/* FBO note */}
            <div className="mt-6 p-5 rounded-2xl bg-muted/40 border border-border/60 flex gap-3">
              <IoLeaf className="h-5 w-5 text-primary shrink-0 mt-1" />
              <div className="text-xs text-muted-foreground leading-relaxed">
                As per Forever guidelines, this product is sold at the official MRP with BV &amp; CC values listed.
                Contact your FBO for personalised guidance.
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
                 }
