import { Icon } from "@/components/Icon";
import { SiteShell } from "@/components/SiteShell";
import { ScrollReveal } from "@/components/ScrollReveal";

const ShippingPolicy = () => (
  <SiteShell>
    <ScrollReveal as="header" className="relative min-h-[680px] flex items-center overflow-hidden bg-inverse-surface" variant="fade">
      <img
        className="absolute inset-0 h-full w-full object-cover opacity-80"
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBt6xcgT4ud0Ypx5l4zX3I7niPQ8Etw31N3rQgDmJRhORxeZq_W_cXG1vpPS7zxNAeuKbCcPtTta8aCHLRbERvgFfKChA3kw_ydDJA3Ll67WMe_RaI4Wb1CIdABVLeuTrjhkwHkq27EeJIh-RDawuy8tOIKfKM5SQ0JCx4fUYycFPVfcUuh8BHTp5ItC-1GuofuNWbzJxsPgytBon8ACCOLJgK5WHdR1PWivw2o8gHj5pt1mSw2U7LZdn0orMRqNzEduXNCfGqGyOxJ"
        alt="Sweeping aerial view of a lush green mango orchard at sunset"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-inverse-surface/70 to-inverse-surface/5" />
      <div className="relative z-10 mx-auto w-full max-w-7xl px-8">
        <div className="max-w-2xl">
          <span className="mb-6 inline-block rounded-full bg-secondary-fixed px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-on-secondary-fixed-variant">Logistics Excellence</span>
          <h1 className="mb-8 font-headline text-6xl font-extrabold leading-tight tracking-tight text-inverse-on-surface md:text-8xl">The Journey from Tree to Table</h1>
          <p className="max-w-lg text-xl font-light leading-relaxed text-inverse-on-surface/90">Discover how we preserve the sun-drenched sweetness of our orchards as they travel from our home to yours.</p>
        </div>
      </div>
    </ScrollReveal>

    <main className="mx-auto max-w-7xl space-y-32 px-8 py-24">
      <ScrollReveal as="section" className="grid grid-cols-1 items-center gap-16 lg:grid-cols-12">
        <div className="space-y-8 lg:col-span-5">
          <h2 className="font-headline text-4xl font-bold tracking-tight text-primary md:text-5xl">Rapid Freshness</h2>
          <p className="text-lg leading-relaxed text-on-surface-variant">We prioritize speed without compromising care. Our logistics network is optimized to ensure your mangoes spend less time in transit and more time ripening in your kitchen.</p>
          <div className="space-y-4">
            {[
              ["Local Delivery", "24 - 48 Hours", "local_shipping", "bg-primary-fixed"],
              ["International", "3 - 5 Business Days", "flight", "bg-secondary-container"],
            ].map(([label, value, icon, hover]) => (
              <div key={label} className={`group flex items-center justify-between rounded-lg border border-outline-variant/15 bg-surface-container-lowest p-8 transition-colors hover:${hover}`}>
                <div>
                  <p className="mb-1 text-sm font-bold uppercase tracking-widest text-secondary">{label}</p>
                  <h3 className="font-headline text-2xl font-bold text-on-surface">{value}</h3>
                </div>
                <Icon name={icon} className="text-4xl text-primary transition-transform group-hover:translate-x-2" />
              </div>
            ))}
          </div>
        </div>
        <div className="relative lg:col-span-7">
          <div className="aspect-[4/5] overflow-hidden rounded-lg lg:translate-x-12">
            <img className="h-full w-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC0MhdVO-gR-jj5x-G2_8TGJ2P5KJRrQGxLvDoXL2qtFAI003RQjlvuKwofvfABLnTfx9kbxBy7T45yH2krgHuFiV53D-DlHVraG_wh04rWfJrRxilYQ8FYOWYyVjbiSZC8tK47aQgJf7lWSV16OV_OsJ8fuf6YGgJwJtr8xDSMhSkujF9fbpQ6dTVhYixNcAbXgUiAPYwFJBjBsVj02TnKXxekH_8t7Wzes2dNq_8ZFkZISh95UDKzMEj5s61jfywLH6zcMWAZokHb" alt="Hand placing a ripe mango into a premium shipping box" />
          </div>
          <div className="absolute -bottom-8 -left-8 hidden max-w-xs rounded-lg bg-surface-container-lowest p-10 shadow-xl md:block">
            <p className="mb-2 text-4xl font-bold italic text-primary">98%</p>
            <p className="font-medium text-on-surface-variant">Of deliveries arrive ahead of schedule, preserved at peak ripeness.</p>
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal as="section" className="space-y-12">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-6 font-headline text-4xl font-bold text-primary md:text-5xl">Thermal Wrap Technology</h2>
          <p className="text-lg text-on-surface-variant">Our engineering team has reimagined the fruit crate. Every Royal Orchard shipment is a temperature-controlled sanctuary.</p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="rounded-lg bg-surface-container-low p-10"><div className="mb-8 flex h-14 w-14 items-center justify-center rounded-full bg-surface-container-lowest shadow-sm"><Icon name="thermostat" className="text-primary" /></div><h4 className="mb-4 font-headline text-2xl font-bold">Climate Shield</h4><p className="leading-relaxed text-on-surface-variant">Multi-layer insulation that maintains a constant 14°C, protecting against external heat spikes.</p></div>
          <div className="relative overflow-hidden rounded-lg md:row-span-2"><img className="h-full w-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBlR_k5DJ-zEB7gdHImdmekap21TmEmwbIBhZ_xhRyLS__sNUKnFhgyj6CrqJSq8X2scPKcNhbdwJ-R7nUMqXStPfKs6SFbjm7xNQLo4Vg5ORWNOaYLxm98UDq59g32m4ZMp6tKklFLtSW0naJLzp4mX0CAzye3D-jCUgkvPPkXYGn-vYqFt8dFI8nGcnkYpVTdDs-GceptzOqIEF50tMoTJR0XKuSQ68ggfVVcyeKfNQ3yZfJP49jv4sHu_liGBqdcI71HAOjIZRrZ" alt="Sustainable packaging material" /><div className="absolute inset-0 bg-primary/20 backdrop-blur-[2px]" /><div className="absolute bottom-8 left-8 right-8 text-inverse-on-surface"><h4 className="mb-2 font-headline text-3xl font-bold">Eco-Pulp™</h4><p className="text-sm uppercase tracking-widest opacity-90">100% Biodegradable Construction</p></div></div>
          <div className="rounded-lg bg-secondary-container p-10"><div className="mb-8 flex h-14 w-14 items-center justify-center rounded-full bg-surface-container-lowest shadow-sm"><Icon name="eco" className="text-secondary" /></div><h4 className="mb-4 font-headline text-2xl font-bold">Zero Plastic</h4><p className="leading-relaxed text-on-secondary-container">From corn-starch buffers to soy-based inks, our packaging returns to the earth as easily as a mango peel.</p></div>
          <div className="flex items-center gap-8 rounded-lg bg-primary-fixed p-10 md:col-span-2"><div className="flex-1"><h4 className="mb-4 font-headline text-2xl font-bold">Impact Absorption</h4><p className="leading-relaxed text-on-primary-fixed-variant">Patented cradle-mesh technology ensures that no fruit touches another, preventing bruising during long-haul transit.</p></div><div className="hidden h-32 w-32 items-center justify-center rounded-full border-4 border-surface-container-lowest bg-surface-container-lowest/40 sm:flex"><Icon name="shield_with_heart" className="text-5xl text-primary" /></div></div>
        </div>
      </ScrollReveal>

      <ScrollReveal as="section" className="grid grid-cols-1 overflow-hidden rounded-lg bg-surface-variant md:grid-cols-2 md:gap-px">
        <div className="bg-surface-container-lowest p-12 md:p-16">
          <h3 className="mb-10 font-headline text-3xl font-bold">Transparent Rates</h3>
          <ul className="space-y-8">
            {[["Boutique Box", "3kg curated selection", "$12.00"], ["Family Crate", "5kg orchard blend", "$18.00"], ["Connoisseur Bulk", "8kg + premium reserve", "$0.00"]].map(([name, desc, price]) => (
              <li key={name} className="flex items-end justify-between border-b border-surface-container pb-4"><div><p className="text-lg font-bold">{name}</p><p className="text-sm text-on-surface-variant">{desc}</p></div><p className="font-headline text-xl font-bold text-primary">{price}</p></li>
            ))}
          </ul>
          <div className="mt-12 flex items-start gap-4 rounded-lg bg-surface-container-low p-6"><Icon name="info" className="text-primary" /><p className="text-sm text-on-surface-variant">Bulk orders (10+ crates) qualify for dedicated refrigerated courier service at no extra cost.</p></div>
        </div>
        <div className="flex flex-col justify-center bg-surface-container-lowest p-12 md:p-16">
          <div className="max-w-sm"><h3 className="mb-6 font-headline text-3xl font-bold">Real-Time Eyes</h3><p className="mb-10 leading-relaxed text-on-surface-variant">We believe in total transparency. From the moment your fruit is plucked to the second it reaches your doorstep, you are part of the journey.</p><div className="space-y-8">{[["notifications_active", "Instant SMS/Email", "Receive a live tracking link the moment the courier departs."], ["map", "Interactive Map", "Track your mangoes as they move through our temperature-controlled hubs."]].map(([icon, title, text]) => <div key={title} className="flex gap-6"><div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary"><Icon name={icon} /></div><div><h5 className="mb-1 font-bold">{title}</h5><p className="text-sm text-on-surface-variant">{text}</p></div></div>)}</div><button className="mt-12 w-full rounded-full bg-primary py-4 font-bold text-on-primary shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl active:scale-95">Track My Current Order</button></div>
        </div>
      </ScrollReveal>
    </main>
  </SiteShell>
);

export default ShippingPolicy;
