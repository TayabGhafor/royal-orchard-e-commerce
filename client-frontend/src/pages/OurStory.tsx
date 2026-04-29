import { SiteShell } from "@/components/SiteShell";
import { Icon } from "@/components/Icon";
import { ScrollReveal } from "@/components/ScrollReveal";

/**
 * OurStory — pixel-faithful conversion of user-uploads://ourstory.html.
 * The global Navbar (RoyalOrchard glass-pill) is provided by SiteShell, per the
 * single-navbar rule. Only the page body content is converted here.
 */
const OurStory = () => (
  <SiteShell>
    <div
      className="bg-warm-cream text-dark-soil font-body overflow-x-hidden"
      style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/p6.png")' }}
    >
      {/* HERO */}
      <ScrollReveal as="section" className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            className="w-full h-full object-cover sepia-effect grayscale-[0.2]"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAPXVr7w97A9lDIAUKkYxirejxfW8uVEk1bAw27W7aWcboCqIRSRaO3KzlKnCExEFGNtZAn4euKfBvim7zqAU0ivC2GEvy8CceHHudkCYoDItezl1cWNovNT6V2_V6Cv3fGiKlKIGaJF7JkUWn3nUpkJRSL9Oj7oNbMMGVUKvsRQYxpBZvClldqgDTQtYsc1owaoccIlUG-ydEYP8Xl7iFZaqq-nGDtXOzlQUbjoWUg-AE4bnuUd9teDa1lqfn5Nt1Vq0FLlanEyi2_"
            alt="Royal Orchard heritage hero"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-warm-cream via-transparent to-transparent" />
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_50%_50%,#FFD700,transparent_70%)]" />
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <span className="text-olive uppercase tracking-[0.5em] font-bold text-xs mb-8 inline-block bg-retro-gold/20 px-4 py-1 rounded-full">
            Est. 1954
          </span>
          <h1 className="text-6xl md:text-9xl font-headline font-black text-dark-soil leading-[0.85] tracking-tight">
            The Royal <br />
            <span className="text-terracotta italic">Heritage</span>
          </h1>
        </div>
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-ochre/30 blob-shape blur-3xl" />
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-retro-gold/20 blob-shape-alt blur-3xl" />
      </ScrollReveal>

      {/* OUR ROOTS */}
      <ScrollReveal as="section" className="py-32 px-6 relative">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="relative order-2 lg:order-1">
            <div className="film-grain organic-border overflow-hidden aspect-square border-[16px] border-white shadow-2xl rotate-[-2deg]">
              <img
                className="w-full h-full object-cover sepia-effect"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB0ZYNDqbiR2MiLyMPzlBIX8gglFq3CFVWupvEFdaQInbB94s1QXCVq_DHGT8c9he0eobcmyhQ3kLQtgV-5cf-iZEI5U1Z66-mxdPDSf-paWujdt_iavqL6nDjOQablY71Cb8jKzPB5ZV7j1tNk1xIDE-jUm-7jHF5qFHpZXUdDEPHxkGwce2PE4p3qePIDgV3KUM0gYpAfdABAOgTH4MfnKlESy5g_j_U2EprS7pUqHDuJ4WGbVvvijgD8NGhXK5DBBtcyreZx2AeX"
                alt="Founder's hands holding a mango"
              />
            </div>
            <div className="absolute -bottom-10 -right-10 bg-retro-gold blob-shape p-10 flex items-center justify-center text-center w-56 h-56 shadow-xl rotate-[5deg]">
              <p className="text-dark-soil font-headline font-extrabold text-lg leading-tight">
                From a single sapling to a legacy.
              </p>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <h2 className="text-5xl font-headline font-black text-terracotta mb-10 tracking-tight flex items-center gap-4">
              <span className="w-12 h-[2px] bg-ochre" /> Our Roots
            </h2>
            <div className="space-y-8 text-dark-soil/80 text-xl leading-relaxed font-medium">
              <p>
                It began in the golden summer of 1954, when our patriarch, Elias Thorne, planted the first Kent
                mango sapling in the heart of the valley. What was once a humble endeavor born from a passion
                for the land has flourished into the Royal Orchard we know today.
              </p>
              <p>
                Through three generations, the Thorne family has nurtured these groves with a singular focus:
                to elevate the mango from a mere fruit to a masterpiece of nature. We don't just grow harvests;
                we preserve the wisdom of our ancestors, blending time-honored tradition with modern precision.
              </p>
              <div className="relative py-6 pl-10 border-l-2 border-ochre/30">
                <span className="absolute left-0 top-0 text-6xl text-retro-gold opacity-50 font-serif leading-none">
                  “
                </span>
                <p className="italic text-terracotta font-bold text-2xl tracking-tight leading-tight">
                  "The soil remembers those who care for it, and it pays them back in sweetness." — Elias Thorne
                </p>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* PHILOSOPHY */}
      <ScrollReveal as="section" className="bg-dark-soil py-40 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-32 bg-warm-cream blob-shape scale-x-[2.5] -translate-y-20" />
        <div className="max-w-screen-2xl mx-auto px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-24">
            <h2 className="text-6xl font-headline font-black text-warm-cream mb-8 tracking-tighter">
              The Orchard Philosophy
            </h2>
            <p className="text-retro-gold/80 text-2xl font-medium">
              We believe in the slow rhythm of nature. At Royal Orchard, time is our most essential ingredient.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            <div className="group">
              <div className="mb-10 organic-border overflow-hidden aspect-[4/5] film-grain border-8 border-olive/30 rotate-1 group-hover:rotate-0 transition-transform duration-700">
                <img
                  className="w-full h-full object-cover sepia-effect brightness-110"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCnVHERM2IUfvTyNIxteAc1M38JwghxcufaPduP9b_XQj3Nwxc83ypx2bbetlT3vqWwEcLuAZepmIz20FuNv27w_vWsNulgIKasmRLimj2GXuRf7-U1YKRPC2spGvi4e1fdnqdHt03Oq-51dJG4bESsvGkkMA99b4Il2E4WTBLz63TQW1f53a8-IQw2bDBi2LjjaaFuBqesl6uN-hteiDO9NkXAGeO6LOf1DmNCwQqLVK-xumrgQlWra5XpS5_vLtoVaIjG5fpL_jZc"
                  alt="Sun-ripened mangoes on tree"
                />
              </div>
              <h3 className="text-3xl font-headline font-bold text-retro-gold mb-4 tracking-tight">
                Sun-Ripened
              </h3>
              <p className="text-warm-cream/70 text-lg leading-relaxed">
                We never rush the process. Our mangoes remain on the tree until they reach their peak Brix
                levels, drinking in the tropical sun until they are heavy with juice.
              </p>
            </div>
            <div className="group md:translate-y-20">
              <div className="mb-10 organic-border overflow-hidden aspect-[4/5] film-grain border-8 border-terracotta/30 -rotate-2 group-hover:rotate-0 transition-transform duration-700">
                <img
                  className="w-full h-full object-cover sepia-effect brightness-110"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCnDxGc48tspD6cdMNhreaUxLcAH7Gnn1bYDkF-aafA0O69mKCWezLqsexMC9_GJ04WMM6yJgybe8M1IZ9qxwwwiB-fLP8sN5Vf7TmbwjxFAPyRPhyziQggnc7HwYkGHQMmJd0Mpxj6xYui68WOGK1BjrLkb9v14Bj4fhpb8XBerMFGUcirntTx87O1O2ek8s1f47ij38ymua1jgWcss7d2-FmAUki0M9k5JWY-bQZvks3tCYBCWv92FfAvFHRSR4V1FNFBf2i4t3oc"
                  alt="Hand-picked mangoes"
                />
              </div>
              <h3 className="text-3xl font-headline font-bold text-retro-gold mb-4 tracking-tight">
                Hand-Picked
              </h3>
              <p className="text-warm-cream/70 text-lg leading-relaxed">
                Precision requires a human touch. Every fruit is individually inspected and harvested by hand to
                ensure no bruising and absolute perfection in every box.
              </p>
            </div>
            <div className="group">
              <div className="mb-10 organic-border overflow-hidden aspect-[4/5] film-grain border-8 border-ochre/30 rotate-3 group-hover:rotate-0 transition-transform duration-700">
                <img
                  className="w-full h-full object-cover sepia-effect brightness-110"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuChQHaAfHoBMifVsdC-ctf6kj-2agBi2Kuk2vpRmpwYpzOKiS7EI5fLQm0tvei2K4FMUDrUrrZ1TebxW4LEvAX_snXVshK7F-9xe-B_chuy9h8prMf2e1X0W0hOXsZXHNE8nEaMTHxfLLFTCOwZQ619JOR2ZQq8TUyt5oQXbg4lV3rk48pfVd_1avQyYUcckpfXOB9wPJoGVWgccXLWmE93tha5GeV-hRSKcUsK6q0s3KWmEG9admZfnsuup1lr_aw1ZRxVUTcxD8s9"
                  alt="Organic care of trees"
                />
              </div>
              <h3 className="text-3xl font-headline font-bold text-retro-gold mb-4 tracking-tight">
                Organic Care
              </h3>
              <p className="text-warm-cream/70 text-lg leading-relaxed">
                Our ecosystem is sacred. We use sustainable, chemical-free practices to ensure the soil remains
                as vibrant for our children as it was for our grandparents.
              </p>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* COMMITMENT BLOBS */}
      <ScrollReveal as="section" className="py-40 px-6">
        <div className="max-w-6xl mx-auto flex flex-col gap-8">
          <div className="flex flex-col md:flex-row gap-8 items-stretch">
            <div className="flex-1 bg-terracotta text-warm-cream blob-shape p-16 shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-retro-gold opacity-0 group-hover:opacity-10 transition-opacity" />
              <Icon name="eco" className="text-6xl mb-8 text-retro-gold" />
              <h2 className="text-5xl font-headline font-black mb-6 leading-none">Our Commitment</h2>
              <p className="text-xl opacity-90 leading-relaxed font-medium">
                Sustainability isn't a trend for us; it's our survival. From water conservation to biodegradable
                packaging, we are committed to leaving the earth better than we found it.
              </p>
            </div>
            <div className="flex-1 bg-olive blob-shape-alt p-1 relative overflow-hidden min-h-[400px]">
              <img
                className="absolute inset-0 w-full h-full object-cover mix-blend-multiply sepia-effect opacity-60"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCcaYzkVjUXF2gR1lcpLTyNkTFYzSL5yUfZm5rU4PmN1XvzqRQ2Cdlgd2Cwo0dny6kLJsAlihTB56856uPUA4JYsoJIzA47y2lgRdlER6HUTPc6cuz1UMnYpwhj0Bvv4enzbIiXFnuFwHOzqRYeAXjtp9-PT9yngAuyYgPVd3baQ0ur5zCupmJcdZcg7RBiNMrXJLHEsEMxjX6R1Hlw_q4xXqbDzD2eFxSu9oZJyMsuHgSlfkEnNn92KskXEzAWU7QeAzgI6TO8yPwp"
                alt="Community"
              />
              <div className="absolute inset-0 flex items-center justify-center p-12 text-center">
                <h3 className="text-warm-cream font-headline font-black text-4xl leading-tight">
                  Community Support
                </h3>
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1 bg-ochre/20 organic-border p-12 flex flex-col items-center justify-center text-center border-4 border-ochre/40">
              <h4 className="text-terracotta font-headline font-black text-7xl mb-2">0</h4>
              <p className="text-olive text-sm font-bold uppercase tracking-[0.3em]">Pesticides Used</p>
            </div>
            <div className="flex-1 retro-gradient blob-shape p-12 flex flex-col items-center justify-center text-center shadow-xl">
              <h4 className="text-dark-soil font-headline font-black text-7xl mb-2">100%</h4>
              <p className="text-dark-soil/80 text-sm font-bold uppercase tracking-[0.3em]">Recyclable</p>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* TEAM */}
      <ScrollReveal as="section" className="py-32 bg-olive/5 relative">
        <div className="max-w-screen-xl mx-auto px-8">
          <h2 className="text-5xl font-headline font-black text-center mb-24 text-terracotta tracking-tighter italic">
            The Faces Behind the Harvest
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-16">
            {[
              {
                img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCWTJf3WYwMsHwM0cLMcM1iDLA-4tkwApKI0hNBB1_L1jGVJU9y6mwzPgDmQn7hpszx89los3qyqVORetjbBt8Yggt-1xsmLbpVPFP7BqsfEC8CnUxpk0-kS7M_CqGKgg6T9is6-RTpD4jBVPEUFjDBUrCbpigFJaMElVj3YWyG2rFGmPFycAJqPNR5J1I8m33a1XHg0KnrwWVwhfwfox_eoUOO4lcA5gTPX_25PRPFdcrZsGtcZrxE4b0lHibMawEkeS1Ihg9_iciS",
                name: "Thomas Thorne",
                role: "Master Orchardist",
                offset: "",
              },
              {
                img: "https://lh3.googleusercontent.com/aida-public/AB6AXuA-rtfdNKnB07TSSHNHjw76CEJSbIHSt-0iolo1fQELQz7WZdYR9oQrXPxrYk2ZaCeUTPBSCDs3bDzZsnJriMBEfBz2QQtDr9_786opFCgV-QWObaKaotKAD80aI8LURv-LFoZyVMlSbOvxmtGGk6XuIqSKvagpMCgPMaS52LvfeY8h9WnsBaBs1JJT2jNx0SPgiIDBPf1qrRzQj63XOIRzCDumpvUYIkSuCI7rBD0QQtIntlrOY9zfkF9AY4lpFQbigagEN_Jko1ay",
                name: "Elena Thorne",
                role: "Sustainability Director",
                offset: "lg:translate-y-8",
              },
              {
                img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDnE3ReC7iAiR38IP-49mC_W4R1gLMZSigFBB7lWXU3oecAG5qT4E6EL9t7tnxVx25mitmVa2hZqwCNBAueKKdvCa9D2ySBX7wAyjgf52758EbTKx_ehlLMA03J27mmjMPfGRqJrluwhxYFA3nFY02T8c6hkS6wJAXt3iKSGIaGJIaAomtCoh4mOY7oiuKgSAGbZnn9lsVGVyuisBJLzfoRQxHG3EWtP5ejriWdcn8IBHaLy5zdyLxf1CS4D6ipGZH3N9jNtYacqr_X",
                name: "Miguel Santos",
                role: "Harvest Manager",
                offset: "",
              },
              {
                img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCbMfCJN-eMvJ9QwP-G4J81D9Pn1fCvO0B-fu6fCptnJgYElIm5sqv45ayegrpV5lADHb15M1DcIcYbc1bGaRJQ2mowCDibkz24tbNDUOC0p9c2g-So0K9rwzsI4_vCRk1od2ATH6JErah-7rB-ATxijFBhA1AECGvnCHZKWJIZwTGuInHMWGFuviF67hNT4LNUWsZeuDy38gxGaDHEQQB6nNh8IPKP22sCOZfbgO1D_JTiogfHKRsPjL6YfPfSvLapp2W3z4_f4FYQ",
                name: "Sarah Jin",
                role: "Quality Specialist",
                offset: "lg:translate-y-8",
              },
            ].map((p) => (
              <div key={p.name} className={`text-center group ${p.offset}`}>
                <div className="w-60 h-64 mx-auto organic-border overflow-hidden mb-8 border-[10px] border-white shadow-lg film-grain group-hover:scale-105 transition-transform">
                  <img className="w-full h-full object-cover sepia-effect" src={p.img} alt={p.name} />
                </div>
                <h4 className="font-headline font-black text-2xl text-dark-soil">{p.name}</h4>
                <p className="text-terracotta font-bold uppercase tracking-widest text-xs mt-1">{p.role}</p>
              </div>
            ))}
          </div>
        </div>
      </ScrollReveal>
    </div>
  </SiteShell>
);

export default OurStory;
