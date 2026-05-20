import { useMemo, useState } from "react";
import { Icon } from "@/components/Icon";
import { SiteShell } from "@/components/SiteShell";
import { ScrollReveal } from "@/components/ScrollReveal";

const faqSections = [
  {
    id: "ordering",
    icon: "payments",
    title: "Ordering & Payment",
    color: "bg-primary-container text-primary",
    items: [
      [
        "What payment methods do you accept for international orders?",
        "We accept all major credit cards (Visa, Mastercard, AMEX), Apple Pay, Google Pay, Easypaisa, JazzCash, COD, and wire transfers for orders over $5,000.",
      ],
      [
        "Can I modify my order after it has been placed?",
        "Due to the perishable nature of our fruit, orders can only be modified within 4 hours of placement. Please contact our concierge team immediately for any urgent changes.",
      ],
    ],
  },
  {
    id: "shipping",
    icon: "local_shipping",
    title: "Shipping & Harvest",
    color: "bg-secondary-container text-secondary",
    items: [
      [
        "How long is shipping?",
        "Typical delivery is 2–4 business days across Pakistan after dispatch. Tracking is available under Account → Orders.",
      ],
      [
        "How do you ensure the mangoes aren't bruised during delivery?",
        "Each mango is cradled in a custom-molded biodegradable pulp sleeve inside double-walled corrugated boxes with impact-absorbing corners.",
      ],
    ],
  },
  {
    id: "varieties",
    icon: "potted_plant",
    title: "Mango Varieties & Quality",
    color: "bg-tertiary-container text-tertiary",
    items: [
      [
        "Which variety is best for a sweet, fiberless dessert experience?",
        "Chaunsa and Anwar Ratol are prized for honey-like sweetness and fine texture — ideal for desserts.",
      ],
      [
        "Are your mangoes certified organic?",
        "Yes — Royal Orchard follows regenerative practices with natural pest management. Certification details appear on product pages where applicable.",
      ],
    ],
  },
  {
    id: "returns",
    icon: "assignment_return",
    title: "Returns & Refunds",
    color: "bg-primary-container text-primary",
    items: [
      [
        "What is your return policy?",
        "Returns are accepted for damaged or wrong items within 48 hours of delivery. Visit /orders to start a return or contact support.",
      ],
    ],
  },
];

const FAQ = () => {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return faqSections;
    return faqSections
      .map((section) => ({
        ...section,
        items: section.items.filter(
          ([question, answer]) =>
            question.toLowerCase().includes(q) ||
            answer.toLowerCase().includes(q) ||
            section.title.toLowerCase().includes(q),
        ),
      }))
      .filter((s) => s.items.length > 0);
  }, [query]);

  return (
    <SiteShell>
      <main className="bg-surface pt-8 text-on-surface">
        <ScrollReveal as="section" className="relative overflow-hidden px-8 pb-32 pt-20">
          <div className="relative z-10 mx-auto max-w-7xl text-center">
            <span className="mb-6 inline-block rounded-full bg-secondary-fixed px-4 py-1.5 text-xs font-semibold tracking-widest text-on-secondary-fixed-variant">
              KNOWLEDGE BASE
            </span>
            <h1 className="mb-8 font-headline text-5xl font-black leading-[1.1] text-on-surface md:text-7xl">
              How can we assist <br />
              <span className="italic text-primary">your harvest today?</span>
            </h1>
            <div className="relative mx-auto max-w-2xl">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="h-16 w-full rounded-full border-none bg-surface-container-lowest pl-14 pr-6 text-on-surface shadow-[0_8px_32px_hsl(var(--primary)/0.08)] transition-all focus:ring-2 focus:ring-primary"
                placeholder="Search: shipping, returns, payment, organic..."
                type="search"
              />
              <Icon name="search" className="absolute left-5 top-1/2 -translate-y-1/2 text-outline" />
            </div>
          </div>
          <div className="absolute right-0 top-0 h-[600px] w-[600px] -translate-y-1/4 translate-x-1/4 rounded-full bg-primary-fixed-dim/20 blur-[120px]" />
          <div className="absolute bottom-0 left-0 h-[400px] w-[400px] -translate-x-1/4 translate-y-1/4 rounded-full bg-secondary-container/20 blur-[100px]" />
        </ScrollReveal>

        <ScrollReveal as="section" className="px-8 pb-32">
          <div className="mx-auto max-w-7xl">
            {filtered.length === 0 ? (
              <p className="text-center text-on-surface-variant">No FAQs match your search.</p>
            ) : (
              <div className="space-y-24">
                {filtered.map((section) => (
                  <div key={section.id} id={section.id} className="scroll-mt-32">
                    <div className="mb-8 flex items-center gap-4">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${section.color}`}>
                        <Icon name={section.icon} />
                      </div>
                      <h2 className="font-headline text-3xl font-bold">{section.title}</h2>
                    </div>
                    <div className="space-y-4">
                      {section.items.map(([q, a]) => (
                        <details
                          key={q}
                          className="group overflow-hidden rounded-lg border border-outline-variant/10 bg-surface-container-lowest transition-all duration-300"
                        >
                          <summary className="flex cursor-pointer list-none items-center justify-between p-8">
                            <h4 className="font-headline text-lg font-semibold">{q}</h4>
                            <Icon
                              name="expand_more"
                              className="transition-transform duration-300 group-open:rotate-180"
                            />
                          </summary>
                          <div className="px-8 pb-8 leading-relaxed text-on-surface-variant">{a}</div>
                        </details>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </ScrollReveal>

        <ScrollReveal as="section" className="border-t border-surface-container-highest bg-surface-container-lowest px-8 py-32">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="mb-6 font-headline text-4xl font-black md:text-5xl">Still need help?</h2>
            <p className="mb-12 text-lg text-on-surface-variant">
              Our concierge team is available to answer your harvest questions — or use the support chat on any page.
            </p>
          </div>
        </ScrollReveal>
      </main>
    </SiteShell>
  );
};

export default FAQ;
