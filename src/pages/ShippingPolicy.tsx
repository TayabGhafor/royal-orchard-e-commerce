import { PageLayout, Section } from "@/components/PageLayout";

const ShippingPolicy = () => (
  <PageLayout
    eyebrow="Logistics"
    icon="local_shipping"
    title="Shipping Policy"
    subtitle="From the orchard to your doorstep — engineered for freshness, transparency, and speed."
  >
    <Section title="Order Processing">
      <p>All orders placed before <strong>11:00 AM PKT</strong> are harvested and packed the same day. Orders placed later are scheduled for the next morning's harvest cycle to guarantee peak ripeness.</p>
      <p>You will receive a confirmation email with a tracking ID within <strong>2 hours</strong> of order placement.</p>
    </Section>
    <Section title="Delivery Timelines">
      <ul className="list-disc pl-6 space-y-2">
        <li><strong>Major Cities</strong> (Karachi, Lahore, Islamabad, Multan, Faisalabad): 24–36 hours after dispatch.</li>
        <li><strong>Other Urban Areas</strong>: 2–4 business days.</li>
        <li><strong>Remote / Rural Locations</strong>: 4–6 business days, subject to courier coverage.</li>
      </ul>
    </Section>
    <Section title="Shipping Charges">
      <p>We offer <strong>free standard shipping</strong> on orders above Rs. 3,500. For smaller orders, a flat fee of Rs. 250 applies. Express same-day delivery within Multan is available for Rs. 500.</p>
    </Section>
    <Section title="Cold-Chain Packaging">
      <p>Each box is insulated with food-grade thermal liners and includes natural cooling packs to maintain optimal temperature (12–18°C) throughout transit. Mangoes are individually wrapped in protective foam sleeves.</p>
    </Section>
    <Section title="Failed Deliveries">
      <p>If delivery fails after two attempts, the courier will hold your package for 48 hours at the nearest hub. Beyond this, the order will be returned and a refund issued minus a 15% restocking fee.</p>
    </Section>
    <Section title="International Shipping">
      <p>We currently ship to the UAE, Saudi Arabia, UK, and USA via authorized perishable-goods carriers. International orders are processed within 48 hours and typically delivered within 5–8 business days. Customs duties are the recipient's responsibility.</p>
    </Section>
  </PageLayout>
);

export default ShippingPolicy;