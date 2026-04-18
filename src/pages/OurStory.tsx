import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { SiteShell } from "@/components/SiteShell";
import { Icon } from "@/components/Icon";

const milestones = [
  { year: "1962", title: "First Sapling", text: "A single Sindhri sapling planted on family land in Tando Jam." },
  { year: "1988", title: "The Grove Expands", text: "Three generations cultivate over 200 heritage trees." },
  { year: "2014", title: "Going Organic", text: "Transitioned to fully certified organic, chemical-free practices." },
  { year: "2024", title: "Direct to You", text: "RoyalOrchard ships peak-ripe fruit straight to your doorstep." },
];

const OurStory = () => (
  <SiteShell>
    <section className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center mb-24">
        <div className="lg:col-span-5">
          <span className="inline-block px-4 py-1.5 bg-secondary-fixed text-on-secondary-fixed-variant text-xs font-bold rounded-full mb-6 tracking-widest uppercase">
            Our Heritage
          </span>
          <h1 className="font-headline text-6xl md:text-7xl font-extrabold tracking-tighter leading-tight mb-6 text-editorial-gradient">
            Three generations.
            <br />
            One golden fruit.
          </h1>
          <p className="text-lg text-on-surface-variant leading-relaxed mb-8">
            From a single sapling planted in the sun-drenched soil of Tando Jam, RoyalOrchard has grown into a
            family of farmers, packers, and tasters obsessed with one thing — the perfect mango.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-on-primary rounded-full font-bold cta-glow transition-all"
          >
            Taste the harvest
            <Icon name="arrow_forward" />
          </Link>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="lg:col-span-7 relative"
        >
          <div className="aspect-[4/3] rounded-xl overflow-hidden bg-surface-container-low shadow-2xl">
            <img
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAOklle5xXoJeqoR4aVRtN8HMtkxjOgPnT0Etkly_ErUBMVwwWhsvmlk05syx1T_T5zMpWD0J70sNg3NXTK82ihseyz40DSxbayXPSleVEz6xsVAk1XGgvVkPgsd4U01rUrmF_KwMHjRYyt_u3HaawDGPGvyMuUqTpuzju8-9w7bbz5DToSXth7vI3bC3dZrmilRU6bpCkDKESCRrry9qUjwARJom6Dnv8UY1wWXLITdENtQmNKvP9KbZ1FGuZENrAbqunfSAeInK4-"
              alt="Farmer in orchard"
            />
          </div>
          <div className="hidden md:block absolute -bottom-12 -left-12 w-56 h-72 rounded-lg overflow-hidden shadow-xl border-8 border-surface transform -rotate-6">
            <img
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuChe8GtlYi8VjPyQ1LDvxPWjcg5bmC0Lu9bGI6xI42Der_QazL2ZpeT98nk_bDwXtkMY3yQ2s7T5zl_L1xS8CELhe2SnXpNmUdnTRn_GRl4dVrLNokLEhNECDslWcSk38PBJS9sPqtmTGFpvX2OUJc0WKV2fh4O-uJvDUmvlqUxRuBYN3cBGtdV5bYrQcCpOe7sQt3mwyryIO7xQv2-eN_gzScw4d2BFP55aY4DuJT3iGmsoQKPJAl3fl4Ant_o0F9psP3kSBc39MWO"
              alt="Hand-picked basket"
            />
          </div>
        </motion.div>
      </div>

      {/* Timeline */}
      <section className="bg-surface-container-lowest rounded-xl p-12 mb-20">
        <h2 className="font-headline text-4xl font-extrabold mb-12 text-center">A Living Timeline</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {milestones.map((m, i) => (
            <motion.div
              key={m.year}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="space-y-3"
            >
              <span className="font-headline text-3xl font-extrabold text-primary">{m.year}</span>
              <h3 className="font-bold text-lg">{m.title}</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">{m.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Values */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { icon: "eco", title: "Soil First", text: "We feed our soil before we feed our trees. Living earth grows the sweetest fruit." },
          { icon: "groups", title: "Family Owned", text: "Every box is packed by people whose name is on the door." },
          { icon: "workspace_premium", title: "Zero Compromise", text: "If a fruit doesn't pass our taste test, it never reaches yours." },
        ].map((v) => (
          <div
            key={v.title}
            className="p-8 rounded-lg bg-white/40 border border-white/60 backdrop-blur-md hover:-translate-y-1 hover:shadow-xl transition-all"
          >
            <div className="w-14 h-14 rounded-full bg-secondary-container text-secondary flex items-center justify-center mb-5">
              <Icon name={v.icon} className="text-2xl" />
            </div>
            <h3 className="font-headline font-extrabold text-xl mb-2">{v.title}</h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">{v.text}</p>
          </div>
        ))}
      </div>
    </section>
  </SiteShell>
);

export default OurStory;
