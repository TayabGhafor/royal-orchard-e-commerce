import { useState } from "react";
import { PageLayout } from "@/components/PageLayout";
import { Icon } from "@/components/Icon";

const faqs = [
  { q: "How fresh are your mangoes when delivered?", a: "Every mango is hand-picked at peak ripeness from our Multan orchards and dispatched within 24 hours. Cold-chain packaging maintains 12–18°C through transit." },
  { q: "Do you ship internationally?", a: "Yes — we ship to the UAE, Saudi Arabia, UK, and USA via authorized perishable-goods carriers. International orders typically arrive in 5–8 business days." },
  { q: "What payment methods do you accept?", a: "We accept all major debit/credit cards, JazzCash, EasyPaisa, bank transfers, and Cash on Delivery within Pakistan." },
  { q: "Can I customize a gift box?", a: "Absolutely. Our Concierge team can curate bespoke gift boxes with personalized notes and ribbon work. Email gift@royalorchard.com." },
  { q: "What if my fruit arrives damaged?", a: "We offer a 100% freshness guarantee. Reach out within 24 hours of delivery with photos and we'll replace or refund the affected items." },
  { q: "Are your mangoes organic?", a: "Yes — all of our orchards are certified organic. We use only natural compost and integrated pest management." },
  { q: "How do I store my mangoes?", a: "Store unripe mangoes at room temperature, away from direct sunlight. Once ripe, refrigerate and consume within 5 days." },
  { q: "Do you offer wholesale pricing?", a: "Yes, for restaurants, retailers, and corporate gifting partners. Visit our Wholesale page to get in touch." },
  { q: "Can I track my order?", a: "Yes — a tracking ID is emailed within 2 hours of order confirmation, with real-time courier updates." },
  { q: "What is your return policy?", a: "Due to the perishable nature of fresh produce, returns are not accepted. However, our freshness guarantee covers any quality issues." },
];

const FAQ = () => {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <PageLayout
      eyebrow="Help Center"
      icon="help"
      title="Frequently Asked Questions"
      subtitle="Quick answers to the things our customers ask most often."
    >
      <div className="space-y-4">
        {faqs.map((f, i) => (
          <div key={i} className="bg-surface-container-low rounded-xl border border-outline-variant/20 overflow-hidden transition-all hover:border-primary/40">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between gap-4 p-5 text-left"
            >
              <span className="font-headline font-bold text-lg text-on-surface">{f.q}</span>
              <span className={`w-9 h-9 rounded-full bg-primary-fixed text-primary flex items-center justify-center transition-transform ${open === i ? "rotate-45" : ""}`}>
                <Icon name="add" />
              </span>
            </button>
            {open === i && (
              <div className="px-5 pb-5 text-on-surface-variant leading-relaxed animate-fade-in">{f.a}</div>
            )}
          </div>
        ))}
      </div>
    </PageLayout>
  );
};

export default FAQ;