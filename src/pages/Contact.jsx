import React from "react";
import SEO from "../components/SEO";
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";

export default function Contact() {
  return (
    <>
    <SEO
  title="Contact Our Independent Wellness Desk | Authorized FBO Support"
  description="Connect directly with an authorized independent business owner for product guidance, order tracing, and support inquiries. Fast nationwide delivery."
  keywords="contact independent fbo, order tracking wellness store, authorized distributor help, support independent retail storefront"
  url="/contact"
/>

    <div className="container-ff py-12 max-w-4xl" data-testid="contact-page">
      <div className="overline text-secondary mb-3">Support Channel</div>
      <h1 className="font-heading font-bold text-4xl sm:text-5xl">Get in touch</h1>
      <p className="mt-4 text-muted-foreground max-w-xl">
        Have a question about an item, shipment tracing, or product details? We are here to assist you individually.
      </p>

      <div className="mt-10 grid sm:grid-cols-2 gap-6">
        <Card icon={Mail} title="Email Address">
          <a href="mailto:adminfbo@gmail.com" className="text-primary hover:underline break-all">
            adminfbo@gmail.com
          </a>
          <p className="text-xs text-muted-foreground mt-1">Response within 24 business hours</p>
        </Card>

        <Card icon={Phone} title="Phone / WhatsApp">
          <a href="tel:+917978765224" className="text-primary hover:underline">+91 79787 65224</a>
          <p className="text-xs text-muted-foreground mt-1">Mon&ndash;Sat, 10 AM &ndash; 7 PM IST</p>
        </Card>

        <Card icon={MessageCircle} title="Direct Chat">
          <a href="https://wa.me/917978765224" target="_blank" rel="noreferrer" className="text-primary hover:underline">
            Chat on WhatsApp
          </a>
          <p className="text-xs text-muted-foreground mt-1">Fastest response channel</p>
        </Card>

        <Card icon={MapPin} title="Operational Hub">
          <p>Authorized Pan-India Delhivery</p>
          <p className="text-xs text-muted-foreground mt-1">Fulfillment available pan-India</p>
        </Card>
      </div>

      <div className="mt-10 p-6 rounded-2xl bg-primary/5 border border-primary/15 text-sm text-muted-foreground">
        <strong className="text-foreground">Order issues?</strong> Please share your Order ID
        (e.g. <code className="px-1 bg-white rounded">ord_xxxxxx</code>) while contacting us &mdash; it
        helps us resolve queries faster.
      </div>

      {/* MANDATORY COMPLIANCE BLOCK - CRITICAL FOR GOOGLE TRUST */}
      <div className="mt-6 text-[11px] text-muted-foreground/70 leading-relaxed border-t border-border/40 pt-4">
        <strong>Disclaimer:</strong> This website is owned and operated by an Independent Business Owner / Forever Business Owner (FBO) and is not the official corporate platform of Forever Living Products. All logos, brand marks, and trademarked names displayed are property of their respective owners.
      </div>
    </div>
    </>
  );
}

function Card({ icon: Icon, title, children }) {
  return (
    <div className="p-6 rounded-2xl bg-white border border-border/60">
      <div className="h-10 w-10 rounded-full bg-primary/10 text-primary grid place-items-center mb-4">
        <Icon className="h-5 w-5" />
      </div>
      <div className="font-heading font-semibold text-lg mb-1">{title}</div>
      <div className="text-sm">{children}</div>
    </div>
  );
}
