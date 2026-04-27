import { Icon } from "@/components/Icon";
import { SiteShell } from "@/components/SiteShell";

const faqSections = [
  {
    id: "ordering",
    icon: "payments",
    title: "Ordering & Payment",
    color: "bg-primary-container text-primary",
    items: [
      ["What payment methods do you accept for international orders?", "We accept all major credit cards (Visa, Mastercard, AMEX), Apple Pay, Google Pay, and wire transfers for orders over $5,000. All transactions are encrypted and processed in your local currency for convenience."],
      ["Can I modify my order after it has been placed?", "Due to the perishable nature of our fruit, orders can only be modified within 4 hours of placement. Please contact our concierge team immediately for any urgent changes."],
    ],
  },
  {
    id: "shipping",
    icon: "local_shipping",
    title: "Shipping & Harvest",
    color: "bg-secondary-container text-secondary",
    items: [["How do you ensure the mangoes aren't bruised during delivery?", "Each individual mango is cradled in a custom-molded biodegradable pulp sleeve. These sleeves are then nested into double-walled corrugated boxes with impact-absorbing corners."]],
  },
  {
    id: "varieties",
    icon: "potted_plant",
    title: "Mango Varieties & Quality",
    color: "bg-tertiary-container text-tertiary",
    items: [
      ["Which variety is best for a sweet, fiberless dessert experience?", "Our Royal Alphonso is the gold standard for desserts. Known as the King of Mangoes, it offers a buttery, fiberless texture with a complex honey-and-saffron aroma."],
      ["Are your mangoes certified organic?", "Yes, 100% of the Royal Orchard harvest is USDA and EU Organic certified. We use zero synthetic pesticides, relying instead on natural orchard management and companion planting."],
    ],
  },
];

const FAQ = () => (
  <SiteShell>
    <main className="bg-surface pt-8 text-on-surface">
      <section className="relative overflow-hidden px-8 pb-32 pt-20">
        <div className="relative z-10 mx-auto max-w-7xl text-center">
          <span className="mb-6 inline-block rounded-full bg-secondary-fixed px-4 py-1.5 text-xs font-semibold tracking-widest text-on-secondary-fixed-variant">KNOWLEDGE BASE</span>
          <h1 className="mb-8 font-headline text-5xl font-black leading-[1.1] text-on-surface md:text-7xl">How can we assist <br /><span className="italic text-primary">your harvest today?</span></h1>
          <div className="relative mx-auto max-w-2xl">
            <input className="h-16 w-full rounded-full border-none bg-surface-container-lowest pl-14 pr-6 text-on-surface shadow-[0_8px_32px_hsl(var(--primary)/0.08)] transition-all focus:ring-2 focus:ring-primary" placeholder="Search by topic: shipping, ripening, bulk orders..." type="text" />
            <Icon name="search" className="absolute left-5 top-1/2 -translate-y-1/2 text-outline" />
          </div>
        </div>
        <div className="absolute right-0 top-0 h-[600px] w-[600px] -translate-y-1/4 translate-x-1/4 rounded-full bg-primary-fixed-dim/20 blur-[120px]" />
        <div className="absolute bottom-0 left-0 h-[400px] w-[400px] -translate-x-1/4 translate-y-1/4 rounded-full bg-secondary-container/20 blur-[100px]" />
      </section>

      <section className="px-8 pb-32">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
            <aside className="hidden h-fit lg:sticky lg:top-32 lg:col-span-3 lg:block">
              <div className="space-y-4"><h3 className="mb-6 text-xs font-bold tracking-[0.2em] text-outline-variant">CATEGORIES</h3>{[["#ordering", "Ordering & Payment"], ["#shipping", "Shipping & Harvest"], ["#varieties", "Mango Varieties"], ["#wholesale", "Wholesale Partnerships"]].map(([href, label], i) => <a key={href} className={`flex items-center gap-3 font-semibold transition-colors ${i === 0 ? "text-primary" : "text-on-surface-variant hover:text-primary"}`} href={href}><span className={`h-1 rounded-full ${i === 0 ? "w-4 bg-primary" : "w-4 bg-transparent"}`} />{label}</a>)}</div>
            </aside>
            <div className="space-y-24 lg:col-span-9">
              {faqSections.map((section) => <div key={section.id} id={section.id} className="scroll-mt-32"><div className="mb-8 flex items-center gap-4"><div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${section.color}`}><Icon name={section.icon} /></div><h2 className="font-headline text-3xl font-bold">{section.title}</h2></div>{section.id === "shipping" && <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-2"><div className="relative overflow-hidden rounded-lg bg-surface-container-low p-8"><img className="absolute inset-0 h-full w-full object-cover opacity-10" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCXBhKqDkSsVlMRaBhxhz3YferHGfCVxDnt3y0zrQ35bnQmVMTX_PIEp43nAZjHZpYJ04TiSYSgMJop_LhkvtmyhaMrhRkvnCZgfN-MJxGBImnnuV6KiXYO0WpQEfV8FM0uj8kFLZ_c9p10LV5323KXWwKZV6e-1DT8yGef_3lvyvEEecbATnsxXcHzRvIROeU8AuyXJPU6BBIHDp646lnmFK8VR_Gdc9hR4__HdBbNKSGv_8V7ah-LEeq9XAXY-8oF1SMro0trd_JD" alt="Fresh mangoes being packed" /><h4 className="mb-2 font-headline text-xl font-bold">Climate-Controlled Transit</h4><p className="text-sm text-on-surface-variant">We use proprietary thermal-wrap technology to ensure your fruit maintains orchard-fresh temperature during flight.</p></div><div className="relative overflow-hidden rounded-lg bg-surface-container-low p-8"><img className="absolute inset-0 h-full w-full object-cover opacity-10" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBCS6X7Uq3Dbs_vVp8SibuRBJ7btz-Kw6wBBEw0HIOb0tfTM-z3lyzNYJfyCtdfI-Yk8Wh83Pyc7P8_GTKLY6S7yex-dgOKlBJHWJERAZIEqLa570FU-uA4aCTH_yb8QV2MCMw1_dPFqH2qBR3CsaZFTn4zr3nj6tDPjL5LGPYlbdKXMa8LZSibq1Q8DBzaOHQZ8dZkFvk37EPq_9MV_hKHQrgnu8-aIkHUVH-gOZe0YWIHnsjSlEDuIGxblyciq_PQH6gsTQAZfto8" alt="Aerial view of mango orchard" /><h4 className="mb-2 font-headline text-xl font-bold">Farm-to-Door Speed</h4><p className="text-sm text-on-surface-variant">Fruit picked on Monday is typically delivered to European and North American hubs by Wednesday morning.</p></div></div>}<div className="space-y-4">{section.items.map(([q, a]) => <details key={q} className="group overflow-hidden rounded-lg border border-outline-variant/10 bg-surface-container-lowest transition-all duration-300"><summary className="flex cursor-pointer list-none items-center justify-between p-8"><h4 className="font-headline text-lg font-semibold">{q}</h4><Icon name="expand_more" className="transition-transform duration-300 group-open:rotate-180" /></summary><div className="px-8 pb-8 leading-relaxed text-on-surface-variant">{a}</div></details>)}</div></div>)}
              <div id="wholesale" className="scroll-mt-32"><div className="mb-8 flex items-center gap-4"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-fixed text-on-primary-fixed-variant"><Icon name="handshake" /></div><h2 className="font-headline text-3xl font-bold">Wholesale Partnerships</h2></div><div className="flex flex-col items-center justify-between gap-8 rounded-lg bg-surface-container-highest p-12 text-center md:flex-row md:text-left"><div><h3 className="mb-4 font-headline text-2xl font-bold leading-tight">Elevate your establishment with the world's finest fruit.</h3><p className="mb-6 max-w-lg text-on-surface-variant">We partner with Michelin-starred restaurants and high-end grocers worldwide for seasonal contracts.</p><button className="rounded-full bg-primary px-8 py-3 font-semibold text-on-primary transition-opacity hover:opacity-90">Apply for Partnership</button></div><div className="flex h-48 w-48 items-center justify-center rounded-full bg-surface-container-lowest/50 shadow-inner"><Icon name="stars" className="text-6xl text-primary" /></div></div></div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-surface-container-highest bg-surface-container-lowest px-8 py-32"><div className="mx-auto max-w-4xl text-center"><h2 className="mb-6 font-headline text-4xl font-black md:text-5xl">Still need help?</h2><p className="mb-12 text-lg text-on-surface-variant">Our concierge team is available 24/7 to answer your specific harvest questions.</p><div className="grid grid-cols-1 gap-6 md:grid-cols-3">{[["mail", "Email Us", "concierge@mangoeditorial.com"], ["chat", "Live Chat", "Typical response: 2 mins"], ["call", "Call Support", "+1 (800) MANGO-CON"]].map(([icon, title, text]) => <div key={title} className="rounded-lg bg-surface-container-low p-8 transition-shadow hover:shadow-lg"><Icon name={icon} className="mb-4 text-primary" /><h4 className="mb-2 font-bold">{title}</h4><p className="text-sm text-on-surface-variant">{text}</p></div>)}</div></div></section>
    </main>
  </SiteShell>
);

export default FAQ;
