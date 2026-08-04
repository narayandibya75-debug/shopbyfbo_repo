import React from "react";
import SEO from "../components/SEO";

export default function Terms() {
  return (
    <>
    <SEO
      title="Storefront Terms & Conditions | Independent Distributor Rules"
      description="Review our structural terms of service. Read guidelines regarding regional retail pricing rules, secure payment validation, and delivery routing profiles."
      keywords="terms of service portal, digital transaction parameters, retail compliance framework"
      url="/terms"
    />
    <div className="container-ff py-12 max-w-3xl" data-testid="terms-page">
      <div className="overline text-secondary mb-3">Compliance Framework</div>
      <h1 className="font-heading font-bold text-4xl">Terms &amp; Conditions</h1>
      <p className="text-xs text-muted-foreground mt-2">Last updated: June 2026</p>

      <div className="mt-8 space-y-6 text-muted-foreground leading-relaxed text-sm">
        <p>
          By interacting with this independent distributor digital storefront, you agree to fulfill the following operating guidelines. Please review these parameters thoroughly.
        </p>

        <Section title="1. Operational Scope">
          <p>
            This website operates strictly as a digital storefront managed by an independent Forever Business Owner (FBO). We do not act as the primary operational branch, 
            nor do we represent corporate management of Forever Living Products. Inventory acquisitions feature authentic distribution markings routed via authorized pipelines at standard retail recommended rates.
          </p>
        </Section>

        <Section title="2. Eligibility">
          <p>
            You must be 18 years or older to finalize an order. Proceeding through our checkout dashboard confirms you possess the statutory capacity to complete a purchase agreement.
          </p>
        </Section>

        <Section title="3. Pricing & Shipping Thresholds">
          <ul className="list-disc pl-6 space-y-1.5">
            <li>All calculations display in Indian Rupees (INR) and factor in applicable local taxation parameters.</li>
            <li>Inventory distributes according to established standard maximum retail pricing (MRP) policies.</li>
            <li>Volume metadata points (BV and CC logs) provide reference statistics for authorized system members.</li>
            <li><strong>Complimentary shipping applies automatically to orders tracking above ₹499.</strong> Orders sitting under this threshold carry a standard flat dispatch fee of ₹49.</li>
          </ul>
        </Section>

        <Section title="4. Digital Settlement (UPI Workflow)">
          <ul className="list-disc pl-6 space-y-1.5">
            <li>Settlements process safely via standard peer-to-peer UPI interfaces into our verified distributor receiving hash.</li>
            <li>Upon concluding the payment app interaction, clients must submit their 12-digit <strong>UPI Reference Number / UTR</strong> into the tracking field.</li>
            <li>Order packages remain under an <em>Awaiting Verification</em> banner until banking data mirrors the submitted hash.</li>
            <li>Unverified transaction queues clear automatically after 48 hours, returning pending inventory allocations to active stock logs.</li>
          </ul>
        </Section>

        <Section title="5. Shipping & Logistics Delivery">
          <ul className="list-disc pl-6 space-y-1.5">
            <li>Parcels dispatch nationwide across India using registered third-party logistics courier networks.</li>
            <li>Standard fulfillment transits average 3&ndash;7 operational business days following explicit remittance confirmation.</li>
            <li>Fulfillment accountability transfers safely upon successful carrier handoff at our regional shipping hub.</li>
          </ul>
        </Section>

        <Section title="6. Return, Refund, & Exchanges">
          <ul className="list-disc pl-6 space-y-1.5">
            <li>Unopened, factory-sealed product packaging remains eligible for standard return requests within 7 calendar days of delivery.</li>
            <li>Opened consumables, nutritional powders, or topical skin items cannot undergo return processing due to universal sanitary protocols.</li>
            <li>Arrival discrepancies or damaged containers must be reported via our communication channel within 48 hours of drop-off with clear visual logs.</li>
            <li>Approved processing requests clear safely back to the client's originating UPI coordinates within 5&ndash;7 operational banking days.</li>
          </ul>
        </Section>

        <Section title="7. Inventory Status">
          <p>
            We retain full operational control to label catalogue categories as <em>out-of-stock</em> or <em>discontinued</em> during market shifts. 
            Unavailable items decouple from active checkout baskets automatically.
          </p>
        </Section>

        <Section title="8. User Conduct Standards">
          <p>Users pledge strictly to avoid:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1.5">
            <li>Submitting inaccurate or simulated transaction reference numbers.</li>
            <li>Attempting code injection, parameter spoofing, or unauthorized path navigation.</li>
            <li>Manipulating text logs, product photography, or regional layout components for external purposes.</li>
          </ul>
        </Section>

        <Section title="9. General Product Disclaimer">
          <p>
            Product nutritional attributes, formulations, and benefit profiles are documented exclusively by the parent manufacturer. 
            Statements hosted on this independent layout do not represent clinical medical consensus, and our catalog lines are not formulated to diagnose, mitigate, or treat any medical conditions.
          </p>
        </Section>

        <Section title="10. Limitation of Liability">
          <p>
            To the maximum extent permitted under national statutes, our distributor dashboard limits liability regarding consequential or peripheral application outcomes. 
            Maximum transactional recourse is strictly capped at the individual payment sum processed for the line items in question.
          </p>
        </Section>

        <Section title="11. Statutory Governing Law">
          <p>
            This structural framework answers directly to the corporate laws of India. Legal arbitration panels trace jurisdiction to the regional court networks presiding over our authorized distribution point.
          </p>
        </Section>

        <Section title="12. Compliance Contact Desk">
          <p>
            For deep clarity concerning transaction boundaries or policy terms, submit an analytical brief directly to our unified portal: <a href="mailto:adminfbo@gmail.com" className="text-primary underline">adminfbo@gmail.com</a>.
          </p>
        </Section>
      </div>
    </div>
    </>
  );
}

function Section({ title, children }) {
  return (
    <section>
      <h2 className="font-heading font-semibold text-lg text-foreground mb-2">{title}</h2>
      {children}
    </section>
  );
}
