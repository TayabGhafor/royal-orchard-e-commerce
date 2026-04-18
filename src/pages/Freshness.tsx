import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { SiteShell } from "@/components/SiteShell";
import { Icon } from "@/components/Icon";

const Freshness = () => (
  <SiteShell>
    <section className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <header className="text-center mb-20 max-w-3xl mx-auto">
        <span className="inline-block px-4 py-1.5 bg-secondary-fixed text-on-secondary-fixed-variant text-xs font-bold rounded-full mb-6 tracking-widest uppercase">
          The Freshness Promise
        </span>
        <h1 className="font-headline text-6xl md:text-7xl font-extrabold tracking-tighter leading-tight mb-6 text-editorial-gradient">
          Picked today.
          <br />
          At your door tomorrow.
        </h1>
        <p className="text-lg text-on-surface-variant leading-relaxed">
          Our entire supply chain — from grove to gateway — is engineered around one number: 24 hours.
        </p>
      </header>

      {/* Process */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-24">
        {[
          { icon: "agriculture", step: "01", title: "Hand Picked", text: "At sunrise, when the fruit is coolest and at peak sweetness." },
          { icon: "checkroom", step: "02", title: "Sorted & Tested", text: "Each mango is inspected, weighed and brix-tested before packing." },
          { icon: "inventory_2", step: "03", title: "Eco Packed", text: "Wrapped in biodegradable straw inside temperature-controlled boxes." },
          { icon: "rocket_launch", step: "04", title: "24h Delivery", text: "Dispatched same day via insulated express courier." },
        ].map((s, i) => (
          <motion.div
            key={s.step}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="bg-surface-container-lowest p-8 rounded-lg shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all"
          >
            <span className="text-xs font-bold text-outline tracking-widest">{s.step}</span>
            <div className="w-14 h-14 rounded-full bg-primary-fixed text-primary flex items-center justify-center my-4">
              <Icon name={s.icon} className="text-2xl" />
            </div>
            <h3 className="font-headline font-bold text-lg mb-2">{s.title}</h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">{s.text}</p>
          </motion.div>
        ))}
      </div>

      {/* Care guide */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-surface-container-low rounded-xl p-12 mb-20">
        <div>
          <h2 className="font-headline text-4xl font-extrabold mb-6">Care for your harvest</h2>
          <ul className="space-y-4">
            {[
              "Store unripe mangoes at room temperature, away from direct sunlight.",
              "Once fragrant and slightly soft, refrigerate for up to 5 days.",
              "Slice with the seed; cube the cheeks for the cleanest serve.",
              "Pair with sea salt, lime or chilli for a brighter flavour.",
            ].map((tip) => (
              <li key={tip} className="flex items-start gap-3 text-on-surface-variant">
                <Icon name="check_circle" filled className="text-secondary flex-shrink-0 mt-0.5" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="aspect-[4/3] rounded-lg overflow-hidden shadow-xl">
          <img
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCNVLGDZeJl9Jme6n1miSkcvO4tKBL2-CM1Qs4VlTpsbMpZw-bMqk5JLarknyoqNxKQkMzzgQLNNnjRXWLnO4BD2C5ieCaDZh7Tqsbcr47-0bSBwfDyGmlwMuur4OnuEWOri6RePPdFawdTm9YuH1DTKyPMTveZDte5bsPHO9L3QH-I1WtdMot7OFko8u7uQyPqM88r6TuHy3JD5yg-I38MXtHutxQ6lNiXr6rvxzBr1EqQ2VYHaOftWSGIOF-t9MihvKEHtMZycWsm"
            alt="Sliced mango"
          />
        </div>
      </div>

      {/* Guarantee */}
      <div className="text-center bg-secondary text-on-secondary rounded-xl p-12">
        <Icon name="verified" filled className="text-5xl mb-4" />
        <h2 className="font-headline text-4xl font-extrabold mb-4">The Sweetness Guarantee</h2>
        <p className="max-w-xl mx-auto opacity-90 mb-8">
          If a single mango doesn't meet our standard, we'll replace your entire box — no questions asked.
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-3 px-8 py-4 bg-on-secondary text-secondary rounded-full font-bold hover:opacity-90 transition-opacity"
        >
          Order with confidence
          <Icon name="arrow_forward" />
        </Link>
      </div>
    </section>
  </SiteShell>
);

export default Freshness;
