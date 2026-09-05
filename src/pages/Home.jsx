import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Heart,
  Leaf,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Star,
  Truck,
} from "lucide-react";

import { api, unwrapList } from "../lib/api";
import ProductCard from "../components/ProductCard";
import SEO from "../components/SEO";

const HERO_IMG =
  "https://plus.unsplash.com/premium_photo-1688045553706-e2c642bfa410?q=80&w=1200&auto=format&fit=crop";

const CATS = [
  {
    name: "Aloe Drinks",
    subtitle: "Everyday wellness essentials",
    img: "https://plus.unsplash.com/premium_photo-1675445165728-89144df9a225?q=80&w=1000&auto=format&fit=crop",
  },
  {
    name: "Bee Products",
    subtitle: "Nature-inspired favorites",
    img: "https://plus.unsplash.com/premium_photo-1691095182210-a1b3c46a31d6?q=80&w=1000&auto=format&fit=crop",
  },
  {
    name: "Nutrition",
    subtitle: "Simple daily nutrition",
    img: "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?q=80&w=1000&auto=format&fit=crop",
  },
  {
    name: "Skincare",
    subtitle: "Nourishing personal care",
    img: "https://plus.unsplash.com/premium_photo-1679750866883-b1c549f65da9?q=80&w=1000&auto=format&fit=crop",
  },
  {
    name: "Personal Care",
    subtitle: "Daily care made simple",
    img: "https://images.unsplash.com/photo-1533093818119-ac1fa47a6d59?q=80&w=1000&auto=format&fit=crop",
  },
  {
    name: "Weight Management",
    subtitle: "Lifestyle-focused options",
    img: "https://images.unsplash.com/photo-1646829873498-e874cfa27933?q=80&w=1200&auto=format&fit=crop",
  },
];

const NEEDS = [
  {
    title: "Daily Wellness",
    description:
      "Explore products that can fit naturally into your everyday routine.",
    category: "Aloe Drinks",
    icon: Leaf,
  },
  {
    title: "Nutrition",
    description:
      "Discover convenient nutrition-focused options for your lifestyle.",
    category: "Nutrition",
    icon: Sparkles,
  },
  {
    title: "Skin & Personal Care",
    description:
      "Explore simple, nourishing choices for your daily care routine.",
    category: "Skincare",
    icon: Heart,
  },
];

const BENEFITS = [
  {
    icon: ShieldCheck,
    title: "Authentic Products",
    text: "Products supplied through registered channels with original packaging.",
  },
  {
    icon: Truck,
    title: "Convenient Delivery",
    text: "Easy online ordering with delivery options for your location.",
  },
  {
    icon: Sparkles,
    title: "Clear Information",
    text: "Product details, pricing and available product information are clearly presented.",
  },
  {
    icon: MessageCircle,
    title: "Personal Guidance",
    text: "Need help choosing? Reach out before placing your order.",
  },
];

const FAQS = [
  {
    question: "Are the products authentic?",
    answer:
      "Products are supplied through registered channels and provided in original manufacturer packaging. Packaging and product details may vary by item.",
  },
  {
    question: "How do I choose the right product?",
    answer:
      "You can browse our categories and featured products. If you're unsure where to start, contact us for product guidance before ordering.",
  },
  {
    question: "Where do you deliver?",
    answer:
      "Delivery availability and timing depend on your location and the selected product. Delivery details are shown during the ordering process.",
  },
  {
    question: "Can I ask questions before ordering?",
    answer:
      "Yes. If you have questions about a product or need help deciding where to start, you can contact us before placing your order.",
  },
];

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    api
      .get("/products", {
        params: {
          featured: true,
          limit: 8,
        },
      })
      .then((response) => {
        setFeatured(unwrapList(response.data));
      })
      .catch(() => {
        setFeatured([]);
      });
  }, []);

  return (
    <>
      <SEO
        title="ShopVerse | Wellness Products Curated for Your Lifestyle"
        description="Discover authentic wellness, nutrition, aloe, skincare and personal care products at ShopVerse. Browse our collection and order online with confidence."
        keywords="wellness products, aloe vera products, nutrition, skincare, personal care, ShopVerse"
        url="/"
      />

      <main data-testid="home-page">

        {/* =====================================================
            HERO
        ====================================================== */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 -z-10 grain" />

          <div className="container-ff py-14 sm:py-20 lg:py-24 grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">

            <div className="lg:col-span-7 animate-fade-up">

              <div className="overline text-secondary mb-4 flex items-center gap-2">
                <Leaf className="h-3.5 w-3.5" />
                Wellness • Lifestyle • Better Choices
              </div>

              <h1 className="font-heading font-bold text-4xl sm:text-5xl lg:text-6xl xl:text-7xl tracking-tight leading-[1.03]">
                Wellness products,
                <br />
                <span className="text-primary">
                  curated for you.
                </span>
              </h1>

              <p className="mt-6 text-base sm:text-lg text-muted-foreground max-w-xl leading-relaxed">
                Discover authentic wellness, nutrition, skincare and
                personal care products selected to fit beautifully into
                your everyday lifestyle.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">

                <Link
                  to="/shop"
                  className="btn-primary"
                  data-testid="hero-shop-btn"
                >
                  Shop Now
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  to="/shop"
                  className="btn-outline"
                  data-testid="hero-explore-btn"
                >
                  Explore Products
                </Link>

              </div>

              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted-foreground">

                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  Authentic products
                </div>

                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  Easy ordering
                </div>

                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  Delivery options
                </div>

              </div>

            </div>

            <div className="lg:col-span-5 relative">

              <div
                className="absolute -inset-5 bg-secondary/10 rounded-[3rem] rotate-3"
                aria-hidden="true"
              />

              <div className="relative overflow-hidden rounded-[2.5rem] shadow-2xl">

                <img
                  src={HERO_IMG}
                  alt="Natural wellness and botanical lifestyle"
                  className="w-full aspect-[4/5] object-cover"
                />

                <div className="absolute bottom-5 left-5 right-5">

                  <div className="rounded-2xl bg-white/90 backdrop-blur-md p-4 shadow-lg">

                    <div className="flex items-center gap-3">

                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Leaf className="h-5 w-5 text-primary" />
                      </div>

                      <div>
                        <p className="font-heading font-semibold text-sm">
                          Simple wellness choices
                        </p>

                        <p className="text-xs text-muted-foreground mt-0.5">
                          Explore • Choose • Order
                        </p>
                      </div>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>
        </section>


        {/* =====================================================
            TRUST BAR
        ====================================================== */}
        <section className="border-y bg-muted/30">

          <div className="container-ff py-5">

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-8">

              {[
                {
                  icon: ShieldCheck,
                  title: "Authentic Supply",
                  text: "Original products",
                },
                {
                  icon: Truck,
                  title: "Easy Delivery",
                  text: "Convenient ordering",
                },
                {
                  icon: Sparkles,
                  title: "Clear Details",
                  text: "Transparent information",
                },
                {
                  icon: MessageCircle,
                  title: "Need Help?",
                  text: "Ask before ordering",
                },
              ].map((item) => {

                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="flex items-center gap-3"
                  >

                    <div className="h-10 w-10 shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                      <Icon className="h-4.5 w-4.5 text-primary" />
                    </div>

                    <div>
                      <p className="font-medium text-sm">
                        {item.title}
                      </p>

                      <p className="text-xs text-muted-foreground mt-0.5">
                        {item.text}
                      </p>
                    </div>

                  </div>
                );
              })}

            </div>

          </div>

        </section>


        {/* =====================================================
            BEST SELLERS
        ====================================================== */}
        <section className="container-ff py-14 sm:py-18 lg:py-20">

          <div className="flex items-end justify-between gap-6 mb-7">

            <div>

              <div className="overline text-secondary">
                Popular right now
              </div>

              <h2 className="font-heading font-semibold text-2xl sm:text-3xl lg:text-4xl mt-1">
                Best Sellers
              </h2>

              <p className="text-sm text-muted-foreground mt-2 max-w-lg">
                Explore some of the products customers are discovering
                on ShopVerse.
              </p>

            </div>

            <Link
              to="/shop"
              className="hidden sm:flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              Shop all
              <ArrowRight className="h-4 w-4" />
            </Link>

          </div>


          {featured.length === 0 ? (

            <div className="rounded-2xl border bg-muted/20 py-16 text-center text-muted-foreground">

              <Sparkles className="h-6 w-6 mx-auto mb-3 opacity-60" />

              <p>
                Featured products are loading…
              </p>

            </div>

          ) : (

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">

              {featured.slice(0, 8).map((product) => (
                <ProductCard
                  key={product.product_id}
                  product={product}
                />
              ))}

            </div>

          )}


          <div className="mt-7 sm:hidden">

            <Link
              to="/shop"
              className="w-full btn-outline justify-center"
            >
              View All Products
              <ArrowRight className="h-4 w-4" />
            </Link>

          </div>

        </section>


        {/* =====================================================
            SHOP BY NEED
        ====================================================== */}
        <section className="bg-muted/30">

          <div className="container-ff py-14 sm:py-18 lg:py-20">

            <div className="max-w-2xl mb-8">

              <div className="overline text-secondary">
                Find your starting point
              </div>

              <h2 className="font-heading font-semibold text-2xl sm:text-3xl lg:text-4xl mt-1">
                What are you looking for?
              </h2>

              <p className="mt-3 text-muted-foreground">
                Start with a collection that matches your lifestyle
                and explore products at your own pace.
              </p>

            </div>


            <div className="grid md:grid-cols-3 gap-5">

              {NEEDS.map((item) => {

                const Icon = item.icon;

                return (
                  <Link
                    key={item.title}
                    to={`/shop?category=${encodeURIComponent(
                      item.category
                    )}`}
                    className="group rounded-3xl bg-background border p-6 sm:p-7 hover:shadow-lg transition-all duration-300"
                  >

                    <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>

                    <h3 className="font-heading font-semibold text-xl">
                      {item.title}
                    </h3>

                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>

                    <div className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary">

                      Explore collection

                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />

                    </div>

                  </Link>
                );

              })}

            </div>

          </div>

        </section>


        {/* =====================================================
            CATEGORIES
        ====================================================== */}
        <section className="container-ff py-14 sm:py-18 lg:py-20">

          <div className="flex items-end justify-between mb-7">

            <div>

              <div className="overline text-muted-foreground">
                Shop by category
              </div>

              <h2 className="font-heading font-semibold text-2xl sm:text-3xl lg:text-4xl mt-1">
                Explore Collections
              </h2>

            </div>

            <Link
              to="/shop"
              className="hidden sm:flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>

          </div>


          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">

            {CATS.map((category) => (

              <Link
                key={category.name}
                to={`/shop?category=${encodeURIComponent(
                  category.name
                )}`}
                className="group relative rounded-2xl overflow-hidden aspect-[4/5] bg-muted shadow-sm hover:shadow-xl transition-shadow"
                data-testid={`category-card-${category.name
                  .toLowerCase()
                  .replace(/\s+/g, "-")}`}
              >

                <img
                  src={category.img}
                  alt={category.name}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover group-hover:scale-110 transition-transform duration-700"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">

                  <div className="font-heading font-semibold text-sm sm:text-base">
                    {category.name}
                  </div>

                  <div className="text-[11px] sm:text-xs text-white/75 mt-1 leading-snug">
                    {category.subtitle}
                  </div>

                </div>

              </Link>

            ))}

          </div>

        </section>


        {/* =====================================================
            WELLNESS GUIDE
        ====================================================== */}
        <section className="container-ff pb-14 sm:pb-18 lg:pb-20">

          <div className="relative overflow-hidden rounded-[2rem] bg-primary text-primary-foreground">

            <div className="absolute inset-0 grain opacity-20" />

            <div className="relative grid lg:grid-cols-2 gap-8 lg:gap-14 items-center p-8 sm:p-10 lg:p-14">

              <div>

                <div className="overline text-secondary mb-3">
                  Your Wellness Guide
                </div>

                <h2 className="font-heading font-semibold text-3xl sm:text-4xl lg:text-5xl tracking-tight">
                  Not sure where to start?
                </h2>

                <p className="mt-5 text-sm sm:text-base text-white/80 max-w-xl leading-relaxed">
                  Choosing wellness products can feel overwhelming.
                  Browse our collections at your own pace, or reach
                  out if you'd like help finding products that fit
                  your lifestyle and preferences.
                </p>

                <div className="mt-7 flex flex-wrap gap-3">

                  <Link
                    to="/shop"
                    className="inline-flex items-center gap-2 rounded-full bg-white text-primary px-5 py-3 text-sm font-semibold hover:bg-white/90 transition-colors"
                  >
                    Start Shopping
                    <ArrowRight className="h-4 w-4" />
                  </Link>

                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 rounded-full border border-white/30 px-5 py-3 text-sm font-semibold hover:bg-white/10 transition-colors"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Ask for Help
                  </Link>

                </div>

              </div>


              <div className="grid grid-cols-2 gap-3 sm:gap-4">

                {[
                  "Browse at your pace",
                  "Clear product details",
                  "Personal guidance",
                  "Easy online ordering",
                ].map((text) => (

                  <div
                    key={text}
                    className="rounded-2xl bg-white/10 border border-white/10 p-5"
                  >

                    <Check className="h-5 w-5 text-secondary mb-3" />

                    <p className="text-sm font-medium">
                      {text}
                    </p>

                  </div>

                ))}

              </div>

            </div>

          </div>

        </section>


        {/* =====================================================
            WHY SHOPVERSE
        ====================================================== */}
        <section className="bg-muted/30">

          <div className="container-ff py-14 sm:py-18 lg:py-20">

            <div className="text-center max-w-2xl mx-auto mb-10">

              <div className="overline text-secondary">
                Why ShopVerse
              </div>

              <h2 className="font-heading font-semibold text-2xl sm:text-3xl lg:text-4xl mt-1">
                A simpler way to shop wellness
              </h2>

              <p className="mt-3 text-muted-foreground">
                We believe choosing wellness products should feel
                clear, convenient and trustworthy.
              </p>

            </div>


            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">

              {BENEFITS.map((benefit) => {

                const Icon = benefit.icon;

                return (
                  <div
                    key={benefit.title}
                    className="rounded-3xl bg-background border p-6"
                  >

                    <div className="h-11 w-11 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>

                    <h3 className="font-heading font-semibold text-lg">
                      {benefit.title}
                    </h3>

                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                      {benefit.text}
                    </p>

                  </div>
                );

              })}

            </div>

          </div>

        </section>


        {/* =====================================================
            QUALITY
        ====================================================== */}
        <section className="container-ff py-14 sm:py-18 lg:py-20">

          <div className="rounded-[2rem] overflow-hidden relative bg-primary text-primary-foreground p-8 sm:p-12 lg:p-16">

            <div className="absolute inset-0 grain opacity-25" />

            <div className="relative grid lg:grid-cols-2 gap-8 lg:gap-14 items-center">

              <div>

                <div className="overline text-secondary mb-3">
                  Quality & Transparency
                </div>

                <h2 className="font-heading font-semibold text-3xl sm:text-4xl lg:text-5xl tracking-tight">
                  Shop with confidence.
                </h2>

                <p className="mt-5 text-sm sm:text-base text-white/80 max-w-xl leading-relaxed">
                  Products are provided through registered channels
                  with original packaging and relevant product
                  information intact. Our goal is to make your online
                  shopping experience simple and transparent.
                </p>

              </div>


              <div className="space-y-3">

                {[
                  "Original product packaging",
                  "Clear product information",
                  "Transparent pricing",
                  "Registered product supply",
                ].map((item) => (

                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-2xl bg-white/10 border border-white/10 px-5 py-4"
                  >

                    <div className="h-7 w-7 rounded-full bg-white/10 flex items-center justify-center">

                      <Check className="h-4 w-4 text-secondary" />

                    </div>

                    <span className="text-sm font-medium">
                      {item}
                    </span>

                  </div>

                ))}

              </div>

            </div>

          </div>

        </section>


        {/* =====================================================
            CREATOR / INSTAGRAM
        ====================================================== */}
        <section className="container-ff pb-14 sm:pb-18 lg:pb-20">

          <div className="border rounded-[2rem] p-8 sm:p-10 lg:p-12 text-center">

            <div className="mx-auto h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">

              <Sparkles className="h-5 w-5 text-primary" />

            </div>

            <h2 className="font-heading font-semibold text-2xl sm:text-3xl mt-5">
              Follow the wellness journey
            </h2>

            <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto mt-3">
              Discover wellness, lifestyle inspiration, product
              highlights and helpful content through social media.
            </p>

            {/* Replace this URL with your actual Instagram profile */}
            <a
              href="https://www.instagram.com/s303__k/"
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center gap-2 btn-outline"
            >
              Follow on Instagram
              <ArrowRight className="h-4 w-4" />
            </a>

          </div>

        </section>


        {/* =====================================================
            FAQ
        ====================================================== */}
        <section className="bg-muted/30">

          <div className="container-ff py-14 sm:py-18 lg:py-20">

            <div className="grid lg:grid-cols-5 gap-10 lg:gap-16">

              <div className="lg:col-span-2">

                <div className="overline text-secondary">
                  Questions?
                </div>

                <h2 className="font-heading font-semibold text-2xl sm:text-3xl lg:text-4xl mt-1">
                  Frequently asked
                </h2>

                <p className="mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
                  A few quick answers to help you shop with confidence.
                </p>

                <Link
                  to="/contact"
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
                >
                  Have another question?
                  <ArrowRight className="h-4 w-4" />
                </Link>

              </div>


              <div className="lg:col-span-3">

                <div className="divide-y border rounded-2xl bg-background overflow-hidden">

                  {FAQS.map((faq, index) => {

                    const isOpen = openFaq === index;

                    return (
                      <div key={faq.question}>

                        <button
                          type="button"
                          onClick={() =>
                            setOpenFaq(
                              isOpen ? null : index
                            )
                          }
                          className="w-full flex items-center justify-between gap-5 text-left px-5 sm:px-6 py-5 hover:bg-muted/40 transition-colors"
                          aria-expanded={isOpen}
                        >

                          <span className="font-medium text-sm sm:text-base">
                            {faq.question}
                          </span>

                          <ChevronDown
                            className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${
                              isOpen ? "rotate-180" : ""
                            }`}
                          />

                        </button>


                        {isOpen && (

                          <div className="px-5 sm:px-6 pb-5">

                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {faq.answer}
                            </p>

                          </div>

                        )}

                      </div>
                    );

                  })}

                </div>

              </div>

            </div>

          </div>

        </section>


        {/* =====================================================
            FINAL CTA
        ====================================================== */}
        <section className="container-ff py-14 sm:py-18 lg:py-20">

          <div className="text-center">

            <div className="overline text-secondary">
              Your next wellness choice
            </div>

            <h2 className="font-heading font-semibold text-3xl sm:text-4xl lg:text-5xl mt-2 tracking-tight">
              Ready to explore?
            </h2>

            <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
              Find products that fit your lifestyle and start shopping
              with ShopVerse today.
            </p>

            <div className="mt-7 flex flex-wrap justify-center gap-3">

              <Link
                to="/shop"
                className="btn-primary"
              >
                Shop Now
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                to="/contact"
                className="btn-outline"
              >
                Ask Before Buying
                <MessageCircle className="h-4 w-4" />
              </Link>

            </div>

          </div>

        </section>


        {/* =====================================================
            BUSINESS DISCLOSURE
        ====================================================== */}
        <section className="border-t">

          <div className="container-ff py-7">

            <p className="text-xs text-muted-foreground text-center max-w-3xl mx-auto leading-relaxed">
              ShopVerse is an independent storefront operated by an
              Independent Forever Business Owner. Products are sold in
              accordance with applicable Forever Living guidelines.
              Product information, pricing, availability and delivery
              options may vary by product and location.
            </p>

          </div>

        </section>

      </main>
    </>
  );
}
