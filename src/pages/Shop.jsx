import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { api, unwrapList } from "../lib/api";
import ProductCard from "../components/ProductCard";
import { Input } from "../components/ui/input";
import { Search, Filter } from "lucide-react";
import SEO from "../components/SEO";
const CATEGORIES = [
  "All", "Aloe Drinks", "Bee Products", "Personal Care", "Nutrition", "Weight Management", "Skincare",
];

export default function Shop() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const activeCat = params.get("category") || "All";
  const q = params.get("q") || "";

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState(q);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const p = {};
    if (activeCat !== "All") p.category = activeCat;
    if (q) p.q = q;
    api.get("/products", { params: p })
      .then((r) => setProducts(unwrapList(r.data)))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [activeCat, q]);

  const setCategory = (c) => {
    const sp = new URLSearchParams(location.search);
    if (c === "All") sp.delete("category");
    else sp.set("category", c);
    navigate(`/shop?${sp.toString()}`);
  };

  const onSearch = (e) => {
    e.preventDefault();
    const sp = new URLSearchParams(location.search);
    if (search) sp.set("q", search); else sp.delete("q");
    navigate(`/shop?${sp.toString()}`);
  };

  return (
    <>
    <SEO
      title="Shop Forever Living Products"
      description="Browse our full range of Forever Living products — aloe drinks, bee products, nutrition, weight management and skincare. Best prices with BV/CC transparency."
      keywords="shop forever living, buy aloe vera india, forever living shop online, bee propolis india, forever nutrition supplements"
      url="/shop"
    />
    <div className="container-ff py-10" data-testid="shop-page">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-8">
        <div>
          <div className="overline text-muted-foreground">Shop</div>
          <h1 className="font-heading font-semibold text-3xl sm:text-4xl mt-1">
            {activeCat === "All" ? "All Forever products" : activeCat}
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            {loading ? "Loading…" : `${products.length} product${products.length === 1 ? "" : "s"}`}
          </p>
        </div>
        <form onSubmit={onSearch} className="relative w-full lg:w-80">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products"
            className="pl-9 rounded-full bg-muted/60"
            data-testid="shop-search-input"
          />
        </form>
      </div>

      <div className="mb-8 flex flex-wrap gap-2" data-testid="category-filter">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
              activeCat === c
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-white text-foreground border-border hover:border-primary hover:text-primary"
            }`}
            data-testid={`cat-${c.toLowerCase().replace(/\s+/g, "-")}`}
          >
            {c}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-[4/5] rounded-2xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <Filter className="h-10 w-10 mx-auto mb-3" />
          <p>No products match your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5" data-testid="products-grid">
          {products.map((p) => <ProductCard key={p.product_id} product={p} />)}
        </div>
      )}
    </div>
    </>
  );
}
