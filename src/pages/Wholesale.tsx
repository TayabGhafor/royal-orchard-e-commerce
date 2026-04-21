import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { SiteShell } from "@/components/SiteShell";
import { Icon } from "@/components/Icon";

const schema = z.object({
  company: z.string().trim().min(2, "Enter your company name").max(120),
  name: z.string().trim().min(2, "Enter your full name").max(100),
  email: z.string().trim().email("Enter a valid email"),
  phone: z.string().trim().min(7, "Enter a valid phone").max(20),
  volume: z.string().min(1, "Select an estimated volume"),
  message: z.string().trim().min(10, "Tell us a little about your needs").max(1000),
});

const Wholesale = () => {
  const [form, setForm] = useState({ company: "", name: "", email: "", phone: "", volume: "", message: "" });
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) return toast.error(parsed.error.issues[0].message);
    toast.success("Thank you! Our wholesale team will reach out within 24 hours.");
    setForm({ company: "", name: "", email: "", phone: "", volume: "", message: "" });
  };

  return (
    <SiteShell>
      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-surface-container-low overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-fixed opacity-20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary-fixed opacity-15 rounded-full blur-[100px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative">
          <div>
            <div className="inline-flex items-center gap-2 bg-secondary-container px-4 py-1.5 rounded-full mb-6">
              <Icon name="storefront" className="text-on-secondary-container text-base" />
              <span className="text-on-secondary-container text-xs font-bold tracking-wider uppercase">B2B Partnerships</span>
            </div>
            <h1 className="font-headline text-5xl md:text-6xl font-extrabold tracking-tight mb-6 leading-[1.05]">
              Bulk orders <span className="text-primary italic">crafted for trade.</span>
            </h1>
            <p className="text-lg text-outline max-w-lg leading-relaxed mb-8">
              From boutique grocers to luxury hotels, restaurants, and corporate gifting partners — we deliver Pakistan's finest mangoes at scale, with white-glove logistics.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#contact" className="px-8 py-4 bg-primary text-on-primary font-bold rounded-full shadow-2xl cta-glow transition-all flex items-center gap-2">
                Request a Quote <Icon name="arrow_forward" />
              </a>
              <a href="mailto:wholesale@royalorchard.com" className="px-8 py-4 border border-outline-variant/40 rounded-full font-bold flex items-center gap-2 hover:border-primary hover:text-primary transition-colors">
                <Icon name="mail" /> wholesale@royalorchard.com
              </a>
            </div>
          </div>
          <div className="relative">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC2Q220Epu2WT_Mze6Fv12kdHUzGFhuEgfrRTnXLaq_z-CMbBBVQqJVTX6Fd13RYrd0LiSS6BhEw9q5c3htNGdnqlPmqN-EfhAA25S0CMlnHUS_9uCMBLEQXaz1uh0H8o46OygP-9bkq1_SyFb9Rxlukqc7ZkqR6VT_lCkmI0F-FxO3rxC4KY6lpgrHbrRnUsvC7B1TMyfa0irkL2j8HMmLnvq6skdmjfP_YOFR486asDEQdp7s-rkyZoSUbkz2PpaoUUeTo17k9YeC"
              alt="Bulk mango crates"
              className="w-full rounded-2xl shadow-2xl object-cover aspect-[4/5]"
            />
          </div>
        </div>
      </section>

      {/* About Us */}
      <section className="py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-1">
            <h2 className="font-headline text-4xl font-extrabold mb-4">About Royal Orchard</h2>
            <div className="w-16 h-1.5 bg-primary rounded-full" />
          </div>
          <div className="lg:col-span-2 space-y-6 text-on-surface-variant text-lg leading-relaxed">
            <p>Founded in 1987 in the sun-drenched groves of Multan, Royal Orchard has grown from a single-family farm into Pakistan's most trusted name in premium mangoes.</p>
            <p>Across four generations we have stewarded over 1,200 acres of organic-certified orchards, supplying Michelin-starred kitchens, five-star hotels, and discerning retail brands across three continents.</p>
            <p>Our wholesale program is built for partners who care about provenance, consistency, and presentation as much as we do.</p>
          </div>
        </div>
      </section>

      {/* Why partner */}
      <section className="py-20 bg-surface-container-low">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="font-headline text-4xl font-extrabold mb-3">Why partner with us</h2>
            <p className="text-outline">Built for trade, designed for excellence.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: "verified", title: "Certified Organic", body: "EU & USDA certified orchards with full traceability from grove to crate." },
              { icon: "trending_up", title: "Volume Pricing", body: "Tiered pricing scales generously beyond 100kg with locked seasonal rates." },
              { icon: "ac_unit", title: "Cold-Chain Logistics", body: "Temperature-controlled transit, reefer trucks, and air-freight options." },
              { icon: "schedule", title: "Reliable Cadence", body: "Weekly harvest schedules planned with you 6 weeks in advance." },
              { icon: "card_giftcard", title: "White-Label Ready", body: "Custom packaging, gift cards, and co-branded crates available." },
              { icon: "support_agent", title: "Dedicated Account", body: "A single point of contact who knows your business inside out." },
            ].map((c) => (
              <div key={c.title} className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/15 transition-all hover:-translate-y-1 hover:shadow-xl hover:border-primary/30">
                <div className="w-12 h-12 rounded-xl bg-primary-fixed text-primary flex items-center justify-center mb-4">
                  <Icon name={c.icon} className="text-2xl" />
                </div>
                <h3 className="font-headline font-bold text-lg mb-2">{c.title}</h3>
                <p className="text-outline text-sm leading-relaxed">{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact form */}
      <section id="contact" className="py-20 bg-surface">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="font-headline text-4xl font-extrabold mb-3">Talk to our wholesale team</h2>
            <p className="text-outline">Tell us about your business — we'll respond within 24 hours.</p>
          </div>
          <form onSubmit={submit} className="bg-surface-container-low p-8 md:p-10 rounded-2xl border border-outline-variant/15 space-y-5 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <input value={form.company} onChange={(e) => set("company", e.target.value)} placeholder="Company / Brand" className="w-full px-5 py-4 bg-surface-container-lowest border-0 outline-none focus:ring-2 focus:ring-primary rounded-xl" />
              <input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Your full name" className="w-full px-5 py-4 bg-surface-container-lowest border-0 outline-none focus:ring-2 focus:ring-primary rounded-xl" />
              <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="Business email" className="w-full px-5 py-4 bg-surface-container-lowest border-0 outline-none focus:ring-2 focus:ring-primary rounded-xl" />
              <input value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="Phone number" className="w-full px-5 py-4 bg-surface-container-lowest border-0 outline-none focus:ring-2 focus:ring-primary rounded-xl" />
            </div>
            <select value={form.volume} onChange={(e) => set("volume", e.target.value)} className="w-full px-5 py-4 bg-surface-container-lowest border-0 outline-none focus:ring-2 focus:ring-primary rounded-xl">
              <option value="">Estimated monthly volume</option>
              <option value="50-100kg">50 – 100 kg</option>
              <option value="100-500kg">100 – 500 kg</option>
              <option value="500-1000kg">500 kg – 1 ton</option>
              <option value="1000+kg">1 ton +</option>
            </select>
            <textarea value={form.message} onChange={(e) => set("message", e.target.value)} placeholder="Tell us about your business and requirements…" rows={5} className="w-full px-5 py-4 bg-surface-container-lowest border-0 outline-none focus:ring-2 focus:ring-primary rounded-xl resize-none" />
            <button type="submit" className="w-full editorial-gradient text-on-primary font-headline font-bold py-4 rounded-full shadow-lg shadow-primary/20 hover:scale-[0.98] transition-transform flex items-center justify-center gap-2">
              Send Inquiry <Icon name="send" className="text-base" />
            </button>
          </form>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-surface-container-low"><Icon name="mail" className="text-primary" /> wholesale@royalorchard.com</div>
            <div className="flex items-center gap-3 p-4 rounded-xl bg-surface-container-low"><Icon name="call" className="text-primary" /> +92 300 1234567</div>
            <div className="flex items-center gap-3 p-4 rounded-xl bg-surface-container-low"><Icon name="location_on" className="text-primary" /> Multan, Pakistan</div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
};

export default Wholesale;