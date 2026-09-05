import React from "react";
import {
  ArrowRight,
  Check,
  Heart,
  Leaf,
  MessageCircle,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";

const VALUES = [
  {
    icon: Leaf,
    title: "Wellness First",
    text: "We make it easier to discover wellness products that can fit naturally into everyday life.",
  },
  {
    icon: ShieldCheck,
    title: "Authenticity Matters",
    text: "We focus on genuine products supplied through registered channels and provided in original packaging.",
  },
  {
    icon: Sparkles,
    title: "Simple Choices",
    text: "Clear product information helps you explore, compare and choose with confidence.",
  },
  {
    icon: MessageCircle,
    title: "Personal Support",
    text: "Have a question? You can reach out before ordering and get help understanding your options.",
  },
];

const PROMISES = [
  "Original manufacturer packaging",
  "Clear product information",
  "Transparent pricing",
  "Convenient online ordering",
  "Personal customer support",
];

export default function About() {
  return (
    <>
      <SEO
        title="About ShopVerse | Wellness Products & Personal Guidance"
        description="Learn about ShopVerse, an independent wellness storefront focused on authentic products, clear information and a simple online shopping experience."
        keywords="ShopVerse, wellness store, wellness products, aloe vera, nutrition, skincare, personal care"
        url="/about"
      />

      <main data-testid="about-page">

        {/* =====================================================
            HERO
        ====================================================== */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 -z-10 grain" />

          <div className="container-ff py-14 sm:py-20 lg:py-24">
            <div className="max-w-4xl">

              <div className="overline text-secondary mb-4 flex items-center gap-2">
                <Leaf className="h-3.5 w-3.5" />
                About ShopVerse
              </div>

              <h1 className="font-heading font-bold text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.05]">
                Wellness made
                <br />
                <span className="text-primary">
                  simpler to explore.
                </span>
              </h1>

              <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl leading-relaxed">
                ShopVerse is a wellness-focused online storefront created
                to make discovering trusted wellness, nutrition, skincare
                and personal care products simple and convenient.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/shop"
                  className="btn-primary"
                >
                  Explore Products
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  to="/contact"
                  className="btn-outline"
                >
                  Get in Touch
                  <MessageCircle className="h-4 w-4" />
                </Link>
              </div>

            </div>
          </div>
        </section>


        {/* =====================================================
            OUR STORY
        ====================================================== */}
        <section className="border-y bg-muted/30">

          <div className="container-ff py-14 sm:py-18 lg:py-20">

            <div className="grid lg:grid-cols-5 gap-10 lg:gap-16 items-start">

              <div className="lg:col-span-2">

                <div className="overline text-secondary">
                  Our Story
                </div>

                <h2 className="font-heading font-semibold text-3xl sm:text-4xl mt-2">
                  Built around better choices.
                </h2>

              </div>

              <div className="lg:col-span-3 space-y-5 text-muted-foreground leading-relaxed">

                <p className="text-lg text-foreground">
                  We believe shopping for wellness products should feel
                  straightforward — not confusing or overwhelming.
                </p>

                <p>
                  That's why ShopVerse brings together wellness, nutrition,
                  skincare and personal care products in one easy-to-explore
                  online destination.
                </p>

                <p>
                  Rather than simply listing products, our goal is to provide
                  clear information, convenient ordering and personal support
                  when you need help deciding what to explore.
                </p>

                <p>
                  ShopVerse operates as an independent storefront run by an
                  Independent Forever Business Owner. We are separate from
                  Forever Living's corporate offices and operate according
                  to applicable business and distribution guidelines.
                </p>

              </div>

            </div>

          </div>

        </section>


        {/* =====================================================
            WHAT WE OFFER
        ====================================================== */}
        <section className="container-ff py-14 sm:py-18 lg:py-20">

          <div className="max-w-2xl mb-10">

            <div className="overline text-secondary">
              What you'll find here
            </div>

            <h2 className="font-heading font-semibold text-3xl sm:text-4xl mt-2">
              Wellness for everyday life.
            </h2>

            <p className="mt-4 text-muted-foreground leading-relaxed">
              Explore a range of products designed around everyday wellness,
              nutrition and personal care.
            </p>

          </div>


          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">

            {[
              {
                title: "Aloe & Wellness",
                text: "Explore aloe-focused products and everyday wellness options.",
                icon: Leaf,
              },
              {
                title: "Nutrition",
                text: "Discover convenient nutrition-focused products for different lifestyles.",
                icon: Sparkles,
              },
              {
                title: "Skincare",
                text: "Browse nourishing skincare and personal care selections.",
                icon: Heart,
              },
              {
                title: "Everyday Care",
                text: "Find practical products for your regular personal care routine.",
                icon: Check,
              },
            ].map((item) => {

              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="rounded-3xl border bg-background p-6 sm:p-7"
                >

                  <div className="h-11 w-11 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>

                  <h3 className="font-heading font-semibold text-lg">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {item.text}
                  </p>

                </div>
              );

            })}

          </div>

        </section>


        {/* =====================================================
            OUR VALUES
        ====================================================== */}
        <section className="bg-muted/30">

          <div className="container-ff py-14 sm:py-18 lg:py-20">

            <div className="text-center max-w-2xl mx-auto mb-10">

              <div className="overline text-secondary">
                What matters to us
              </div>

              <h2 className="font-heading font-semibold text-3xl sm:text-4xl mt-2">
                Our approach
              </h2>

              <p className="mt-4 text-muted-foreground">
                Everything we do is centered around making your shopping
                experience more useful, transparent and personal.
              </p>

            </div>


            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">

              {VALUES.map((value) => {

                const Icon = value.icon;

                return (
                  <div
                    key={value.title}
                    className="rounded-3xl bg-background border p-6"
                  >

                    <div className="h-11 w-11 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>

                    <h3 className="font-heading font-semibold text-lg">
                      {value.title}
                    </h3>

                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                      {value.text}
                    </p>

                  </div>
                );

              })}

            </div>

          </div>

        </section>


        {/* =====================================================
            OUR PROMISE
        ====================================================== */}
        <section className="container-ff py-14 sm:py-18 lg:py-20">

          <div className="rounded-[2rem] bg-primary text-primary-foreground overflow-hidden relative">

            <div className="absolute inset-0 grain opacity-25" />

            <div className="relative grid lg:grid-cols-2 gap-10 lg:gap-16 p-8 sm:p-12 lg:p-16">

              <div>

                <div className="overline text-secondary mb-3">
                  Our Promise
                </div>

                <h2 className="font-heading font-semibold text-3xl sm:text-4xl lg:text-5xl tracking-tight">
                  Clear. Genuine. Personal.
                </h2>

                <p className="mt-5 text-sm sm:text-base text-white/80 leading-relaxed max-w-xl">
                  We want every customer to know what they're buying,
                  understand the information available about the product
                  and feel comfortable asking questions before placing an
                  order.
                </p>

              </div>


              <div className="space-y-3">

                {PROMISES.map((promise) => (

                  <div
                    key={promise}
                    className="flex items-center gap-3 rounded-2xl bg-white/10 border border-white/10 px-5 py-4"
                  >

                    <div className="h-7 w-7 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                      <Check className="h-4 w-4 text-secondary" />
                    </div>

                    <span className="text-sm font-medium">
                      {promise}
                    </span>

                  </div>

                ))}

              </div>

            </div>

          </div>

        </section>


        {/* =====================================================
            PERSONAL GUIDANCE
        ====================================================== */}
        <section className="container-ff pb-14 sm:pb-18 lg:pb-20">

          <div className="border rounded-[2rem] p-8 sm:p-10 lg:p-12">

            <div className="grid md:grid-cols-2 gap-8 items-center">

              <div>

                <div className="overline text-secondary">
                  Need a little help?
                </div>

                <h2 className="font-heading font-semibold text-2xl sm:text-3xl mt-2">
                  You don't have to choose alone.
                </h2>

                <p className="mt-4 text-muted-foreground leading-relaxed">
                  If you're exploring wellness products for the first time
                  or simply have a question about something you're interested
                  in, we're happy to help you understand your options before
                  you order.
                </p>

              </div>

              <div className="md:justify-self-end">

                <Link
                  to="/contact"
                  className="btn-primary"
                >
                  <MessageCircle className="h-4 w-4" />
                  Contact Us
                  <ArrowRight className="h-4 w-4" />
                </Link>

              </div>

            </div>

          </div>

        </section>


        {/* =====================================================
            SHOP CTA
        ====================================================== */}
        <section className="bg-muted/30">

          <div className="container-ff py-14 sm:py-18 lg:py-20 text-center">

            <div className="mx-auto h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Leaf className="h-5 w-5 text-primary" />
            </div>

            <h2 className="font-heading font-semibold text-3xl sm:text-4xl mt-5">
              Start exploring ShopVerse
            </h2>

            <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
              Browse our wellness collections and discover products that
              fit naturally into your lifestyle.
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
                Ask a Question
                <MessageCircle className="h-4 w-4" />
              </Link>

            </div>

          </div>

        </section>


        {/* =====================================================
            DISCLOSURE
        ====================================================== */}
        <section className="border-t">

          <div className="container-ff py-7">

            <p className="text-xs text-muted-foreground text-center max-w-3xl mx-auto leading-relaxed">
              ShopVerse is an independent storefront operated by an
              Independent Forever Business Owner. It is separate from
              Forever Living corporate offices. Products are sold in
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
