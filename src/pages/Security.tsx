import { PageLayout, Section } from "@/components/PageLayout";

const Security = () => (
  <PageLayout
    eyebrow="Trust & Safety"
    icon="shield"
    title="Security"
    subtitle="The technical and organizational measures we use to keep your data and payments safe."
  >
    <Section title="Encryption in Transit">
      <p>All traffic to royalorchard.com is encrypted using <strong>TLS 1.3</strong>. Sensitive data including login credentials and payment information is never transmitted in clear text.</p>
    </Section>
    <Section title="Payment Security">
      <p>We never store full card numbers on our servers. All card payments are processed by <strong>PCI-DSS Level 1</strong> compliant providers. Tokenized references are used to facilitate refunds and recurring orders.</p>
    </Section>
    <Section title="Account Protection">
      <ul className="list-disc pl-6 space-y-2">
        <li>Passwords are hashed using industry-standard algorithms with per-user salts.</li>
        <li>Suspicious login attempts trigger throttling and notification emails.</li>
        <li>Two-factor authentication (2FA) is available for high-value accounts on request.</li>
      </ul>
    </Section>
    <Section title="Infrastructure">
      <p>Our systems run on hardened cloud infrastructure with continuous security monitoring, intrusion detection, and automated patching. Production data is encrypted at rest using AES-256.</p>
    </Section>
    <Section title="Access Control">
      <p>Access to customer data is restricted on a strict need-to-know basis. All administrative access is logged, audited, and protected by enforced 2FA.</p>
    </Section>
    <Section title="Responsible Disclosure">
      <p>If you believe you have discovered a security vulnerability, please email <strong>security@royalorchard.com</strong>. We commit to acknowledging reports within 48 hours and will recognize researchers in our hall of fame.</p>
    </Section>
    <Section title="Incident Response">
      <p>In the unlikely event of a data breach affecting your personal information, we will notify you within 72 hours of confirmation and outline remediation steps.</p>
    </Section>
  </PageLayout>
);

export default Security;