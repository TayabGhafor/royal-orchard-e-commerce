import { Link, useSearchParams } from "react-router-dom";
import { SiteShell } from "@/components/SiteShell";
import { Icon } from "@/components/Icon";
import { ScrollReveal } from "@/components/ScrollReveal";

const PaymentSuccess = () => {
  const [params] = useSearchParams();
  const sessionId = params.get("session_id");

  return (
    <SiteShell>
      <div className="pt-32 pb-20 px-4 sm:px-6 max-w-3xl mx-auto text-center">
        <ScrollReveal variant="fade-up">
          <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-primary-container">
            <Icon name="check_circle" className="text-4xl text-on-primary-container" />
          </div>
          <h1 className="text-4xl font-headline font-extrabold tracking-tight text-on-surface mb-4">
            Payment received
          </h1>
          <p className="text-on-surface-variant mb-8">
            Thank you. Your order is placed and your card payment completed securely through Stripe.
            {sessionId ? ` Reference: ${sessionId}.` : ""}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/orders"
              className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-4 font-bold text-on-primary"
            >
              View orders
            </Link>
            <Link
              to="/shop"
              className="inline-flex items-center justify-center rounded-full border border-outline-variant px-8 py-4 font-bold text-on-surface"
            >
              Continue shopping
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </SiteShell>
  );
};

export default PaymentSuccess;
