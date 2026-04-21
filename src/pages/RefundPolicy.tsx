import { PageLayout, Section } from "@/components/PageLayout";

const RefundPolicy = () => (
  <PageLayout
    eyebrow="Customer Care"
    icon="autorenew"
    title="Refund Policy"
    subtitle="Your satisfaction is our promise. Here's how we make things right when something isn't perfect."
  >
    <Section title="Our Freshness Guarantee">
      <p>Every box of Royal Orchard mangoes is backed by a <strong>100% freshness guarantee</strong>. If your fruit arrives damaged, spoiled, or below our quality standards, we'll replace it or refund you in full.</p>
    </Section>
    <Section title="Eligibility Window">
      <p>Refund or replacement requests must be raised within <strong>24 hours of delivery</strong>. After this period, due to the perishable nature of fresh produce, we are unable to honor claims.</p>
    </Section>
    <Section title="How to Request a Refund">
      <ol className="list-decimal pl-6 space-y-2">
        <li>Email <strong>care@royalorchard.com</strong> with your order ID.</li>
        <li>Attach clear photos of the affected fruits (top, bottom, and packaging).</li>
        <li>Briefly describe the issue.</li>
        <li>Our care team will respond within 6 hours during business days.</li>
      </ol>
    </Section>
    <Section title="Refund Methods & Timelines">
      <ul className="list-disc pl-6 space-y-2">
        <li><strong>Bank transfer</strong>: 5–7 business days.</li>
        <li><strong>Card refund</strong>: 7–10 business days, depending on issuer.</li>
        <li><strong>Store credit</strong>: instant, with a 10% bonus added.</li>
      </ul>
    </Section>
    <Section title="Non-Refundable Scenarios">
      <ul className="list-disc pl-6 space-y-2">
        <li>Cosmetic surface marks that do not affect taste or shelf life.</li>
        <li>Issues reported after the 24-hour window.</li>
        <li>Damage caused by improper storage after delivery.</li>
        <li>Refused deliveries without prior notice.</li>
      </ul>
    </Section>
    <Section title="Cancellations">
      <p>Orders can be cancelled free of charge before harvest dispatch. Once your order has been packed and handed to the courier, cancellation is no longer possible — but you remain protected by our freshness guarantee.</p>
    </Section>
  </PageLayout>
);

export default RefundPolicy;