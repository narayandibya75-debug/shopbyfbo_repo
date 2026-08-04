import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import { api, INR, formatApiErrorDetail } from "../lib/api";
import { useCart } from "../contexts/CartContext";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { toast } from "sonner";
import { Lock, Loader2, CheckCircle2, ShieldCheck, Smartphone, ArrowRight, Info, AlertCircle } from "lucide-react";
import SEO from "../components/SEO";

// UTR Validation
const validateUTR = (utr) => {
  const cleanUtr = utr.trim().toUpperCase();
  
  if (!cleanUtr) return { valid: false, error: "UTR is required" };
  if (cleanUtr.length < 6) return { valid: false, error: "UTR must be at least 6 characters" };
  if (cleanUtr.length > 32) return { valid: false, error: "UTR cannot exceed 32 characters" };
  
  const patterns = [
    /^[A-Z0-9]{6,32}$/,
    /^[0-9]{10,16}$/,
    /^[A-Z]{3,4}[0-9]{7,15}$/,
    /^UPI[A-Z0-9]{8,20}$/,
    /^TXN[A-Z0-9]{8,20}$/,
  ];
  
  const isValid = patterns.some(pattern => pattern.test(cleanUtr));
  return isValid ? { valid: true, error: null, cleanUtr } : { valid: false, error: "Invalid UTR format" };
};

export default function Checkout() {
  const { cart, refresh } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ full_name: "", phone: "", line1: "", line2: "", city: "", state: "", pincode: "" });
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(null);
  const [utr, setUtr] = useState("");
  const [utrError, setUtrError] = useState("");
  const [utrTouched, setUtrTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const onChange = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const subtotal = cart.subtotal || 0;
  const shipping = subtotal >= 499 ? 0 : 49;
  const total = subtotal + shipping;

  const proceedToPayment = async () => {
    if (!cart.items?.length) {
      toast.error("Cart is empty");
      return;
    }
    
    const requiredFields = ["full_name", "phone", "line1", "city", "state", "pincode"];
    for (const field of requiredFields) {
      if (!form[field]) {
        toast.error("Please fill all address fields");
        return;
      }
    }
    
    setLoading(true);
    try {
      const { data } = await api.post("/checkout", { address: form, payment_method: "upi" });
      setOrder(data.order);
      setStep(2);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e) {
      toast.error(formatApiErrorDetail(e?.response?.data?.detail) || e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUtrChange = (e) => {
    const newUtr = e.target.value;
    setUtr(newUtr);
    if (utrTouched) {
      const validation = validateUTR(newUtr);
      setUtrError(validation.valid ? "" : validation.error);
    }
  };

  const handleUtrBlur = () => {
    setUtrTouched(true);
    const validation = validateUTR(utr);
    setUtrError(validation.valid ? "" : validation.error);
  };

  const submitUtr = async () => {
    const validation = validateUTR(utr);
    if (!validation.valid) {
      setUtrError(validation.error);
      toast.error(validation.error);
      return;
    }
    
    setSubmitting(true);
    try {
      await api.post("/checkout/submit-utr", { order_id: order.order_id, utr: utr.trim() });
      await refresh();
      toast.success("Payment submitted! We'll verify and confirm shortly.");
      navigate("/orders");
    } catch (e) {
      toast.error(formatApiErrorDetail(e?.response?.data?.detail) || e.message);
    } finally {
      setSubmitting(false);
    }
  };

  if ((!cart.items?.length) && step === 1) {
    return (
      <div className="container-ff py-24 text-center">
        <p className="text-lg">Your cart is empty.</p>
        <button onClick={() => navigate("/shop")} className="btn-primary mt-6">Browse products</button>
      </div>
    );
  }

  return (
    <>
      <SEO
        title="Secure Checkout | Complete Your Purchase"
        description="Complete your purchase securely. Fast shipping across India."
        url="/checkout"
      />
      <div className="container-ff py-10" data-testid="checkout-page">
        <div className="flex items-center gap-3 mb-8">
          <StepDot n={1} active={step >= 1} done={step > 1} label="Address" />
          <div className={`h-px flex-1 max-w-[80px] ${step > 1 ? "bg-primary" : "bg-border"}`} />
          <StepDot n={2} active={step >= 2} label="Payment" />
        </div>

        <h1 className="font-heading font-bold text-3xl sm:text-4xl">
          {step === 1 ? "Checkout" : "Complete Payment"}
        </h1>

        {step === 1 ? (
          <div className="mt-8 grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Address Form */}
              <div className="p-6 rounded-2xl bg-white border border-border/60">
                <h2 className="font-heading font-semibold text-lg mb-4">Shipping Address</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <InputField label="Full name" value={form.full_name} onChange={onChange("full_name")} />
                  <InputField label="Phone" value={form.phone} onChange={onChange("phone")} />
                  <InputField label="Address line 1" value={form.line1} onChange={onChange("line1")} className="sm:col-span-2" />
                  <InputField label="Address line 2 (optional)" value={form.line2} onChange={onChange("line2")} className="sm:col-span-2" />
                  <InputField label="City" value={form.city} onChange={onChange("city")} />
                  <InputField label="State" value={form.state} onChange={onChange("state")} />
                  <InputField label="Pincode" value={form.pincode} onChange={onChange("pincode")} />
                </div>
              </div>

              {/* Payment Method Info */}
              <div className="p-6 rounded-2xl bg-white border border-border/60">
                <h2 className="font-heading font-semibold text-lg mb-2">Payment Method</h2>
                <div className="p-4 rounded-xl border-2 border-primary bg-primary/5 flex items-center gap-3">
                  <Smartphone className="h-5 w-5 text-primary" />
                  <div>
                    <div className="font-medium">UPI / QR Code</div>
                    <div className="text-xs text-muted-foreground">Pay with Google Pay, PhonePe, Paytm, or BHIM</div>
                  </div>
                  <CheckCircle2 className="h-5 w-5 text-primary ml-auto" />
                </div>
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="h-max p-6 rounded-2xl bg-white border border-border/60 sticky top-24">
              <h2 className="font-heading font-semibold text-lg mb-4">Order Summary</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{INR(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? "FREE" : INR(shipping)}</span>
                </div>
                <div className="h-px bg-border my-3" />
                <div className="flex justify-between font-heading font-bold text-primary text-xl">
                  <span>Total</span>
                  <span>{INR(total)}</span>
                </div>
              </div>
              <button onClick={proceedToPayment} disabled={loading} className="btn-primary w-full mt-6">
                {loading ? "Processing..." : "Proceed to Payment"}
              </button>
            </div>
          </div>
        ) : (
          /* Step 2 - Payment with Hidden UPI ID */
          <div className="mt-8 max-w-md mx-auto">
            {/* QR Code Section - No UPI ID displayed */}
            <div className="p-6 rounded-2xl bg-white border border-border/60 text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Smartphone className="h-5 w-5 text-primary" />
                <h3 className="font-heading font-semibold">Scan to Pay</h3>
              </div>
              
              <p className="text-sm text-muted-foreground mb-4">
                Open any UPI app and scan this QR code
              </p>
              
              <div className="bg-muted p-4 rounded-xl inline-block mb-4">
                {order?.qr_data ? (
                  <QRCodeCanvas value={order.qr_data} size={200} />
                ) : (
                  <div className="h-[200px] w-[200px] bg-border/40 animate-pulse rounded-lg" />
                )}
              </div>
              
              {/* Payment Instructions */}
              <div className="mt-4 p-3 rounded-lg bg-blue-50 border border-blue-100 text-left">
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
                  <div className="text-xs text-blue-700">
                    <p className="font-medium mb-1">How to pay:</p>
                    <ol className="list-decimal pl-4 space-y-1">
                      <li>Open Google Pay, PhonePe, Paytm, or BHIM</li>
                      <li>Tap "Scan QR Code"</li>
                      <li>Scan the QR code above</li>
                      <li>Complete payment and note the UTR number</li>
                    </ol>
                  </div>
                </div>
              </div>
              
              <p className="text-xs text-muted-foreground mt-4 flex items-center justify-center gap-1">
                <Lock className="h-3 w-3" />
                Secure payment processing
              </p>
            </div>

            {/* UTR Submission Section */}
            <div className="mt-6 p-6 rounded-2xl bg-white border border-border/60">
              <div className="flex items-center gap-2 mb-4">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <h3 className="font-heading font-semibold">After Payment</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="utr" className="text-sm font-medium">
                    Enter UTR / Transaction Reference <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="utr"
                    value={utr}
                    onChange={handleUtrChange}
                    onBlur={handleUtrBlur}
                    placeholder="Enter the UTR number from your payment app"
                    className={`mt-1 font-mono text-sm ${utrError && utrTouched ? 'border-destructive' : ''}`}
                    maxLength={32}
                  />
                  {utrTouched && utrError && (
                    <div className="flex items-center gap-1 mt-1 text-xs text-destructive">
                      <AlertCircle className="h-3 w-3" />
                      <span>{utrError}</span>
                    </div>
                  )}
                </div>

                {/* UTR Help */}
                <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                  <p className="text-xs font-medium text-gray-700 mb-2">📍 Where to find UTR number:</p>
                  <ul className="text-xs text-gray-600 space-y-1 list-disc pl-4">
                    <li>Check your payment app's transaction history</li>
                    <li>Look for "Transaction ID", "UTR", or "Reference Number"</li>
                    <li>It's usually 12-16 digits or alphanumeric</li>
                  </ul>
                </div>

                <button 
                  onClick={submitUtr} 
                  disabled={submitting || !utr.trim() || (utrTouched && !!utrError)}
                  className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      Submit Payment Details
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// Helper Components
function StepDot({ n, active, done, label }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`h-6 w-6 rounded-full text-xs font-bold grid place-items-center ${
        done ? "bg-primary text-white" : active ? "border-2 border-primary text-primary" : "border border-border text-muted-foreground"
      }`}>
        {n}
      </div>
      <span className={`text-sm font-medium ${active ? "text-foreground" : "text-muted-foreground"}`}>
        {label}
      </span>
    </div>
  );
}

function InputField({ label, value, onChange, className }) {
  return (
    <div className={className}>
      <Label>{label}</Label>
      <Input value={value} onChange={onChange} className="mt-1" />
    </div>
  );
}
