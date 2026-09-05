import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Info,
  Loader2,
  Lock,
  MapPin,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
} from "lucide-react";
import { api, INR, formatApiErrorDetail } from "../lib/api";
import { useCart } from "../contexts/CartContext";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { toast } from "sonner";
import SEO from "../components/SEO";

const SHIPPING_THRESHOLD = 499;
const SHIPPING_FEE = 49;

const INITIAL_FORM = {
  full_name: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  pincode: "",
};

function validateUTR(value) {
  const clean = value.trim().toUpperCase();

  if (!clean) {
    return {
      valid: false,
      error: "Please enter your UTR or transaction reference.",
    };
  }

  if (clean.length < 6) {
    return {
      valid: false,
      error: "UTR must be at least 6 characters.",
    };
  }

  if (clean.length > 32) {
    return {
      valid: false,
      error: "UTR cannot exceed 32 characters.",
    };
  }

  if (!/^[A-Z0-9]+$/.test(clean)) {
    return {
      valid: false,
      error: "Use only letters and numbers.",
    };
  }

  return {
    valid: true,
    error: "",
    cleanUtr: clean,
  };
}

function validateAddress(form) {
  const errors = {};

  if (!form.full_name.trim()) {
    errors.full_name = "Enter your full name.";
  }

  const phone = form.phone.replace(/\D/g, "");

  if (!phone) {
    errors.phone = "Enter your phone number.";
  } else if (phone.length !== 10) {
    errors.phone = "Enter a valid 10-digit phone number.";
  }

  if (!form.line1.trim()) {
    errors.line1 = "Enter your address.";
  }

  if (!form.city.trim()) {
    errors.city = "Enter your city.";
  }

  if (!form.state.trim()) {
    errors.state = "Enter your state.";
  }

  if (!/^\d{6}$/.test(form.pincode.trim())) {
    errors.pincode = "Enter a valid 6-digit pincode.";
  }

  return errors;
}

export default function Checkout() {
  const { cart, refresh } = useCart();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [form, setForm] = useState(INITIAL_FORM);

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [order, setOrder] = useState(null);

  const [utr, setUtr] = useState("");
  const [utrError, setUtrError] = useState("");
  const [utrTouched, setUtrTouched] = useState(false);

  const [addressErrors, setAddressErrors] = useState({});

  const subtotal = Number(cart?.subtotal || 0);

  const shipping = useMemo(() => {
    return subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  }, [subtotal]);

  const total = subtotal + shipping;

  const amountUntilFreeShipping = Math.max(
    SHIPPING_THRESHOLD - subtotal,
    0
  );

  const updateField = (key) => (event) => {
    const value = event.target.value;

    setForm((previous) => ({
      ...previous,
      [key]: value,
    }));

    if (addressErrors[key]) {
      setAddressErrors((previous) => ({
        ...previous,
        [key]: "",
      }));
    }
  };

  const proceedToPayment = async () => {
    if (!cart?.items?.length) {
      toast.error("Your cart is empty.");
      navigate("/shop");
      return;
    }

    const errors = validateAddress(form);

    if (Object.keys(errors).length > 0) {
      setAddressErrors(errors);

      toast.error("Please check your shipping details.");

      const firstError = Object.keys(errors)[0];

      setTimeout(() => {
        document
          .getElementById(`checkout-${firstError}`)
          ?.focus();
      }, 50);

      return;
    }

    setLoading(true);

    try {
      const payload = {
        address: {
          ...form,
          full_name: form.full_name.trim(),
          phone: form.phone.replace(/\D/g, ""),
          line1: form.line1.trim(),
          line2: form.line2.trim(),
          city: form.city.trim(),
          state: form.state.trim(),
          pincode: form.pincode.trim(),
        },
        payment_method: "upi",
      };

      const { data } = await api.post("/checkout", payload);

      if (!data?.order) {
        throw new Error("We could not create your order. Please try again.");
      }

      setOrder(data.order);
      setStep(2);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (error) {
      toast.error(
        formatApiErrorDetail(error?.response?.data?.detail) ||
          error?.message ||
          "Could not start checkout."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUtrChange = (event) => {
    const value = event.target.value.toUpperCase();

    setUtr(value);

    if (utrTouched) {
      const validation = validateUTR(value);

      setUtrError(
        validation.valid ? "" : validation.error
      );
    }
  };

  const handleUtrBlur = () => {
    setUtrTouched(true);

    const validation = validateUTR(utr);

    setUtrError(
      validation.valid ? "" : validation.error
    );
  };

  const submitUtr = async () => {
    const validation = validateUTR(utr);

    setUtrTouched(true);

    if (!validation.valid) {
      setUtrError(validation.error);
      toast.error(validation.error);
      return;
    }

    if (!order?.order_id) {
      toast.error("Order information is missing. Please restart checkout.");
      return;
    }

    if (submitting) return;

    setSubmitting(true);

    try {
      await api.post("/checkout/submit-utr", {
        order_id: order.order_id,
        utr: validation.cleanUtr,
      });

      await refresh();

      toast.success(
        "Payment details submitted successfully."
      );

      navigate("/orders");
    } catch (error) {
      toast.error(
        formatApiErrorDetail(error?.response?.data?.detail) ||
          error?.message ||
          "Could not submit payment details."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (!cart?.items?.length && step === 1) {
    return (
      <>
        <SEO
          title="Checkout | ShopVerse"
          description="Complete your ShopVerse wellness order."
          url="/checkout"
        />

        <div
          className="container-ff py-24 text-center"
          data-testid="checkout-empty"
        >
          <div className="mx-auto h-16 w-16 rounded-full bg-muted grid place-items-center">
            <ShoppingBag className="h-7 w-7 text-muted-foreground" />
          </div>

          <h1 className="mt-5 font-heading font-bold text-2xl">
            Your cart is empty
          </h1>

          <p className="mt-2 text-muted-foreground">
            Add something to your cart before continuing to checkout.
          </p>

          <button
            type="button"
            onClick={() => navigate("/shop")}
            className="btn-primary mt-6 inline-flex items-center gap-2"
          >
            Browse Products
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO
        title={
          step === 1
            ? "Checkout | ShopVerse"
            : "Complete Payment | ShopVerse"
        }
        description="Complete your ShopVerse wellness order."
        url="/checkout"
      />

      <main
        className="container-ff py-8 sm:py-10"
        data-testid="checkout-page"
      >
        {/* Back */}
        <button
          type="button"
          onClick={() =>
            step === 2
              ? setStep(1)
              : navigate("/cart")
          }
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          {step === 2 ? "Back to Address" : "Back to Cart"}
        </button>

        {/* Progress */}
        <CheckoutProgress step={step} />

        {/* Heading */}
        <div className="mt-8">
          <div className="overline text-secondary">
            {step === 1 ? "Order Details" : "Payment"}
          </div>

          <h1 className="mt-1 font-heading font-bold text-3xl sm:text-4xl">
            {step === 1
              ? "Complete Your Order"
              : "Complete Your Payment"}
          </h1>

          <p className="mt-2 text-muted-foreground">
            {step === 1
              ? "Enter your delivery details to continue."
              : "Scan the QR code, complete your UPI payment, and submit the transaction reference."}
          </p>
        </div>

        {step === 1 ? (
          <AddressStep
            form={form}
            errors={addressErrors}
            onChange={updateField}
            subtotal={subtotal}
            shipping={shipping}
            total={total}
            amountUntilFreeShipping={amountUntilFreeShipping}
            loading={loading}
            onContinue={proceedToPayment}
          />
        ) : (
          <PaymentStep
            order={order}
            utr={utr}
            utrError={utrError}
            utrTouched={utrTouched}
            submitting={submitting}
            onUtrChange={handleUtrChange}
            onUtrBlur={handleUtrBlur}
            onSubmit={submitUtr}
            total={total}
          />
        )}
      </main>
    </>
  );
}

function CheckoutProgress({ step }) {
  return (
    <div className="flex items-center max-w-xl">
      <ProgressStep
        number="1"
        label="Address"
        active={step >= 1}
        complete={step > 1}
      />

      <div
        className={`h-px flex-1 mx-3 sm:mx-5 ${
          step > 1 ? "bg-primary" : "bg-border"
        }`}
      />

      <ProgressStep
        number="2"
        label="Payment"
        active={step >= 2}
        complete={false}
      />
    </div>
  );
}

function ProgressStep({
  number,
  label,
  active,
  complete,
}) {
  return (
    <div className="flex items-center gap-2 shrink-0">
      <div
        className={`h-8 w-8 rounded-full grid place-items-center text-sm font-semibold ${
          complete
            ? "bg-primary text-primary-foreground"
            : active
            ? "border-2 border-primary text-primary"
            : "border border-border text-muted-foreground"
        }`}
      >
        {complete ? (
          <CheckCircle2 className="h-4 w-4" />
        ) : (
          number
        )}
      </div>

      <span
        className={`text-sm font-medium ${
          active
            ? "text-foreground"
            : "text-muted-foreground"
        }`}
      >
        {label}
      </span>
    </div>
  );
}

function AddressStep({
  form,
  errors,
  onChange,
  subtotal,
  shipping,
  total,
  amountUntilFreeShipping,
  loading,
  onContinue,
}) {
  return (
    <div className="mt-8 grid lg:grid-cols-3 gap-8">
      {/* Main form */}
      <div className="lg:col-span-2 space-y-6">
        <section className="rounded-2xl bg-white border border-border/60 p-5 sm:p-6">
          <div className="flex items-start gap-3 mb-6">
            <div className="h-10 w-10 rounded-xl bg-primary/10 grid place-items-center shrink-0">
              <MapPin className="h-5 w-5 text-primary" />
            </div>

            <div>
              <h2 className="font-heading font-semibold text-lg">
                Shipping Address
              </h2>

              <p className="text-sm text-muted-foreground mt-1">
                Where should we deliver your order?
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <InputField
              id="full_name"
              label="Full name"
              value={form.full_name}
              onChange={onChange("full_name")}
              error={errors.full_name}
              autoComplete="name"
            />

            <InputField
              id="phone"
              label="Phone number"
              value={form.phone}
              onChange={onChange("phone")}
              error={errors.phone}
              inputMode="numeric"
              maxLength={10}
              autoComplete="tel"
              placeholder="10-digit mobile number"
            />

            <InputField
              id="line1"
              label="Address line 1"
              value={form.line1}
              onChange={onChange("line1")}
              error={errors.line1}
              className="sm:col-span-2"
              autoComplete="street-address"
              placeholder="House no., building, street"
            />

            <InputField
              id="line2"
              label="Address line 2"
              value={form.line2}
              onChange={onChange("line2")}
              className="sm:col-span-2"
              autoComplete="address-line2"
              placeholder="Apartment, landmark, area (optional)"
            />

            <InputField
              id="city"
              label="City"
              value={form.city}
              onChange={onChange("city")}
              error={errors.city}
              autoComplete="address-level2"
            />

            <InputField
              id="state"
              label="State"
              value={form.state}
              onChange={onChange("state")}
              error={errors.state}
              autoComplete="address-level1"
            />

            <InputField
              id="pincode"
              label="Pincode"
              value={form.pincode}
              onChange={onChange("pincode")}
              error={errors.pincode}
              inputMode="numeric"
              maxLength={6}
              autoComplete="postal-code"
            />
          </div>
        </section>

        {/* Payment method */}
        <section className="rounded-2xl bg-white border border-border/60 p-5 sm:p-6">
          <h2 className="font-heading font-semibold text-lg">
            Payment Method
          </h2>

          <div className="mt-4 rounded-xl border-2 border-primary bg-primary/5 p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/10 grid place-items-center">
                <Smartphone className="h-5 w-5 text-primary" />
              </div>

              <div className="min-w-0">
                <div className="font-semibold">
                  UPI / QR Code
                </div>

                <div className="text-xs text-muted-foreground mt-0.5">
                  Pay using your preferred UPI app.
                </div>
              </div>

              <CheckCircle2 className="h-5 w-5 text-primary ml-auto shrink-0" />
            </div>
          </div>

          <div className="mt-4 text-xs text-muted-foreground leading-relaxed">
            After your order is created, you will receive a QR code on
            the next step. Complete the payment and submit your UTR or
            transaction reference.
          </div>
        </section>
      </div>

      {/* Summary */}
      <OrderSummary
        subtotal={subtotal}
        shipping={shipping}
        total={total}
        amountUntilFreeShipping={amountUntilFreeShipping}
        loading={loading}
        onContinue={onContinue}
      />
    </div>
  );
}

function OrderSummary({
  subtotal,
  shipping,
  total,
  amountUntilFreeShipping,
  loading,
  onContinue,
}) {
  const progress =
    subtotal >= SHIPPING_THRESHOLD
      ? 100
      : Math.min(
          (subtotal / SHIPPING_THRESHOLD) * 100,
          100
        );

  return (
    <aside className="lg:sticky lg:top-24 h-max">
      <div className="rounded-2xl bg-white border border-border/60 p-5 sm:p-6">
        <h2 className="font-heading font-semibold text-lg">
          Order Summary
        </h2>

        {amountUntilFreeShipping > 0 ? (
          <div className="mt-4 rounded-xl bg-muted/60 p-3">
            <div className="flex justify-between gap-3 text-xs mb-2">
              <span className="text-muted-foreground">
                Add {INR(amountUntilFreeShipping)} more
              </span>

              <span className="font-medium">
                for free shipping
              </span>
            </div>

            <div className="h-1.5 rounded-full bg-border overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="mt-4 rounded-xl bg-primary/5 border border-primary/10 p-3 text-sm text-primary">
            ✓ Free shipping applied to your order.
          </div>
        )}

        <div className="mt-5 space-y-3 text-sm">
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">
              Subtotal
            </span>
            <span>{INR(subtotal)}</span>
          </div>

          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">
              Delivery
            </span>

            <span>
              {shipping === 0 ? "FREE" : INR(shipping)}
            </span>
          </div>

          <div className="h-px bg-border my-4" />

          <div className="flex justify-between gap-4 items-center">
            <span className="font-medium">Total</span>

            <span className="font-heading font-bold text-xl text-primary">
              {INR(total)}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onContinue}
          disabled={loading}
          className="btn-primary w-full mt-6 flex items-center justify-center gap-2 disabled:opacity-60"
          data-testid="proceed-to-payment"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Creating Order...
            </>
          ) : (
            <>
              Continue to Payment
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>

        <div className="mt-4 flex items-start gap-2 text-xs text-muted-foreground">
          <Lock className="h-3.5 w-3.5 mt-0.5 shrink-0" />
          <span>
            Your order details are submitted through the checkout
            system before payment.
          </span>
        </div>
      </div>
    </aside>
  );
}

function PaymentStep({
  order,
  utr,
  utrError,
  utrTouched,
  submitting,
  onUtrChange,
  onUtrBlur,
  onSubmit,
  total,
}) {
  return (
    <div className="mt-8 max-w-2xl mx-auto">
      {/* Amount */}
      <div className="text-center mb-6">
        <div className="text-sm text-muted-foreground">
          Amount to pay
        </div>

        <div
          className="font-heading font-bold text-3xl text-primary mt-1"
          data-testid="payment-total"
        >
          {INR(order?.total ?? total)}
        </div>

        {order?.order_id && (
          <div className="text-xs text-muted-foreground mt-1">
            Order #{order.order_id}
          </div>
        )}
      </div>

      {/* QR */}
      <section className="rounded-2xl bg-white border border-border/60 p-6 sm:p-8 text-center">
        <div className="flex items-center justify-center gap-2">
          <Smartphone className="h-5 w-5 text-primary" />

          <h2 className="font-heading font-semibold text-lg">
            Scan to Pay
          </h2>
        </div>

        <p className="text-sm text-muted-foreground mt-2">
          Open your UPI app and scan the QR code below.
        </p>

        <div
          className="mt-6 inline-flex p-4 rounded-2xl bg-muted"
          data-testid="payment-qr"
        >
          {order?.qr_data ? (
            <QRCodeCanvas
              value={order.qr_data}
              size={220}
              includeMargin
              level="M"
              aria-label="UPI payment QR code"
            />
          ) : (
            <div className="h-[220px] w-[220px] rounded-lg bg-border/40 animate-pulse" />
          )}
        </div>

        <div className="mt-6 rounded-xl bg-muted/60 p-4 text-left">
          <div className="flex items-start gap-3">
            <Info className="h-4 w-4 text-primary mt-0.5 shrink-0" />

            <div className="text-sm">
              <p className="font-semibold">
                How to complete your payment
              </p>

              <ol className="mt-2 list-decimal pl-5 space-y-1.5 text-muted-foreground">
                <li>Open Google Pay, PhonePe, Paytm, BHIM, or another UPI app.</li>
                <li>Choose the option to scan a QR code.</li>
                <li>Scan the QR code shown above.</li>
                <li>Complete the payment for the displayed amount.</li>
                <li>Keep your UTR or transaction reference handy.</li>
              </ol>
            </div>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Lock className="h-3.5 w-3.5" />
          <span>Use your UPI app to complete the payment.</span>
        </div>
      </section>

      {/* UTR */}
      <section className="mt-6 rounded-2xl bg-white border border-border/60 p-6">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 grid place-items-center shrink-0">
            <ShieldCheck className="h-5 w-5 text-primary" />
          </div>

          <div>
            <h2 className="font-heading font-semibold text-lg">
              Submit Payment Reference
            </h2>

            <p className="text-sm text-muted-foreground mt-1">
              After completing payment, enter the UTR or transaction
              reference from your UPI app.
            </p>
          </div>
        </div>

        <div className="mt-6">
          <Label
            htmlFor="utr"
            className="text-sm font-medium"
          >
            UTR / Transaction Reference
            <span className="text-destructive ml-1">*</span>
          </Label>

          <Input
            id="utr"
            value={utr}
            onChange={onUtrChange}
            onBlur={onUtrBlur}
            placeholder="Enter your transaction reference"
            className={`mt-1.5 font-mono ${
              utrTouched && utrError
                ? "border-destructive focus-visible:ring-destructive"
                : ""
            }`}
            maxLength={32}
            autoComplete="off"
            data-testid="utr-input"
          />

          {utrTouched && utrError && (
            <div
              className="flex items-center gap-1.5 mt-2 text-xs text-destructive"
              role="alert"
            >
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              <span>{utrError}</span>
            </div>
          )}
        </div>

        {/* UTR help */}
        <div className="mt-5 rounded-xl border border-border bg-muted/40 p-4">
          <p className="text-xs font-semibold">
            Where can you find your UTR?
          </p>

          <ul className="mt-2 text-xs text-muted-foreground space-y-1.5 list-disc pl-4">
            <li>Open your UPI app's transaction history.</li>
            <li>Open the payment you just completed.</li>
            <li>Look for UTR, Transaction ID, or Reference Number.</li>
            <li>Copy that number into the field above.</li>
          </ul>
        </div>

        <button
          type="button"
          onClick={onSubmit}
          disabled={
            submitting ||
            !utr.trim() ||
            (utrTouched && Boolean(utrError))
          }
          className="btn-primary w-full mt-5 flex items-center justify-center gap-2 disabled:opacity-50"
          data-testid="submit-payment-details"
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <CheckCircle2 className="h-4 w-4" />
              Submit Payment Details
            </>
          )}
        </button>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Your payment reference will be submitted with this order for
          verification.
        </p>
      </section>

      {/* Important note */}
      <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4">
        <div className="flex items-start gap-2.5">
          <Info className="h-4 w-4 text-amber-700 mt-0.5 shrink-0" />

          <p className="text-xs leading-relaxed text-amber-800">
            Please make sure the payment is completed before submitting
            the transaction reference. Keep your payment confirmation
            available until the order has been verified.
          </p>
        </div>
      </div>
    </div>
  );
}

function InputField({
  id,
  label,
  value,
  onChange,
  error,
  className = "",
  ...props
}) {
  return (
    <div className={className}>
      <Label htmlFor={`checkout-${id}`}>
        {label}

        {[
          "full_name",
          "phone",
          "line1",
          "city",
          "state",
          "pincode",
        ].includes(id) && (
          <span className="text-destructive ml-1">*</span>
        )}
      </Label>

      <Input
        id={`checkout-${id}`}
        value={value}
        onChange={onChange}
        className={`mt-1.5 ${
          error
            ? "border-destructive focus-visible:ring-destructive"
            : ""
        }`}
        {...props}
      />

      {error && (
        <p
          className="mt-1.5 text-xs text-destructive"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}
