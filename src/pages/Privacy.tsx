import { PageLayout, Section } from "@/components/PageLayout";

const Privacy = () => (
  <PageLayout
    eyebrow="Legal"
    icon="privacy_tip"
    title="Privacy Policy"
    subtitle="How we collect, use, and protect your personal information. Last updated April 2026."
  >
    <Section title="Information We Collect">
      <p>We collect information you provide directly — name, email, phone, delivery address — when you create an account, place an order, or contact our team. We also collect technical data (IP address, browser type, device identifiers) automatically when you visit our site.</p>
    </Section>
    <Section title="How We Use Your Information">
      <ul className="list-disc pl-6 space-y-2">
        <li>Process and fulfill your orders.</li>
        <li>Communicate order updates, harvest alerts, and seasonal offers.</li>
        <li>Improve our website, product mix, and customer experience.</li>
        <li>Comply with legal and regulatory obligations.</li>
      </ul>
    </Section>
    <Section title="Data Sharing">
      <p>We never sell your personal data. We share information only with trusted service providers (couriers, payment processors, analytics) under strict confidentiality agreements, and when required by law.</p>
    </Section>
    <Section title="Cookies & Tracking">
      <p>We use cookies to remember your cart, preferences, and session. You can disable cookies in your browser settings, though this may affect site functionality.</p>
    </Section>
    <Section title="Your Rights">
      <ul className="list-disc pl-6 space-y-2">
        <li>Access the personal data we hold about you.</li>
        <li>Request corrections or deletion of your data.</li>
        <li>Opt out of marketing communications at any time.</li>
        <li>Request a portable copy of your data.</li>
      </ul>
    </Section>
    <Section title="Data Retention">
      <p>We retain order and account data for as long as your account is active, and up to 7 years thereafter to comply with tax and accounting regulations.</p>
    </Section>
    <Section title="Contact Us">
      <p>For privacy questions, email <strong>privacy@royalorchard.com</strong> or write to Royal Orchard Pvt Ltd, Multan, Pakistan.</p>
    </Section>
  </PageLayout>
);

export default Privacy;