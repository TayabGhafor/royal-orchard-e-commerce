import { SiteShell } from "@/components/SiteShell";
import { Icon } from "@/components/Icon";
import { ScrollReveal } from "@/components/ScrollReveal";
import { FreshnessJourneyRoadmap } from "@/components/FreshnessJourneyRoadmap";

/**
 * Freshness — pixel-faithful conversion of user-uploads://freshnes.html.
 * The global RoyalOrchard navbar is provided by SiteShell (single-navbar rule).
 */
const Freshness = () => (
  <SiteShell>
    <div className="bg-surface font-body text-on-surface antialiased">
      <main className="pt-24">
        {/* HERO */}
        <ScrollReveal as="section" className="relative px-8 lg:px-16 py-12 max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="w-full lg:w-1/2 z-10">
              <span className="inline-block px-4 py-1.5 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant text-xs font-bold tracking-widest uppercase mb-6">
                Established 1984
              </span>
              <h1 className="font-headline text-5xl md:text-7xl font-extrabold text-on-surface leading-[1.1] tracking-tighter mb-8">
                From Branch to Box in <span className="text-primary italic">24 Hours</span>.
              </h1>
              <p className="text-on-surface-variant text-lg md:text-xl max-w-lg mb-10 leading-relaxed">
                The secret to our legendary flavor isn't just the soil; it's the speed. Experience the
                sunrise-captured sweetness of mangoes that were on the tree just yesterday.
              </p>
              <div className="flex gap-4">
                <button className="bg-primary text-on-primary px-8 py-4 rounded-full font-bold flex items-center gap-2 hover:opacity-90 transition-all">
                  Taste the Freshness
                  <Icon name="arrow_forward" />
                </button>
              </div>
            </div>
            <div className="w-full lg:w-1/2 relative flex justify-center lg:justify-end">
              <div className="relative w-full max-w-[min(100%,300px)] sm:max-w-[340px] md:max-w-[380px] lg:max-w-none lg:w-full">
                <div className="aspect-[3/4] sm:aspect-[4/5] lg:aspect-[4/5] w-full rounded-xl overflow-hidden editorial-shadow shadow-lg lg:shadow-xl sm:rotate-1 lg:translate-x-2 translate-x-0">
                  <img
                    className="w-full h-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBDfVk5Qg_LGn0BywrDHOs_HK288jlTohFPgNT1z0_8TWK4WUrFXX6dWS2RdHi1LSxkbly5yqfKdHZMN_dcxLLPIzg-3sopoEt24EGFxYINPUz9ZRLlsHOJYEsQwAusarfeQTYqMAuWRn3xqB8aHTNVgSLxjki4L-7uLJPvn9q3dYQqYcEL-qYiJ02WQ7dk1Ds0o9SzDlfN4RHG1NSwzLmMLgL_HY2_KfeAuS_cm5Cf89f_M2RSJGEv-riE7sMKYBBWUeFzN3vaVfHI"
                    alt="Golden ripe mangoes on the tree branch"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 sm:-bottom-3 sm:-right-2 md:-bottom-4 md:-right-1 lg:-bottom-8 lg:-left-8 lg:right-auto w-[6.5rem] h-[6.5rem] sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-48 lg:h-48 bg-tertiary-container rounded-lg p-3.5 sm:p-4 lg:p-6 flex flex-col justify-end shadow-md ring-1 ring-black/5">
                  <span className="text-on-tertiary-container font-headline font-black text-xl sm:text-2xl md:text-3xl lg:text-4xl leading-none">
                    100%
                  </span>
                  <p className="text-on-tertiary-container text-[10px] sm:text-[11px] lg:text-xs font-bold uppercase tracking-widest leading-snug mt-1">
                    Organic Harvest
                  </p>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* JOURNEY — interactive roadmap */}
        <ScrollReveal as="section" className="bg-surface-container-low py-24 mt-12 overflow-hidden">
          <div className="max-w-7xl mx-auto px-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-16 gap-8">
              <div>
                <h2 className="font-headline text-4xl md:text-5xl font-bold tracking-tight mb-4">
                  The Freshness Journey
                </h2>
                <p className="text-on-surface-variant max-w-md">
                  Our logistical ballet ensures the fruit never lingers. Every minute is accounted for.
                </p>
              </div>
              <div className="hidden md:block h-[1px] flex-grow mx-12 bg-outline-variant/30 min-w-[4rem]" />
            </div>
            <div
              className="relative"
              role="region"
              aria-label="Interactive freshness journey timeline"
            >
              <FreshnessJourneyRoadmap />
            </div>
          </div>
        </ScrollReveal>

        {/* STANDARDS */}
        <ScrollReveal as="section" className="py-24 max-w-7xl mx-auto px-8">
          <h2 className="font-headline text-center text-4xl font-bold mb-16">The Orchard Standards</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: "eco", title: "Organic Certified", text: "We strictly follow regenerative agricultural practices to protect the soil and the fruit." },
              { icon: "biotech", title: "Zero Pesticides", text: "Natural pest control means you can enjoy our mangoes exactly as nature intended." },
              { icon: "glucose", title: "Brix-Level Testing", text: "We measure sugar content scientifically to ensure every harvest meets our sweetness bar." },
            ].map((c) => (
              <div
                key={c.title}
                className="bg-surface-container-lowest p-10 rounded-lg flex flex-col items-center text-center outline outline-1 outline-outline-variant/10"
              >
                <div className="w-16 h-16 bg-secondary-fixed rounded-full flex items-center justify-center mb-6">
                  <Icon name={c.icon} filled className="text-on-secondary-fixed-variant" />
                </div>
                <h4 className="font-headline text-lg font-bold mb-3">{c.title}</h4>
                <p className="text-on-surface-variant text-sm">{c.text}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>

        {/* COLD CHAIN */}
        <ScrollReveal as="section" className="py-24 bg-stone-900 text-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-8 flex flex-col lg:flex-row gap-16 items-center">
            <div className="w-full lg:w-1/2">
              <h2 className="font-headline text-4xl md:text-5xl font-bold leading-tight mb-8">
                Cold-Chain <br />
                <span className="text-secondary-fixed-dim">Mastery.</span>
              </h2>
              <p className="text-stone-400 text-lg mb-8 leading-relaxed">
                Ambient heat is the enemy of flavor. Our proprietary "Arctic-Transit" technology maintains a
                steady 12.8°C from the moment of picking until it reaches your porch. This precise temperature
                prevents bruising and locks in the volatile aromatic compounds that give our mangoes their
                floral bouquet.
              </p>
              <ul className="space-y-4">
                {[
                  "GPS-monitored thermal sensors",
                  "Biodegradable insulation liners",
                  "Zero-humidity storage pods",
                ].map((t) => (
                  <li key={t} className="flex items-center gap-3">
                    <Icon name="check_circle" className="text-secondary-fixed" />
                    <span className="text-stone-300">{t}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="w-full lg:w-1/2 relative">
              <div className="relative z-10 rounded-xl overflow-hidden grayscale hover:grayscale-0 transition-all duration-700">
                <img
                  className="w-full h-[400px] object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAbPLg7iLQ2N_hoA0O-X27Ga6D656ufAXnea5u6LQAHIEwqhs04CoU0YR9IsNzDsZJ2Vc4p1Us_iDmxoeyW7InHZChHBaouURvz8mAYYEXiNTAzDSHv1hIeJJHsfI1pkMxZ2KckODXuaRwFJcOuVRLLUD-l3v4_TNCmqhLzd6p9oSXN2vbrUzsiPoZRwe81_czF6XRO2OSYB2zyX-cynBWUsX6KpVV8pBOGOhYckw4WrFdlCEoDso-YZNGGHZSYk9Dq70M7C81KyLdC"
                  alt="Cold storage warehouse"
                />
              </div>
              <div className="absolute -top-10 -right-10 w-64 h-64 bg-primary/20 rounded-full blur-[100px]" />
            </div>
          </div>
        </ScrollReveal>

        {/* GUARANTEE */}
        <ScrollReveal as="section" className="py-32 bg-surface">
          <div className="max-w-4xl mx-auto px-8">
            <div className="bg-surface-container-lowest p-16 rounded-xl text-center relative overflow-hidden border border-primary-fixed">
              <div className="absolute top-0 left-0 w-2 h-full bg-primary" />
              <Icon name="verified" filled className="text-primary text-6xl mb-6" />
              <h2 className="font-headline text-3xl font-black mb-4 uppercase tracking-tighter">
                The Freshness Guarantee
              </h2>
              <p className="text-on-surface-variant text-lg mb-8 max-w-xl mx-auto">
                If your mangoes arrive with any signs of bruising or aren't the sweetest you've ever tasted,
                we'll replace the entire box within 24 hours. No questions, just fruit.
              </p>
              <div className="font-headline font-bold text-primary tracking-widest text-sm uppercase flex items-center justify-center gap-4">
                <span className="h-px w-8 bg-primary" />
                Signed by the Orchard Master
                <span className="h-px w-8 bg-primary" />
              </div>
            </div>
          </div>
        </ScrollReveal>
      </main>
    </div>
  </SiteShell>
);

export default Freshness;
