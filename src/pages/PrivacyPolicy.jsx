import React from "react";
import SEO from "../components/SEO";

export default function PrivacyPolicy() {
  return (
    <>
    <SEO
      title="Storefront Privacy Policy | Authorized FBO Data Protection"
      description="Read our structural data privacy standards. Learn how user credentials, shipping information, and secure digital transaction logging are handled safely."
      keywords="privacy standards portal, user data protection, secure transactions policy"
      url="/privacy-policy"
    />
    <div className="container-ff py-12 max-w-3xl" data-testid="privacy-page">
      <div className="overline text-secondary mb-3">Compliance Framework</div>
      <h1 className="font-heading font-bold text-4xl">Privacy Policy</h1>
      <p className="text-xs text-muted-foreground mt-2">Last updated: June 2026</p>

      <div className="mt-8 space-y-6 text-muted-foreground leading-relaxed text-sm">
        <p>
          Our independent distributor digital storefront values your online security. This policy outlines 
          the minimal operational parameters regarding data collection, transmission rules, and client management.
        </p>

        <Section title="1. Operational Data Transmission">
          <ul className="list-disc pl-6 space-y-1.5">
            <li><strong>Session Authentication</strong>: Verified username tokens and cryptographically hashed passwords. Plaintext passwords are never recorded.</li>
            <li><strong>Fulfillment Logs</strong>: Delivery coordinates, designated telephone contact, selected inventory items, and client-submitted UPI routing hashes.</li>
            <li><strong>Technical Records</strong>: Anonymized system frameworks, mobile/desktop device profiles, and generic traffic metrics compiled for server optimization.</li>
            <li><strong>Federated Gateway Sign-In (Optional)</strong>: Utilizing secure third-party profile links syncs identity parameters under secure cross-origin verification.</li>
          </ul>
        </Section>

        <Section title="2. Internal Processing Application">
          <ul className="list-disc pl-6 space-y-1.5">
            <li>To dispatch inventory parcels cleanly to nationwide locations.</li>
            <li>To track submitted settlement confirmations manually for transaction release.</li>
            <li>To respond to consumer support inquiries submitted via communication links.</li>
            <li>To detect system abuse, secure client interfaces, and maintain server logs.</li>
          </ul>
        </Section>

        <Section title="3. Third-Party Data Isolation">
          <p>We do not lease, trade, or broadcast consumer profile records. Handled data stays strictly limited to:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1.5">
            <li>Logistics Courier Networks &mdash; Processing shipment labels and home drop-offs.</li>
            <li>Regulatory Compliance Nodes &mdash; Processing records if requested via direct statutory mandates.</li>
          </ul>
        </Section>

        <Section title="4. Persistent Cookies & Analytics Tracking">
          <p>
            Our web structure deploys standard native memory cookies to retain active cart counts and user credentials. 
            Anonymized system behaviors are compiled solely through server metrics toolkits to monitor site performance patterns.
          </p>
        </Section>

        <Section title="5. Cryptographic Infrastructure Safeguards">
          <p>
            Secure encryption configurations maintain password data records via bcrypt standards. Session keys utilize 
            strict httpOnly client memory settings to intercept malicious script reading. The entire application runs exclusively over secure HTTPS channels.
          </p>
        </Section>

        <Section title="6. User Access Rights">
          <ul className="list-disc pl-6 space-y-1.5">
            <li>Request a file copy containing personal information parameters held within the database.</li>
            <li>Modify obsolete or incorrect data fields manually.</li>
            <li>Request complete profile deletion from active databases, barring specific logs retained for tax or verification compliance.</li>
          </ul>
          <p className="mt-2">Reach our support desk at <a href="mailto:adminfbo@gmail.com" className="text-primary underline">adminfbo@gmail.com</a> to dispatch requests.</p>
        </Section>

        <Section title="7. Minor Protection Terms">
          <p>Our operational framework does not target or process user data profiles belonging to minors under 13 years of age.</p>
        </Section>

        <Section title="8. Policy Adjustments">
          <p>
            We may introduce revision logs to this text framework occasionally. Any modifications deploy live directly on this route URL with an adjusted tracking timeline.
          </p>
        </Section>

        <Section title="9. Data Administration Contact">
          <p>
            For deep clarity regarding personal profile encryption or processing rules, reach our help link directly at <a href="mailto:adminfbo@gmail.com" className="text-primary underline">adminfbo@gmail.com</a>.
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
