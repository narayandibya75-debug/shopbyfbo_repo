import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  SlidersHorizontal,
  X,
  Leaf,
  ShoppingBag,
} from "lucide-react";

import { api, unwrapList } from "../lib/api";
import ProductCard from "../components/ProductCard";
import { Input } from "../components/ui/input";
import SEO from "../components/SEO";


const CATEGORIES = [
  "All",
  "Aloe Drinks",
  "Bee Products",
  "Nutrition",
  "Skincare",
  "Personal Care",
  "Weight Management",
];


export default function Shop() {
  const location = useLocation();
  const navigate = useNavigate();

  const params = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );

  const activeCat = params.get("category") || "All";
  const queryFromUrl = params.get("q") || "";

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState(queryFromUrl);
  const [loading, setLoading] = useState(true);


  /* ==========================================================
     LOAD PRODUCTS
  =========================================================== */

  useEffect(() => {
    setLoading(true);

    const requestParams = {};

    if (activeCat !== "All") {
      requestParams.category = activeCat;
    }

    if (queryFromUrl) {
      requestParams.q = queryFromUrl;
    }

    api
      .get("/products", { params: requestParams })
      .then((response) => {
        setProducts(unwrapList(response.data));
      })
      .catch(() => {
        setProducts([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [activeCat, queryFromUrl]);


  /* ==========================================================
     KEEP SEARCH INPUT IN SYNC WITH URL
  =========================================================== */

  useEffect(() => {
    setSearch(queryFromUrl);
  }, [queryFromUrl]);


  /* ==========================================================
     CATEGORY
  =========================================================== */

  const setCategory = (category) => {
    const sp = new URLSearchParams(location.search);

    if (category === "All") {
      sp.delete("category");
    } else {
      sp.set("category", category);
    }

    navigate(
      `/shop${sp.toString() ? `?${sp.toString()}` : ""}`
    );
  };


  /* ==========================================================
     SEARCH
  =========================================================== */

  const onSearch = (event) => {
    event.preventDefault();

    const value = search.trim();
    const sp = new URLSearchParams(location.search);

    if (value) {
      sp.set("q", value);
    } else {
      sp.delete("q");
    }

    navigate(
      `/shop${sp.toString() ? `?${sp.toString()}` : ""}`
    );
  };


  /* ==========================================================
     CLEAR SEARCH
  =========================================================== */

  const clearSearch = () => {
    const sp = new URLSearchParams(location.search);
    sp.delete("q");

    setSearch("");

    navigate(
      `/shop${sp.toString() ? `?${sp.toString()}` : ""}`
    );
  };


  /* ==========================================================
     CLEAR FILTERS
  =========================================================== */

  const clearFilters = () => {
    navigate("/shop");
    setSearch("");
  };


  const hasFilters =
    activeCat !== "All" || Boolean(queryFromUrl);


  /* ==========================================================
     PAGE TITLE
  =========================================================== */

  const pageTitle =
    activeCat !== "All"
      ? activeCat
      : queryFromUrl
      ? `Results for "${queryFromUrl}"`
      : "Explore Wellness";


  return (
    <>
      <SEO
        title="Shop Wellness Products | ShopVerse"
        description="Explore wellness, aloe, nutrition, skincare and personal care products at ShopVerse. Browse collections, compare products and order online."
        keywords="ShopVerse, wellness products, aloe drinks, bee products, nutrition, skincare, personal care"
        url="/shop"
      />


      <main
        className="container-ff py-7 sm:py-10"
        data-testid="shop-page"
      >


        {/* ====================================================
            PAGE HEADER
        ===================================================== */}

        <section className="mb-8">

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">

            <div>

              <div className="overline text-secondary flex items-center gap-2">
                <Leaf className="h-3.5 w-3.5" />
                ShopVerse Collection
              </div>

              <h1 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight mt-2">
                {pageTitle}
              </h1>

              <p className="text-sm sm:text-base text-muted-foreground mt-3 max-w-xl">
                Discover wellness, nutrition, skincare and personal care
                products curated for everyday life.
              </p>

            </div>


            {/* SEARCH */}

            <form
              onSubmit={onSearch}
              className="relative w-full lg:w-[360px]"
            >

              <Search className="h-4 w-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />

              <Input
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search products…"
                className="pl-11 pr-11 h-12 rounded-full bg-muted/50 border-border"
                data-testid="shop-search-input"
              />

              {search && (
                <button
                  type="button"
                  onClick={clearSearch}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full grid place-items-center hover:bg-muted transition-colors"
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              )}

            </form>

          </div>

        </section>


        {/* ====================================================
            CATEGORY FILTER
        ===================================================== */}

        <section className="mb-8">

          <div className="flex items-center gap-2 mb-3">

            <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />

            <span className="text-sm font-semibold">
              Browse by category
            </span>

          </div>


          <div
            className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide"
            data-testid="category-filter"
          >

            {CATEGORIES.map((category) => {

              const active = activeCat === category;

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setCategory(category)}
                  className={`shrink-0 px-4 py-2.5 rounded-full text-sm font-medium border transition-all ${
                    active
                      ? "bg-primary text-primary-foreground border-primary shadow-sm"
                      : "bg-background text-foreground border-border hover:border-primary hover:text-primary"
                  }`}
                  data-testid={`cat-${category
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`}
                >
                  {category}
                </button>
              );

            })}

          </div>

        </section>


        {/* ====================================================
            ACTIVE FILTER / RESULT BAR
        ===================================================== */}

        <section className="flex flex-wrap items-center justify-between gap-3 mb-6">

          <div className="flex items-center gap-2">

            <ShoppingBag className="h-4 w-4 text-muted-foreground" />

            <p className="text-sm text-muted-foreground">

              {loading
                ? "Finding products…"
                : `${products.length} product${
                    products.length === 1 ? "" : "s"
                  } found`}

            </p>

          </div>


          {hasFilters && !loading && (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
            >
              Clear filters
              <X className="h-3.5 w-3.5" />
            </button>
          )}

        </section>


        {/* ====================================================
            LOADING
        ===================================================== */}

        {loading ? (

          <div
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5"
            data-testid="products-loading"
          >

            {Array.from({ length: 8 }).map((_, index) => (

              <div
                key={index}
                className="rounded-3xl border overflow-hidden bg-background"
              >

                <div className="aspect-[4/3] bg-muted animate-pulse" />

                <div className="p-5 space-y-3">

                  <div className="h-3 w-20 bg-muted rounded animate-pulse" />

                  <div className="h-5 w-4/5 bg-muted rounded animate-pulse" />

                  <div className="h-5 w-24 bg-muted rounded animate-pulse" />

                  <div className="h-10 w-full bg-muted rounded-full animate-pulse" />

                </div>

              </div>

            ))}

          </div>


        ) : products.length === 0 ? (

          /* ==================================================
             EMPTY STATE
          =================================================== */

          <section className="py-20 sm:py-24 text-center">

            <div className="mx-auto h-16 w-16 rounded-3xl bg-muted flex items-center justify-center">

              <Search className="h-7 w-7 text-muted-foreground" />

            </div>

            <h2 className="font-heading font-semibold text-2xl sm:text-3xl mt-6">
              No products found
            </h2>

            <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
              We couldn't find products matching your current
              search or category. Try another search or browse
              the full collection.
            </p>

            <button
              type="button"
              onClick={clearFilters}
              className="btn-primary mt-6 inline-flex"
            >
              View All Products
              <ArrowLeft className="h-4 w-4 rotate-180" />
            </button>

          </section>


        ) : (

          /* ==================================================
             PRODUCT GRID
          =================================================== */

          <div
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5"
            data-testid="products-grid"
          >

            {products.map((product) => (
              <ProductCard
                key={product.product_id}
                product={product}
              />
            ))}

          </div>

        )}


        {/* ====================================================
            BOTTOM TRUST MESSAGE
        ===================================================== */}

        {!loading && products.length > 0 && (

          <section className="mt-14 sm:mt-18">

            <div className="rounded-3xl border bg-muted/30 p-6 sm:p-8">

              <div className="grid sm:grid-cols-3 gap-6 text-center sm:text-left">

                <div>

                  <div className="font-heading font-semibold text-sm">
                    Authentic Products
                  </div>

                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    Products are supplied through registered
                    distribution channels.
                  </p>

                </div>


                <div>

                  <div className="font-heading font-semibold text-sm">
                    Clear Information
                  </div>

                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    Browse product details, pricing and available
                    product values before ordering.
                  </p>

                </div>


                <div>

                  <div className="font-heading font-semibold text-sm">
                    Personal Support
                  </div>

                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    Have questions? Contact us before placing
                    your order.
                  </p>

                </div>

              </div>

            </div>

          </section>

        )}

      </main>
    </>
  );
}
