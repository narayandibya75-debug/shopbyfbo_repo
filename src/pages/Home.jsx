import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, unwrapList } from "../lib/api";
import ProductCard from "../components/ProductCard";
import { ArrowRight, Leaf, ShieldCheck, Truck, Sparkles } from "lucide-react";
import SEO from "../components/SEO";

const HERO_IMG = "https://plus.unsplash.com/premium_photo-1688045553706-e2c642bfa410?q=80&w=687&auto=format&fit=crop";

const CATS = [
  { name: "Aloe Drinks", img: "https://plus.unsplash.com/premium_photo-1675445165728-89144df9a225?q=80&w=1470&auto=format&fit=crop" },
  { name: "Bee Products", img: "https://plus.unsplash.com/premium_photo-1691095182210-a1b3c46a31d6?q=80&w=687&auto=format&fit=crop" },
  { name: "Nutrition", img: "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?q=80&w=687&auto=format&fit=crop" },
  { name: "Skincare", img: "https://plus.unsplash.com/premium_photo-1679750866883-b1c549f65da9?q=80&w=687&auto=format&fit=crop" },
  { name: "Personal Care", img: "https://images.unsplash.com/photo-1533093818119-ac1fa47a6d59?q=80&w=687&auto=format&fit=crop" },
  { name: "Weight Management", img: "https://images.unsplash.com/photo-1646829873498-e874cfa27933?q=80&w=1470&auto=format&fit=crop" },
];

export default function Home() {
  const [featured, setFeatured] = useState([]);
  useEffect(() => {
    api.get("/products", { params: { featured: true, limit: 8 } })
      .then((r) => setFeatured(unwrapList(r.data)))
      .catch(() => setFeatured([]));
  }, []);

  return (
    <>
    <SEO
      title="Authorized Wellness Shop | Independent Aloe & Nutrition Distributor"
      description="Find premium botanical supplements, fresh aloe formulations, and pure honey selections. View transparent pricing, item values, and fast tracking on all items."
      keywords="independent business owner wellness, Tulsi van Honey, Avocado Shop, Aloe lips,organic skincare choices, secure tracking wellness shop"
      url="/"
    />
    <div data-testid="home-page">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 grain" />
        <div className="container-ff py-16 lg:py-24 grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 animate-fade-up">
            <div className="overline text-secondary mb-4 flex items-center gap-2">
              <Leaf className="h-3.5 w-3.5" /> Certified Independent FBO Storefront
            </div>
            <h1 className="font-heading font-bold text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.05]">
              Pure plant power,<br />
              <span className="text-primary">curated with care.</span>
            </h1>
            <p className="mt-5 text-base lg:text-lg text-muted-foreground max-w-xl">
              Explore your favorite botanical essentials, nutrition supports, and nourishing topical creams. All orders feature verified product points and certified packaging.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/shop" className="btn-primary" data-testid="hero-shop-btn">
                Browse Collection <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/shop?category=Aloe%20Drinks" className="btn-outline" data-testid="hero-aloe-btn">
                Explore Plant Drinks
              </Link>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-4 max-w-lg">
              {[
                { icon: ShieldCheck, label: "100% Authentic Supply" },
                { icon: Truck, label: "Fast Safe Delivery Option" },
                { icon: Sparkles, label: "Full Volume Value Data" },
              ].map((f, i) => (
                <div key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                  <f.icon className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>{f.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-5 relative">
            <div className="absolute -inset-4 bg-secondary/10 rounded-[2.5rem] rotate-3" aria-hidden />
            <img
              src={HERO_IMG}
              alt="Natural plants and wellness products"
              className="relative rounded-[2rem] shadow-xl w-full h-full object-cover aspect-[4/3] animate-fade-up"
            />
          </div>
        </div>
      </section>

      {/* CATEGORY STRIP */}
      <section className="container-ff py-10">
        <div className="flex items-end justify-between mb-6">
          <div>
            <div className="overline text-muted-foreground">Shop by category</div>
            <h2 className="font-heading font-semibold text-2xl sm:text-3xl mt-1">Explore Wellness Collections</h2>
          </div>
          <Link to="/shop" className="text-sm font-medium text-primary hover:underline">View all</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATS.map((c) => (
            <Link key={c.name} to={`/shop?category=${encodeURIComponent(c.name)}`}
                  className="group relative rounded-2xl overflow-hidden aspect-[4/5] bg-muted"
                  data-testid={`category-card-${c.name.toLowerCase().replace(/\s+/g, "-")}`}>
              <img src={c.img} alt={c.name} className="absolute inset-0 h-full w-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <div className="font-heading font-semibold text-sm">{c.name}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED */}
      <section className="container-ff py-12">
        <div className="flex items-end justify-between mb-6">
          <div>
            <div className="overline text-secondary">Best Sellers</div>
            <h2 className="font-heading font-semibold text-2xl sm:text-3xl mt-1">Featured Essentials</h2>
          </div>
          <Link to="/shop" className="text-sm font-medium text-primary hover:underline">Shop all →</Link>
        </div>
        {featured.length === 0 ? (
          <div className="py-16 text-center text-muted-foreground">Loading featured products…</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {featured.map((p) => <ProductCard key={p.product_id} product={p} />)}
          </div>
        )}
      </section>

      {/* BRAND STRIP */}
      <section className="container-ff py-14">
        <div className="rounded-[2rem] overflow-hidden relative bg-primary text-primary-foreground p-8 sm:p-12 lg:p-16">
          <div className="absolute inset-0 grain opacity-30" />
          <div className="relative grid lg:grid-cols-2 gap-6 items-center">
            <div>
              <div className="overline text-secondary mb-3"> Quality Standard</div>
              <h3 className="font-heading font-semibold text-3xl sm:text-4xl tracking-tight">
                Pure Botanicals.<br />Responsibly Delivered to You.
              </h3>
            </div>
            <p className="text-sm sm:text-base text-white/80 max-w-lg lg:justify-self-end">
              Every package is fulfilled directly through registered networks containing trace numbers and original labels intact. Shop with assurance from an authorized regional advisor.
            </p>
          </div>
        </div>
      </section>
    </div>
    </>
  );
}
