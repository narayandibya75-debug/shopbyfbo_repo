import React from "react";
import { Leaf } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-border/60 bg-white" data-testid="footer">
      <div className="container-ff py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 mb-3">
            <span className="h-8 w-8 rounded-full bg-primary text-primary-foreground grid place-items-center">
              <Leaf className="h-4 w-4" />
            </span>
            <span className="font-heading font-semibold text-primary">ShopVerse</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Trusted Forever Living Products, delivered by an independent FBO.
            Quality nature. Transparent BV/CC. Seamless shopping.
          </p>
        </div>
        <div>
          <div className="overline text-muted-foreground mb-3">Shop</div>
          <ul className="space-y-2 text-sm">
            <li><a href="/shop?category=Aloe%20Drinks" className="hover:text-primary">Aloe Drinks</a></li>
            <li><a href="/shop?category=Bee%20Products" className="hover:text-primary">Bee Products</a></li>
            <li><a href="/shop?category=Nutrition" className="hover:text-primary">Nutrition</a></li>
            <li><a href="/shop?category=Skincare" className="hover:text-primary">Skincare</a></li>
          </ul>
        </div>
        <div>
          <div className="overline text-muted-foreground mb-3">Support</div>
          <ul className="space-y-2 text-sm">
            <li><a href="/orders" className="hover:text-primary">Track Orders</a></li>
            <li><a href="/contact" className="hover:text-primary">Contact Us</a></li>
            <li><a href="/about" className="hover:text-primary">About Us</a></li>
            <li><a href="/privacy" className="hover:text-primary">Privacy Policy</a></li>
            <li><a href="/terms" className="hover:text-primary">Terms &amp; Conditions</a></li>
          </ul>
        </div>
        <div>
          <div className="overline text-muted-foreground mb-3">FBO</div>
          <p className="text-sm text-muted-foreground">
            Independent Forever Business Owner.
            Products sold as per Forever guidelines with MRP &amp; BV/CC values.
          </p>
        </div>
      </div>
      <div className="border-t border-border/60">
        <div className="container-ff py-4 text-xs text-muted-foreground flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© {new Date().getFullYear()} ShopVerse. All rights reserved.</span>
          <span>Aloe-powered wellness · Designed with care</span>
        </div>
      </div>
    </footer>
  );
}
