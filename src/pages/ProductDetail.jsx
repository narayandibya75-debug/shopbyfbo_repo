import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  Leaf as IoLeaf,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Truck,
  MessageCircle,
  PackageCheck,
} from "lucide-react";
import { toast } from "sonner";

import { api, INR, productImage } from "../lib/api";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import SEO from "../components/SEO";


/* ============================================================
   PRODUCT DESCRIPTION
============================================================ */

function ProductDescription({ text }) {
  if (!text) {
    return (
      <p className="text-sm text-muted-foreground leading-relaxed">
        Product information will be available soon.
      </p>
    );
  }

  const parts = text.split(/\*\*(.*?)\*\*/g);

  if (parts.length <= 1) {
    return (
      <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
        {text}
      </p>
    );
  }

  const elements = [];

  parts.forEach((part, index) => {
    if (!part?.trim()) return;

    if (index % 2 === 1) {
      elements.push(
        <h3
          key={`heading-${index}`}
          className="font-heading font-semibold text-sm text-foreground pt-3 first:pt-0"
        >
          {part.trim()}
        </h3>
      );
    } else {
      elements.push(
        <p
          key={`text-${index}`}
          className="text-sm text-muted-foreground leading-relaxed"
        >
          {part.trim()}
        </p>
      );
    }
  });

  return <div className="space-y-2">{elements}</div>;
}


/* ============================================================
   INFO CARD
============================================================ */

function InfoCard({ icon: Icon, title, text }) {
  return (
    <div className="rounded-2xl border bg-background p-4">
      <Icon className="h-5 w-5 text-primary mb-3" />

      <p className="font-heading font-semibold text-sm">
        {title}
      </p>

      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
        {text}
      </p>
    </div>
  );
}


/* ============================================================
   PRODUCT DETAIL
============================================================ */

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [descriptionOpen, setDescriptionOpen] = useState(true);
  const [buyingInfoOpen, setBuyingInfoOpen] = useState(false);
  const [adding, setAdding] = useState(false);

  const { add } = useCart();
  const { user } = useAuth();


  /* ==========================================================
     LOAD PRODUCT
  =========================================================== */

  useEffect(() => {
    let mounted = true;

    setProduct(null);
    setActiveImage(0);
    setQty(1);

    api
      .get(`/products/${id}`)
      .then((response) => {
        if (mounted) {
          setProduct(response.data);
        }
      })
      .catch(() => {
        if (mounted) {
          setProduct(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [id]);


  /* ==========================================================
     LOADING
  =========================================================== */

  if (product === null) {
    return (
      <main className="container-ff py-24 text-center">
        <div className="mx-auto h-10 w-10 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />

        <p className="mt-5 text-sm text-muted-foreground">
          Loading product…
        </p>
      </main>
    );
  }


  /* ==========================================================
     NOT FOUND
  =========================================================== */

  if (product === false) {
    return (
      <main className="container-ff py-24 text-center">

        <div className="mx-auto h-14 w-14 rounded-2xl bg-muted flex items-center justify-center">
          <ShoppingBag className="h-6 w-6 text-muted-foreground" />
        </div>

        <h1 className="font-heading font-semibold text-2xl mt-5">
          Product not found
        </h1>

        <p className="text-sm text-muted-foreground mt-2">
          This product may no longer be available.
        </p>

        <Link
          to="/shop"
          className="btn-primary mt-6 inline-flex"
        >
          Continue Shopping
          <ArrowRight className="h-4 w-4" />
        </Link>

      </main>
    );
  }


  /* ==========================================================
     PRODUCT DATA
  =========================================================== */

  const disabled = product.status !== "active";

  const images =
    product.images && product.images.length > 0
      ? product.images
      : [""];

  const currentImage =
    images[activeImage] || images[0] || "";

  const productDescription =
    product.description || "";

  const productSeoDescription =
    productDescription
      .replace(/\*\*/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .substring(0, 160) ||
    `Explore ${product.name} at ShopVerse.`;


  /* ==========================================================
     ADD TO CART
  =========================================================== */

  const addToCart = async () => {
    if (!user) {
      toast("Please login to continue");
      navigate(`/login?redirect=/product/${id}`);
      return false;
    }

    if (disabled) {
      toast.error("This product is currently unavailable.");
      return false;
    }

    try {
      setAdding(true);

      await add(product.product_id, qty);

      toast.success(
        `${product.name} × ${qty} added to cart`
      );

      return true;
    } catch (error) {
      toast.error(
        error?.response?.data?.detail ||
          "Unable to add this product to your cart."
      );

      return false;
    } finally {
      setAdding(false);
    }
  };


  /* ==========================================================
     BUY NOW
  =========================================================== */

  const buyNow = async () => {
    if (!user) {
      navigate(`/login?redirect=/product/${id}`);
      return;
    }

    const added = await addToCart();

    if (added) {
      navigate("/checkout");
    }
  };


  /* ==========================================================
     STATUS
  =========================================================== */

  const statusLabel = {
    active: "Available",
    out_of_stock: "Out of stock",
    discontinued: "Discontinued",
  };

  const statusText =
    statusLabel[product.status] || "Unavailable";


  return (
    <>
      <SEO
        title={`${product.name} | ShopVerse`}
        description={productSeoDescription}
        keywords={`${product.name}, ${product.category || "wellness products"}, ShopVerse`}
        url={`/product/${id}`}
        image={product.images?.[0]}
      />


      <main
        className="container-ff py-7 sm:py-10"
        data-testid="product-detail-page"
      >

        {/* ======================================================
            BACK TO SHOP
        ======================================================= */}

        <div className="mb-6">

          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to shop
          </Link>

        </div>


        {/* ======================================================
            PRODUCT
        ======================================================= */}

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-14 items-start">


          {/* ====================================================
              IMAGE GALLERY
          ===================================================== */}

          <div className="lg:sticky lg:top-6">

            <div className="relative aspect-square bg-muted rounded-[2rem] overflow-hidden">

              <img
                src={productImage([currentImage])}
                alt={product.name}
                className="w-full h-full object-cover"
                data-testid="product-main-image"
              />

              {product.status === "out_of_stock" && (
                <div className="absolute top-4 left-4">
                  <span className="rounded-full bg-black/75 text-white px-4 py-2 text-xs font-medium backdrop-blur-sm">
                    Out of stock
                  </span>
                </div>
              )}

            </div>


            {/* THUMBNAILS */}

            {images.length > 1 && (

              <div className="mt-4 flex gap-3 overflow-x-auto pb-1">

                {images.map((image, index) => (

                  <button
                    key={`${image}-${index}`}
                    type="button"
                    onClick={() => setActiveImage(index)}
                    aria-label={`View product image ${index + 1}`}
                    className={`h-20 w-20 shrink-0 rounded-xl overflow-hidden border-2 transition ${
                      activeImage === index
                        ? "border-primary"
                        : "border-transparent bg-muted"
                    }`}
                  >

                    <img
                      src={productImage([image])}
                      alt=""
                      className="w-full h-full object-cover"
                    />

                  </button>

                ))}

              </div>

            )}

          </div>


          {/* ====================================================
              PRODUCT INFORMATION
          ===================================================== */}

          <div>


            {/* CATEGORY */}

            <div className="flex flex-wrap items-center gap-2">

              {product.category && (
                <div className="overline text-secondary">
                  {product.category}
                </div>
              )}

              {product.status && (
                <span
                  className={`text-xs rounded-full px-3 py-1 ${
                    product.status === "active"
                      ? "bg-green-50 text-green-700"
                      : product.status === "out_of_stock"
                      ? "bg-red-50 text-red-700"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {statusText}
                </span>
              )}

            </div>


            {/* NAME */}

            <h1 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight mt-3 leading-tight">
              {product.name}
            </h1>


            {product.sku && (
              <p className="text-xs text-muted-foreground mt-2">
                SKU: {product.sku}
              </p>
            )}


            {/* PRICE */}

            <div className="mt-6 flex items-end gap-3 flex-wrap">

              <span
                className="font-heading font-bold text-3xl sm:text-4xl text-primary"
                data-testid="product-detail-price"
              >
                {INR(product.price)}
              </span>

              {product.mrp > product.price && (
                <>
                  <span className="text-base line-through text-muted-foreground">
                    {INR(product.mrp)}
                  </span>

                  <span className="rounded-full bg-green-50 text-green-700 px-3 py-1 text-xs font-semibold">
                    Save {INR(product.mrp - product.price)}
                  </span>
                </>
              )}

            </div>


            {/* SHORT DESCRIPTION */}

            {productDescription && (
              <div className="mt-5 text-sm text-muted-foreground leading-relaxed">
                <ProductDescription text={productDescription} />
              </div>
            )}


            {/* VALUE INFORMATION */}

            <div className="mt-5 flex flex-wrap gap-2">

              <span className="rounded-full bg-primary/10 text-primary px-3 py-1.5 text-xs font-medium">
                BV {product.bv ?? 0}
              </span>

              <span className="rounded-full bg-secondary/10 text-secondary px-3 py-1.5 text-xs font-medium">
                CC {product.cc ?? 0}
              </span>

            </div>


            {/* =================================================
                BUY AREA
            ================================================== */}

            {!disabled ? (

              <div className="mt-7 rounded-3xl border bg-background p-5 sm:p-6">

                <div className="flex flex-col sm:flex-row gap-3">

                  {/* QUANTITY */}

                  <div className="inline-flex items-center justify-between rounded-full border border-border h-12 sm:w-32">

                    <button
                      type="button"
                      onClick={() =>
                        setQty(Math.max(1, qty - 1))
                      }
                      className="h-12 w-11 grid place-items-center hover:bg-muted rounded-l-full"
                      aria-label="Decrease quantity"
                      data-testid="qty-dec"
                    >
                      <Minus className="h-4 w-4" />
                    </button>

                    <span
                      className="font-medium"
                      data-testid="qty-value"
                    >
                      {qty}
                    </span>

                    <button
                      type="button"
                      onClick={() => setQty(qty + 1)}
                      className="h-12 w-11 grid place-items-center hover:bg-muted rounded-r-full"
                      aria-label="Increase quantity"
                      data-testid="qty-inc"
                    >
                      <Plus className="h-4 w-4" />
                    </button>

                  </div>


                  {/* ADD TO CART */}

                  <button
                    type="button"
                    onClick={addToCart}
                    disabled={adding}
                    className="btn-outline flex-1 justify-center"
                    data-testid="add-to-cart-btn"
                  >
                    <ShoppingBag className="h-4 w-4" />

                    {adding
                      ? "Adding…"
                      : "Add to Cart"}
                  </button>


                  {/* BUY NOW */}

                  <button
                    type="button"
                    onClick={buyNow}
                    disabled={adding}
                    className="btn-primary flex-1 justify-center"
                    data-testid="buy-now-btn"
                  >
                    Buy Now
                    <ArrowRight className="h-4 w-4" />
                  </button>

                </div>


                <p className="text-xs text-muted-foreground text-center mt-4">
                  Secure checkout • Clear pricing • Easy ordering
                </p>

              </div>

            ) : (

              <div className="mt-7 rounded-3xl border border-border bg-muted/30 p-6">

                <div className="flex items-start gap-3">

                  <PackageCheck className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />

                  <div>

                    <p className="font-semibold text-sm">
                      {statusText}
                    </p>

                    <p className="text-xs text-muted-foreground mt-1">
                      This product is not currently available for
                      online purchase.
                    </p>

                  </div>

                </div>

              </div>

            )}


            {/* =================================================
                SHOPPING INFORMATION
            ================================================== */}

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">

              <InfoCard
                icon={ShieldCheck}
                title="Authentic Supply"
                text="Products are supplied through registered channels."
              />

              <InfoCard
                icon={Truck}
                title="Delivery Options"
                text="Available delivery options are shown during ordering."
              />

              <InfoCard
                icon={MessageCircle}
                title="Need Help?"
                text="Contact us if you have questions before ordering."
              />

            </div>


            {/* =================================================
                PRODUCT INFORMATION ACCORDION
            ================================================== */}

            <div className="mt-6 border rounded-2xl overflow-hidden">

              {/* DESCRIPTION */}

              <div className="border-b">

                <button
                  type="button"
                  onClick={() =>
                    setDescriptionOpen(!descriptionOpen)
                  }
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-muted/40 transition-colors"
                  aria-expanded={descriptionOpen}
                >

                  <span className="font-heading font-semibold text-sm">
                    Product Information
                  </span>

                  <ChevronDown
                    className={`h-4 w-4 text-muted-foreground transition-transform ${
                      descriptionOpen
                        ? "rotate-180"
                        : ""
                    }`}
                  />

                </button>


                {descriptionOpen && (

                  <div className="px-5 pb-5">

                    <ProductDescription
                      text={product.description}
                    />

                  </div>

                )}

              </div>


              {/* BUYING INFORMATION */}

              <div>

                <button
                  type="button"
                  onClick={() =>
                    setBuyingInfoOpen(!buyingInfoOpen)
                  }
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-muted/40 transition-colors"
                  aria-expanded={buyingInfoOpen}
                >

                  <span className="font-heading font-semibold text-sm">
                    Ordering & Product Values
                  </span>

                  <ChevronDown
                    className={`h-4 w-4 text-muted-foreground transition-transform ${
                      buyingInfoOpen
                        ? "rotate-180"
                        : ""
                    }`}
                  />

                </button>


                {buyingInfoOpen && (

                  <div className="px-5 pb-5 space-y-3">

                    <div className="flex items-center justify-between text-sm">

                      <span className="text-muted-foreground">
                        Retail price
                      </span>

                      <span className="font-semibold">
                        {INR(product.price)}
                      </span>

                    </div>


                    <div className="flex items-center justify-between text-sm">

                      <span className="text-muted-foreground">
                        BV
                      </span>

                      <span className="font-medium">
                        {product.bv ?? 0}
                      </span>

                    </div>


                    <div className="flex items-center justify-between text-sm">

                      <span className="text-muted-foreground">
                        CC
                      </span>

                      <span className="font-medium">
                        {product.cc ?? 0}
                      </span>

                    </div>


                    <p className="text-xs text-muted-foreground leading-relaxed pt-2">
                      Product values are displayed for transparency
                      and may be relevant to the Forever Business
                      Owner ordering structure.
                    </p>

                  </div>

                )}

              </div>

            </div>


            {/* =================================================
                FBO DISCLOSURE
            ================================================== */}

            <div className="mt-6 rounded-2xl bg-muted/40 border p-5">

              <div className="flex items-start gap-3">

                <IoLeaf className="h-5 w-5 text-primary shrink-0 mt-0.5" />

                <div>

                  <p className="font-semibold text-sm text-foreground">
                    Independent storefront
                  </p>

                  <p className="text-xs text-muted-foreground leading-relaxed mt-1.5">
                    ShopVerse is operated by an Independent Forever
                    Business Owner and is separate from Forever
                    Living corporate offices. Products are sold in
                    accordance with applicable Forever guidelines.
                  </p>

                </div>

              </div>

            </div>


            {/* =================================================
                CONTACT CTA
            ================================================== */}

            <div className="mt-6 flex flex-wrap items-center justify-between gap-4">

              <div>

                <p className="font-heading font-semibold text-sm">
                  Have a question about this product?
                </p>

                <p className="text-xs text-muted-foreground mt-1">
                  We're happy to help before you place your order.
                </p>

              </div>

              <Link
                to="/contact"
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
              >
                Contact Us
                <ArrowRight className="h-4 w-4" />
              </Link>

            </div>

          </div>

        </div>


        {/* ======================================================
            BOTTOM SHOPPING NOTE
        ======================================================= */}

        <div className="mt-14 pt-8 border-t">

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">

            <div className="flex items-start gap-3">

              <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />

              <div>

                <p className="font-heading font-semibold text-sm">
                  Shop with confidence
                </p>

                <p className="text-xs text-muted-foreground mt-1">
                  Clear information, transparent pricing and
                  personal support when you need it.
                </p>

              </div>

            </div>

            <Link
              to="/shop"
              className="text-sm font-semibold text-primary hover:underline inline-flex items-center gap-1"
            >
              Continue Shopping
              <ArrowRight className="h-4 w-4" />
            </Link>

          </div>

        </div>

      </main>
    </>
  );
}
