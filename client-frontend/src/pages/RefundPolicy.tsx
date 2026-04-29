import { Icon } from "@/components/Icon";
import { SiteShell } from "@/components/SiteShell";
import { ScrollReveal } from "@/components/ScrollReveal";

const RefundPolicy = () => (
  <SiteShell>
    <main className="bg-surface text-on-surface">
      <ScrollReveal as="section" className="px-6 py-16 lg:px-40 lg:py-24">
        <div className="mx-auto max-w-[1200px]">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="order-2 lg:order-1">
              <div className="mb-6 inline-flex items-center rounded-full bg-secondary-fixed px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-on-secondary-fixed-variant">Our Commitment</div>
              <h1 className="mb-8 font-headline text-5xl font-extrabold leading-[1.1] tracking-tight text-on-surface lg:text-7xl">Quality is our <span className="italic text-primary">Signature.</span></h1>
              <p className="mb-10 max-w-xl text-lg leading-relaxed text-on-surface-variant lg:text-xl">At Royal Orchard, we take pride in delivering the finest mangoes. If your experience isn't perfect, we're here to make it right.</p>
              <div className="flex flex-wrap gap-4"><button className="rounded-full bg-primary px-8 py-4 text-base font-bold text-on-primary shadow-2xl shadow-primary/15 transition-all hover:opacity-90">View Products</button><button className="rounded-full border border-outline px-8 py-4 text-base font-bold transition-all hover:bg-surface-container-low">Contact Support</button></div>
            </div>
            <div className="relative order-1 lg:order-2">
              <div className="aspect-[4/5] rotate-2 overflow-hidden rounded-lg shadow-2xl shadow-primary/15"><img alt="Premium mangoes" className="h-full w-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDyUolQl_eAb0x9tuUQRga48R4TPjy5xVsj3amYvv5fZ3MwPmP9mrtl6imDcIPMWJ7QTHLW7I71IBtWoHUtmgyg3KJR9E_a-Qu-CuzQ3ci0VYwh2mUgnOSq99tY3mNyOlFTOJa0Rg1JsVSrhWC3s3abLUyYxhLj-vOR7lkxgcUPRxxs5KtFu7IOl98dZ7A4YTCyza5YSy3g6SjAh-ATfgfLB-mI2l1KJOgWweetApSSQa3SYsJ0jjPORGnXDKJADzrXhX_pzwnR6zXj" /></div>
              <div className="absolute -bottom-6 -left-6 hidden max-w-[240px] rounded-lg bg-surface-container-lowest p-6 shadow-xl md:block"><p className="mb-1 text-sm font-bold text-secondary">Hand-Picked Today</p><p className="text-xs leading-normal text-on-surface-variant">Every fruit is inspected for perfection before leaving our orchard.</p></div>
            </div>
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal as="section" className="bg-surface-container-low px-6 py-20 lg:px-40">
        <div className="mx-auto max-w-[1200px]"><div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[["history", "Refund Eligibility", "Due to the highly perishable nature of our fresh produce, refund requests must be submitted within 24 hours of delivery. To be eligible, the fruit must be in its original packaging."], ["photo_camera", "The Process", "Please email our support team with your order number and clear photos of the mangoes. Our quality control team will review your request within 48 hours."], ["local_shipping", "Damaged Goods", "If your order arrives damaged during transit, we will offer a full replacement or refund immediately. We track temperature-controlled shipping to ensure freshness."]].map(([icon, title, text]) => <div key={title} className="flex flex-col gap-6 rounded-lg bg-surface-container-lowest p-8 shadow-xl shadow-primary/10"><div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-container text-primary"><Icon name={icon} /></div><h3 className="font-headline text-2xl font-bold tracking-tight">{title}</h3><p className="leading-relaxed text-on-surface-variant">{text}</p></div>)}
        </div></div>
      </ScrollReveal>

      <ScrollReveal as="section" className="px-6 py-24 lg:px-40">
        <div className="mx-auto flex max-w-[1200px] flex-col overflow-hidden rounded-xl bg-surface-container-lowest shadow-2xl shadow-primary/10 lg:flex-row">
          <div className="flex flex-col justify-center p-12 lg:w-1/2 lg:p-20"><h2 className="mb-6 font-headline text-4xl font-extrabold tracking-tight">The Orchard Promise</h2><p className="mb-8 text-lg leading-relaxed text-on-surface-variant">We guarantee that our mangoes are picked at the peak of ripeness, naturally sun-ripened, and free from artificial chemicals. If our fruit does not meet the Royal Orchard standard of sweetness and texture, we will make it right.</p><div className="flex flex-col gap-4">{["100% Organic Farming", "Direct from Grove to Door"].map((item) => <div key={item} className="flex items-center gap-4"><div className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary-fixed text-on-secondary-fixed-variant"><Icon name="check" className="text-sm" /></div><span className="font-medium">{item}</span></div>)}</div></div>
          <div className="min-h-[400px] lg:w-1/2"><img className="h-full w-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAKTXTL5MnwmKk89LebRR6CJPnIeIBmgsTKnvEHzE6B02VIfoZlYmTVgDeOwzDaDXv_IqwliP9xypWPxTuFZUFWY6IqbA3x1IerRhj3MaFqbXN-pdsdg5Nx3CnAIumV7yUZrYOs77EsTUi8W2bL1xw4AJqLxytbk6f4JOHYnibmaDOL7sV-6YGZrQKngWQL9yrOmaX8LMce4HnNtzOHxXruyitG9IuFo2YFpsBW0xK_2ZYKdg0pz8rPz6qtRy88-Bk-kX8LE5F8G2Bo" alt="Golden sunrise over a mango orchard" /></div>
        </div>
      </ScrollReveal>
    </main>
  </SiteShell>
);

export default RefundPolicy;
