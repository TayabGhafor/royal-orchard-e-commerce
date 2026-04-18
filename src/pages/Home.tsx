import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useRef } from "react";
import { SiteShell } from "@/components/SiteShell";
import { Icon } from "@/components/Icon";
import { products } from "@/data/products";
import { useCart } from "@/store/cart";

const trending = [
  {
    name: "Dusehri Royal",
    sub: "Lush Sweetness",
    price: "Rs. 950",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAOklle5xXoJeqoR4aVRtN8HMtkxjOgPnT0Etkly_ErUBMVwwWhsvmlk05syx1T_T5zMpWD0J70sNg3NXTK82ihseyz40DSxbayXPSleVEz6xsVAk1XGgvVkPgsd4U01rUrmF_KwMHjRYyt_u3HaawDGPGvyMuUqTpuzju8-9w7bbz5DToSXth7vI3bC3dZrmilRU6bpCkDKESCRrry9qUjwARJom6Dnv8UY1wWXLITdENtQmNKvP9KbZ1FGuZENrAbqunfSAeInK4-",
  },
  {
    name: "Mango Mix Box",
    sub: "Variety Pack",
    price: "Rs. 3200",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuC2Q220Epu2WT_Mze6Fv12kdHUzGFhuEgfrRTnXLaq_z-CMbBBVQqJVTX6Fd13RYrd0LiSS6BhEw9q5c3htNGdnqlPmqN-EfhAA25S0CMlnHUS_9uCMBLEQXaz1uh0H8o46OygP-9bkq1_SyFb9Rxlukqc7ZkqR6VT_lCkmI0F-FxO3rxC4KY6lpgrHbrRnUsvC7B1TMyfa0irkL2j8HMmLnvq6skdmjfP_YOFR486asDEQdp7s-rkyZoSUbkz2PpaoUUeTo17k9YeC",
  },
  {
    name: "Black Chaunsa",
    sub: "Intense Aroma",
    price: "Rs. 1400",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBL94WGbtABZ0yJeGy2qlRGx6YVYLixJg_kJAqV5biCC7DcKtQ10ybGqSKib3GN6AZ_9KTGPFl8317Ep7m6MkrTUiLqC2tZ223RmMBPbMm_j9O4BTHSe7UNZmRhGQKJ7Kgo0PdpYzEekd-ubXQaYEsXPJMbXKhBgvvFyXh4DNPQyM9O8wYWkCo89MRsOhkziQ3_I2tt9sBDsqHIm2p75ZvPmAwPOrEHK2KeArVwvd0OROHR5pWWKwuCd-31Y4U07FwfAcDWnN504miR",
  },
  {
    name: "Organic Dried Mango",
    sub: "Sugar Free Snack",
    price: "Rs. 600",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBprUyfjuLzfr5pxlpErFMe39IiZID_xhavVZ8dMFnFoP6QWidKe2oYaamwqUZlUTh3qyszXkDqrsVRrNXiPCJXT_GWl91QV9cBPG4G68Md5zISFizryUlxbIZCtB_a5YOdnqT3Io77X61ZqrgKsnr7PVfQ2xK2J-ROh4XTo0Sgrls0XUCCaQiRh9lsUdUZclavHgKN6IzoLSop5zxpzM7yHl5VNGohBO1n3ZgOrrHhshxHnMqAevyQwwWG8Th9vLauS0BPZ2Qor78h",
  },
];

const reviews = [
  {
    text: "The sweetness is unparalleled. I've ordered Chaunsa from many places, but RoyalOrchard's quality and packaging are on another level.",
    name: "Amara Khan",
    role: "Verified Buyer",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuA-C-VZKdl6LP0HjV9JDr4KNDi28VbBBSlvccDmgmy5oWrz3syELqahPppnQjTHJ5mX3QPJHFCeb_xNU8nGzIh471qrJTomYA2O3kVjr2vdHlUJdIPH2uU8nc3-3e7TH2HGPmcJzew7x03TWEgVLSfA_2-D3HOsDLfFZuvqmFPmpwvFNW43nJK8xVCY3Sf724YJZHSv4XTpPQVHBcsIeWG5QTRyFha3vCcz6rvgVv8TJ7srb8Gh93l2BNPTS9WYn998BO7K7bZKvGBp",
  },
  {
    text: "Incredible service! Received my order within 20 hours of harvesting. The aroma when I opened the box filled the entire house.",
    name: "Zain Malik",
    role: "Restaurateur",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAJFh6j6ih6svA1KCEuupj0yI9MFC4rZX7PxENslCAupioJjHI549IEPbsE19qi41B1q352DYBLspP5KXlcEIWHGgL20JaDkBDGzXFHD62LMoJ9wkJRaJc728qzxOT5heovYEqDZDeTBtIhl5xAcQGYajWiNQIh0PwKD_gbv7ddiFGdkOMokVMofAgUmSDjgvrohendWMaO_-dHqSQQjabsUsInBuuXNEaad7XnIplch7NLQDMY-X_ck4qsrXIoM19w5VYCM2N1__70",
  },
  {
    text: "Freshness you can taste. This is the first time I've felt like I'm eating a mango straight from the tree here in the city.",
    name: "Sara Ahmed",
    role: "Food Blogger",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCJMNGg7BDxekCa9jRVb5WDzoBDIDDYJaejuOdyiCz9V_oO1Q9JC7w09jN3QOttaQJEjewq1riHDT54P-JuWUa3RnkzisTb47yHVB5uyItkGnvWOlscPSzXVMGzYwbkcmTIa2Hkfb6sf-fKFKhD3oHm-kDCsbB0i2AkdN3mn-eeh-SWUM82ByKNtzneWWx2HjftiEUmQcql6I8TKuMp8eGtnbMAMdxyPGP-ZoeEb1oo7Qavex2XkNNu6z1Nv5HDe2UMlnG9A5oKOLlM",
  },
];

const Home = () => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const addItem = useCart((s) => s.addItem);
  const setOpen = useCart((s) => s.setOpen);

  const scrollBy = (delta: number) => carouselRef.current?.scrollBy({ left: delta, behavior: "smooth" });

  return (
    <SiteShell>
      {/* HERO */}
      <section className="relative pt-32 pb-20 overflow-hidden hero-gradient">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1 flex flex-col gap-6 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="absolute z-10 bg-surface-container-lowest p-4 rounded-lg shadow-xl card-hover max-w-[200px] -top-20 left-60 lg:left-52 hidden md:block"
            >
              <div className="w-full aspect-square rounded-md overflow-hidden bg-surface-container-low mb-3">
                <img
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDZIRbthMFwmKYK1hDSLVezMk2nbKzyIoHfw2TcWeyEjiwciVHgNfXzuNJgKMyaWJ32ItGTLZGcu4owU7ctVTGfq7lOXa3hDp7wZabLZAs-hkOBvPZhk-hmKrLZfN41Wy_MxraiMg5d9dqcKK589RE7Wdhzrw-F3Zbt-SvsVnahqjGZbahivylww0IgHSe_2dNigP9nFurrakjKeVJSFAc1Gwf8bKnJayg2oUBSAC_1oBc6F2QNNOxUCfBX2lfQYoZW0eZRs56WBK2p"
                  alt="Fresh Chaunsa mango"
                />
              </div>
              <p className="font-headline font-bold text-sm">Fresh Chaunsa</p>
              <p className="text-primary font-bold text-xs mt-1">Rs. 1200 / 5kg</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-secondary p-8 rounded-lg text-on-secondary flex flex-col gap-4 shadow-2xl relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-secondary-fixed opacity-10 rounded-full translate-x-10 -translate-y-10" />
              <Icon name="eco" className="text-4xl" />
              <h3 className="font-headline text-2xl font-bold">From Farm to Table</h3>
              <p className="text-secondary-container text-sm leading-relaxed opacity-90">
                Harvested at peak ripeness from our sun-drenched
                <br />
                Multan orchards, delivered within 24 hours.
              </p>
              <Link to="/our-story" className="flex items-center gap-2 text-sm font-bold mt-2">
                Trace Origin <Icon name="arrow_forward" className="text-sm" />
              </Link>
            </motion.div>

            <div className="bg-surface-container-lowest p-6 rounded-lg shadow-lg flex items-center justify-between border border-outline-variant/10">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1 text-tertiary">
                  <Icon name="star" filled className="text-sm" />
                  <span className="font-bold text-lg text-on-surface">4.8/5</span>
                </div>
                <p className="text-xs text-outline font-medium">5000+ Happy Customers</p>
              </div>
              <div className="flex -space-x-3">
                <img
                  className="w-10 h-10 rounded-full border-2 border-white object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCccthID4oc4uuVtZHnA0GVhoqa8f2CnQ1nw-5GCQb6SwDHyGagwjuqL5Csxk2un3IbbEdth9GArIBwmsQqBAZqqn2H4M4Y_F9S-sFUqCkJPn63OKp2G6Ze1Mr6-Hogjv86lAj-l7Hsad7vtX2IfKkQRJ9xqX8BXgol116YSh75wLa7PAy0kBYyTI43K0SosNKtI8hSCJwPw0R-kbKQkIeHM_z8Gl7wN5PVEdgcTx67Uy1FcFoe1w3aw2nuAvTlDT5FZ5FKySBp5BgQ"
                  alt="Customer"
                />
                <img
                  className="w-10 h-10 rounded-full border-2 border-white object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDQFZ4pu8wQsutrtfPTJs_GULpsW-TQsY8doP1wG7-YEsZiuz43PQ1qThEtM33e78rfDceCyXbo8PUgeCl5fE1VzxdtnypE4OnMp3TlhXF8WUeaXrxn_AUPH6REaQxQ0okv8zms-IcOrk5zsokp99v5eNuqW1syDMEztiJlNjvCf8DV9Atkoq5VTZ_ssZrbtcPwACufFxpy8WFPcsWh-x_N6FilJEmvslycBdVgvoMU1krD3h-EQx2I4q1vms-npzSb3Rs-wCD3p8e8"
                  alt="Customer"
                />
                <div className="w-10 h-10 rounded-full border-2 border-white bg-primary-fixed flex items-center justify-center text-[10px] font-bold">
                  +2k
                </div>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2 flex flex-col gap-8 relative">
            <div className="inline-flex items-center gap-2 bg-secondary-container px-4 py-1.5 rounded-full w-fit">
              <span className="w-2 h-2 rounded-full bg-secondary" />
              <span className="text-on-secondary-container text-xs font-bold tracking-wider uppercase">
                Organic & Premium
              </span>
            </div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-headline text-6xl md:text-8xl font-extrabold tracking-tight leading-[0.95] text-on-background"
            >
              Garden Fresh <br />
              <span className="text-primary italic">Mangoes.</span>
            </motion.h1>
            <p className="text-lg text-outline max-w-md leading-relaxed">
              Experience the gold standard of tropical fruits. Hand-picked, naturally ripened, and bursting with
              honey-like sweetness.
            </p>
            <div className="flex flex-wrap gap-4 mt-4">
              <Link
                to="/shop"
                className="px-10 py-5 bg-primary text-on-primary text-lg font-extrabold rounded-full shadow-2xl cta-glow transition-all flex items-center gap-3"
              >
                Shop Now
                <Icon name="shopping_cart" />
              </Link>
              <div className="flex items-center gap-4 px-6 border border-outline-variant/30 rounded-full bg-white/50">
                <Icon name="verified" filled className="text-secondary" />
                <span className="text-sm font-bold">100% Organic Certified</span>
              </div>
            </div>
            <div className="hidden lg:block absolute -right-20 -bottom-20 w-[120%] h-auto opacity-20 pointer-events-none">
              <img
                className="w-full"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAJREDGOfBZUIuJtW5-r5pmzMT0k09qoboP9X9dbjfVDh-O-FQRqtKYv2iT7O3ykWOAbTMRz6hA0R7zFjtKKEKicJErDOPnE8wJ2oP_V0eiABJVNhhF4EEDjUE9JzrX-7me7ez_WQPGc-bmjyoQWR1oJ7Xqn7Bd9mjP4-j94y4rkGx8Zw8oKkWkRybcv0X73HyTbcQcKosSH1J70TlP_l8Aga1H09pWlDVram9UhDUUloJRFjXwyF9c_9oykcD2PPndv6-O8a9fIFi5"
                alt=""
              />
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: "local_shipping", value: "2390+", label: "Orders Daily", bg: "bg-primary-fixed", color: "text-primary" },
            { icon: "nature", value: "100%", label: "Natural Growth", bg: "bg-secondary-fixed", color: "text-secondary" },
            { icon: "groups", value: "34k", label: "Trusted Users", bg: "bg-tertiary-fixed", color: "text-tertiary" },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-surface-container-low backdrop-blur-xl p-8 rounded-lg flex items-center gap-6 border border-white/40 shadow-sm transition-transform hover:scale-105"
            >
              <div className={`w-14 h-14 ${s.bg} rounded-full flex items-center justify-center ${s.color}`}>
                <Icon name={s.icon} className="text-3xl" />
              </div>
              <div>
                <h4 className="text-2xl font-black font-headline">{s.value}</h4>
                <p className="text-sm text-outline font-medium">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* BEST SELLERS CAROUSEL */}
      <section className="py-24 bg-surface-container-lowest overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-12 flex items-end justify-between">
          <div className="flex flex-col gap-2">
            <h2 className="font-headline text-4xl font-extrabold text-on-background">Seasonal Best Sellers</h2>
            <p className="text-outline">Premium varieties at exclusive prices</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => scrollBy(-360)}
              className="w-12 h-12 rounded-full border border-outline-variant flex items-center justify-center hover:bg-primary hover:text-on-primary transition-colors"
              aria-label="Scroll left"
            >
              <Icon name="chevron_left" />
            </button>
            <button
              onClick={() => scrollBy(360)}
              className="w-12 h-12 rounded-full border border-outline-variant flex items-center justify-center hover:bg-primary hover:text-on-primary transition-colors"
              aria-label="Scroll right"
            >
              <Icon name="chevron_right" />
            </button>
          </div>
        </div>
        <div ref={carouselRef} className="flex gap-8 px-6 overflow-x-auto no-scrollbar pb-10 max-w-7xl mx-auto">
          {products.slice(0, 5).map((p, i) => (
            <Link
              to={`/product/${p.slug}`}
              key={p.id}
              className="min-w-[320px] bg-surface-container-low rounded-lg p-6 group transition-all card-hover"
            >
              <div className="relative w-full aspect-[4/5] rounded-md overflow-hidden mb-6">
                <img
                  className="w-full h-full object-cover transition-transform group-hover:scale-110"
                  src={p.images[0]}
                  alt={p.name}
                />
                {i === 0 && (
                  <span className="absolute top-4 left-4 bg-tertiary text-on-tertiary px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                    Sale -20%
                  </span>
                )}
                {i === 2 && (
                  <span className="absolute top-4 left-4 bg-secondary text-on-secondary px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                    New Season
                  </span>
                )}
              </div>
              <h3 className="font-headline font-bold text-xl mb-1">{p.name}</h3>
              <p className="text-sm text-outline mb-4">{p.tagline}</p>
              <div className="flex items-center justify-between">
                <p className="text-primary font-black text-xl">
                  ${p.price}
                  <span className="text-xs font-normal"> / {p.weights[0]}</span>
                </p>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    addItem(p, p.weights[0]);
                    setOpen(true);
                  }}
                  className="w-10 h-10 bg-secondary text-on-secondary rounded-full flex items-center justify-center hover:bg-primary transition-colors"
                  aria-label={`Add ${p.name}`}
                >
                  <Icon name="add" />
                </button>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* TRENDING GRID */}
      <section className="py-24 px-6 bg-surface">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-headline text-4xl font-extrabold mb-4">Top Trending Varieties</h2>
            <div className="w-20 h-1.5 bg-primary mx-auto rounded-full" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {trending.map((t) => (
              <Link to="/shop" key={t.name} className="group cursor-pointer">
                <div className="relative rounded-lg overflow-hidden aspect-square mb-4">
                  <img
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    src={t.img}
                    alt={t.name}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                    <button className="w-full py-3 bg-white text-on-surface font-bold rounded-lg transform translate-y-4 group-hover:translate-y-0 transition-transform">
                      Quick View
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold">{t.name}</h4>
                    <p className="text-xs text-outline">{t.sub}</p>
                  </div>
                  <p className="font-black text-primary">{t.price}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* JOIN ORCHARD CIRCLE + QUALITIES */}
      <section className="py-28 bg-surface-container-low border-y border-outline-variant/10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="flex flex-col gap-6 lg:pr-8">
            <h2 className="font-headline text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-on-primary-fixed-variant tracking-tight mb-4">
              Join our Orchard Circle
            </h2>
            <p className="text-outline text-xl leading-relaxed max-w-lg font-light">
              Become a part of our heritage. Gain exclusive access to seasonal harvest alerts, limited-edition
              varieties, and bespoke offers curated for the true mango connoisseur.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex flex-col sm:flex-row gap-3 max-w-lg mt-4"
            >
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-8 py-5 border border-outline-variant/30 bg-white/80 backdrop-blur-sm text-sm focus:ring-1 focus:ring-primary focus:border-primary transition-all outline-none rounded-full"
              />
              <button className="px-10 py-5 bg-primary text-on-primary font-bold cta-glow transition-all hover:bg-on-primary-fixed-variant whitespace-nowrap uppercase tracking-widest text-xs rounded-full">
                Join
              </button>
            </form>
          </div>
          <div className="grid grid-cols-2 gap-6">
            {[
              { icon: "rocket_launch", title: "Express Delivery", sub: "Farm to door in 24h", bg: "bg-secondary-container", color: "text-secondary" },
              { icon: "recycling", title: "Eco-Packing", sub: "100% Biodegradable", bg: "bg-primary-fixed", color: "text-primary" },
              { icon: "sentiment_satisfied", title: "Taste Guarantee", sub: "Sweetness in every bite", bg: "bg-tertiary-fixed", color: "text-tertiary" },
              { icon: "workspace_premium", title: "Certified Organic", sub: "No harmful chemicals", bg: "bg-secondary-container", color: "text-secondary" },
            ].map((q) => (
              <div
                key={q.title}
                className="group relative p-6 rounded-xl bg-white/40 backdrop-blur-md border border-white/60 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:bg-white/60"
              >
                <div
                  className={`w-14 h-14 rounded-full ${q.bg} flex items-center justify-center ${q.color} mb-5 shadow-inner transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}
                >
                  <Icon name={q.icon} className="text-2xl" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-headline font-extrabold text-on-background tracking-tight text-lg">
                    {q.title}
                  </h4>
                  <p className="text-xs text-outline font-medium uppercase tracking-widest leading-relaxed opacity-80">
                    {q.sub}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="py-24 px-6 bg-surface">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-headline text-4xl font-extrabold text-center mb-16 text-on-background">
            Customer Love
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((r) => (
              <div
                key={r.name}
                className="bg-white p-8 rounded-lg shadow-sm border border-outline-variant/10 relative"
              >
                <Icon
                  name="format_quote"
                  className="text-primary-fixed-dim text-6xl absolute -top-4 -left-2 opacity-30"
                />
                <div className="flex items-center gap-1 text-tertiary mb-4">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <Icon key={i} name="star" filled />
                  ))}
                </div>
                <p className="text-on-surface leading-relaxed mb-8 italic">"{r.text}"</p>
                <div className="flex items-center gap-4">
                  <img className="w-12 h-12 rounded-full object-cover" src={r.img} alt={r.name} />
                  <div>
                    <h5 className="font-bold text-sm">{r.name}</h5>
                    <p className="text-[10px] text-outline uppercase tracking-wider">{r.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </SiteShell>
  );
};

export default Home;
