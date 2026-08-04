import React from "react";
import SEO from "../components/SEO";

export default function About() {
  return (
    <>
    <SEO
      title="About Our Independent Wellness Desk | Certified Products & Integrity"
      description="Learn about our mission as an authorized Independent Business Owner. We provide verified, factory-sealed botanical items with full value transparency nationwide."
      keywords="authorized retail fbo, independent wellness partner story, verified product point tracking"
      url="/about"
    />
    <div className="container-ff py-12 max-w-4xl" data-testid="about-page">
      <div className="overline text-secondary mb-3">Our Identity</div>
      <h1 className="font-heading font-bold text-4xl sm:text-5xl">About Our Mission</h1>

      <div className="mt-8 prose prose-stone max-w-none text-muted-foreground leading-relaxed space-y-6">
        <p className="text-lg text-foreground">
          We operate as a verified, independent <strong>Forever Business Owner (FBO)</strong> digital storefront, 
          dedicated to supplying authentic retail items sourced exclusively through authorized regional distribution points.
        </p>

        <section>
          <h2 className="font-heading text-2xl text-foreground mt-8 mb-3">Our Dedicated Core Focus</h2>
          <p>
            Our objective is to streamline access to premium field-harvested aloe vera formulations, natural bee selections, 
            and targeted nutritional support. Every catalog item features clear retail values alongside individual item points for transparent order tracking.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-2xl text-foreground mt-8 mb-3">Why Order via Our Desk?</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Verified Inventory</strong> &mdash; Sealed, fully traceable genuine items.</li>
            <li><strong>Data Integrity</strong> &mdash; Clear breakdown of point values and recommended pricing.</li>
            <li><strong>Reliable Dispatch</strong> &mdash; Complimentary shipping tier applied automatically above ₹499.</li>
            <li><strong>Attentive Support</strong> &mdash; Direct communication channel for individual customer care.</li>
            <li><strong>Safe Transactions</strong> &mdash; Standard secure digital billing pathways with clear order updates.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-heading text-2xl text-foreground mt-8 mb-3">Compliance & Sourcing Standards</h2>
          <p>
            The premium products distributed through this platform stem from a global enterprise specializing in stabilized aloe formulations for over four decades. 
            All customer acquisitions undergo processing at verified retail rates under established distribution policies. We perform our services strictly as an 
            <em>independent distributor</em>, separate from the primary corporate operational offices.
          </p>
        </section>
      </div>
    </div>
    </>
  );
}
