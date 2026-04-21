import { PageLayout, Section } from "@/components/PageLayout";

const Terms = () => (
  <PageLayout
    eyebrow="Legal"
    icon="gavel"
    title="Terms of Service"
    subtitle="The agreement between you and Royal Orchard. Please read carefully before placing an order."
  >
    <Section title="Acceptance of Terms">
      <p>By accessing or using royalorchard.com, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree, please discontinue use of the site.</p>
    </Section>
    <Section title="Eligibility">
      <p>You must be at least 18 years old, or have parental consent, to place an order. By using the site you confirm that all information provided is accurate and current.</p>
    </Section>
    <Section title="Product Information">
      <p>We make every effort to display product colors, varieties, and descriptions accurately. As mangoes are a natural product, slight variations in size, shape, and shade are expected and not considered defects.</p>
    </Section>
    <Section title="Pricing & Payment">
      <ul className="list-disc pl-6 space-y-2">
        <li>All prices are listed in PKR and are inclusive of applicable taxes unless stated otherwise.</li>
        <li>We reserve the right to modify prices without prior notice.</li>
        <li>Payment must be received in full before an order is dispatched (except COD).</li>
      </ul>
    </Section>
    <Section title="Order Acceptance">
      <p>Receipt of an order confirmation does not constitute acceptance. We reserve the right to cancel any order due to inventory limitations, pricing errors, or suspected fraud.</p>
    </Section>
    <Section title="Intellectual Property">
      <p>All content on this site — text, photography, logos, design — is the property of Royal Orchard Pvt Ltd and protected by copyright. Unauthorized use is prohibited.</p>
    </Section>
    <Section title="Limitation of Liability">
      <p>Royal Orchard shall not be liable for indirect, incidental, or consequential damages arising from the use of our products or website. Our total liability is limited to the amount paid for the relevant order.</p>
    </Section>
    <Section title="Governing Law">
      <p>These terms are governed by the laws of the Islamic Republic of Pakistan. Disputes shall be resolved in the competent courts of Multan.</p>
    </Section>
  </PageLayout>
);

export default Terms;