/**
 * Curated knowledge synced from the storefront (Royal Orchard client).
 * Titles are prefixed with [Site] so they can be refreshed on each server boot
 * without touching admin-created entries.
 */
const { ChatbotKnowledge } = require("./chatbot-knowledge.model");

const SITE_PREFIX = "[Site]";

const SITE_KNOWLEDGE_ENTRIES = [
  {
    title: `${SITE_PREFIX} Site map & store basics`,
    type: "text",
    content: `Royal Orchard storefront (royalorchard.com) — main areas:
Home (/): hero, seasonal best sellers, trending varieties, newsletter signup, customer reviews carousel.
Shop (/shop): hero carousel, product catalog with filters (variety Sindhri/Chaunsa/Anwar Ratol/Langra/Mixed, weight 3kg/5kg/8kg, search), add to cart from cards.
All products (/all-products): broader listing.
Product detail (/product/:slug): images, description, weight options, add to cart.
Cart (/cart): line items, quantities, checkout link.
Checkout (/checkout): shipping and payment flow for logged-in or guest flow where applicable.
Account (/account): profile for signed-in users.
Orders (/orders): order history and status for signed-in users.
Login (/login), Signup (/signup), Forgot password flow (/forgot-password, /verify-reset-code, /reset-password).
Our story (/our-story): heritage brand narrative.
Freshness (/freshness): from branch to box, interactive freshness journey, orchard standards, cold chain, freshness guarantee.
Wholesale (/wholesale): partnership tiers, inquiry form, contact blocks.
FAQ (/faq): ordering, shipping, varieties, wholesale partnerships.
Policies: Shipping (/shipping-policy), Refund (/refund-policy), Fruit care (/fruit-care-guide), FAQ, Privacy (/privacy), Terms (/terms), Security (/security).
Footer links include shop, our story, wholesale, policies, social Instagram and Facebook.
Currency: prices on the live shop are in PKR (Rs.). Live stock and prices always come from the product database — the assistant should prefer live data when users ask current price or stock.`,
  },
  {
    title: `${SITE_PREFIX} FAQ — ordering, shipping, varieties`,
    type: "text",
    content: `Ordering & Payment: International orders accept major credit cards (Visa, Mastercard, AMEX), Apple Pay, Google Pay, and wire transfers for orders over $5,000; transactions are encrypted. Orders can only be modified within 4 hours of placement due to perishability — contact concierge urgently for changes.
Shipping & harvest: Each mango sits in a custom molded biodegradable pulp sleeve, nested in double-walled corrugated boxes with impact absorbing corners. Climate-controlled transit and farm-to-door speed are highlighted on the shipping policy page.
Varieties: Royal Alphonso is described as ideal for sweet fiberless dessert (buttery texture, honey-saffron aroma). All Royal Orchard harvest is described as USDA and EU Organic certified with zero synthetic pesticides and natural orchard management.
Wholesale partnerships: Michelin-starred restaurants and high-end grocers; seasonal contracts; "Apply for Partnership" on FAQ.
Still need help: concierge email concierge@mangoeditorial.com, live chat typical response 2 mins, phone +1 (800) MANGO-CON (as shown on FAQ page).`,
  },
  {
    title: `${SITE_PREFIX} Shipping policy highlights`,
    type: "text",
    content: `Royal Orchard shipping narrative: speed with care; mangoes spend less time in transit. Local delivery 24–48 hours; international 3–5 business days (as stated on page). Thermal wrap / temperature-controlled crates (~14°C climate shield), eco pulp biodegradable packaging, zero plastic messaging, cradle-mesh so fruits do not touch. Transparent rate examples (Boutique Box 3kg, Family Crate 5kg, etc. — illustrative dollar amounts on page). Bulk 10+ crates may qualify for dedicated refrigerated courier at no extra cost. Real-time tracking: SMS/email with live link, interactive map through hubs.`,
  },
  {
    title: `${SITE_PREFIX} Refund & quality promise`,
    type: "text",
    content: `Refund eligibility: requests within 24 hours of delivery; fruit must be in original packaging (perishable produce). Process: email support with order number and clear photos; quality control reviews within 48 hours. Damaged in transit: full replacement or refund; temperature-controlled shipping tracked. Orchard promise: picked at peak ripeness, sun-ripened, no artificial chemicals; if sweetness/texture below Royal Orchard standard, team will make it right. 100% organic farming and direct grove-to-door messaging on page.`,
  },
  {
    title: `${SITE_PREFIX} Privacy policy (April 2026)`,
    type: "text",
    content: `Privacy: data collected includes name, email, phone, delivery address when you register, order, or contact; plus technical data (IP, browser, device) automatically. Uses: fulfill orders, order updates and harvest alerts and offers, improve site and products, legal compliance. Data is not sold. Sharing only with couriers, payment processors, analytics under confidentiality, or when required by law. Cookies remember cart, preferences, session — disabling may break features. Rights: access, correction/deletion, opt out of marketing, portable copy. Retention: while account active and up to 7 years after for tax/accounting. Contact: privacy@royalorchard.com or Royal Orchard Pvt Ltd, Multan, Pakistan.`,
  },
  {
    title: `${SITE_PREFIX} Terms of service`,
    type: "text",
    content: `Terms: using royalorchard.com binds you to Terms and Privacy; discontinue if you disagree. Eligibility: 18+ or parental consent; accurate information required. Products are natural — slight size/shape/color variation is expected, not a defect. Pricing in PKR inclusive of applicable taxes unless stated; prices may change; payment in full before dispatch except COD where offered. Order confirmation is not acceptance — Royal Orchard may cancel for inventory, pricing errors, or suspected fraud. IP: all site content is owned by Royal Orchard Pvt Ltd. Liability capped at amount paid for the relevant order; no indirect/consequential damages to the extent permitted. Governing law: Islamic Republic of Pakistan; disputes in competent courts of Multan.`,
  },
  {
    title: `${SITE_PREFIX} Security practices`,
    type: "text",
    content: `Security page: TLS 1.3 for all traffic; no full card numbers stored; PCI-DSS Level 1 payment processors; tokenized references for refunds. Passwords hashed with salts; suspicious logins throttled and emailed; 2FA available on request for high-value accounts. Cloud infrastructure with monitoring, IDS, patching; data encrypted at rest (AES-256). Admin access logged and need-to-know. Responsible disclosure: security@royalorchard.com, acknowledgment within 72h for breaches affecting personal data.`,
  },
  {
    title: `${SITE_PREFIX} Our story — heritage`,
    type: "text",
    content: `Our Story: Est. 1954 heritage positioning — Royal Orchard / Thorne family narrative: first Kent mango sapling in the valley, three generations nurturing groves, blending tradition with modern precision. Quote theme: "The soil remembers those who care for it, and it pays them back in sweetness." — Elias Thorne. Visual story-led page with roots, craftsmanship, and editorial orchard photography.`,
  },
  {
    title: `${SITE_PREFIX} Freshness page — journey & standards`,
    type: "text",
    content: `Freshness page hero: mangoes from branch to box in 24 hours; sunrise-captured sweetness from Multan orchards. Interactive "Freshness Journey" on site: (1) Plucked at dawn ~5AM when cool and brix peak. (2) Sorted with care — manual inspection for bruising, skin, ripeness. (3) Chilled immediately — flash cooling stops ripening clock. (4) Same-day dispatch — fleet by 4PM for overnight transit. Orchard standards: Organic certified practices, zero pesticides messaging, Brix-level sweetness testing. Cold chain: "Arctic-Transit" ~12.8°C from pick to porch; GPS thermal sensors, biodegradable liners, zero-humidity pods. Freshness guarantee: replace entire box within 24h if bruised or not sweetest — no questions.`,
  },
  {
    title: `${SITE_PREFIX} Fruit care & ripening guide`,
    type: "text",
    content: `Fruit care guide: Ripening — color alone is unreliable (e.g. Sindhri can stay pale when ripe). Feel: slight yield like peach/avocado when ripe. Aroma near stem is the most reliable signal. Storage: room temp to ripen; paper bag speeds ripening via ethylene. Once ripe, refrigerate up to ~5 days; do not refrigerate unripe. Variety notes: Sindhri — honey smell means ready, pale gold skin. Chaunsa — softens fast; consume within ~24h when aroma fills room. Langra — stays green when ripe; use squeeze and pine-like scent, not yellow color. Cutting styles: Hedgehog grid and Rose Petal spiral described on page.`,
  },
  {
    title: `${SITE_PREFIX} Static catalogue (reference) — verify live on /shop`,
    type: "text",
    content: `Reference product lineup from the storefront seed data (live DB may differ): 
Sindhri Honey Gold — Queen of Mangoes, Tando Jam, fiber-less texture; Premium Reserve; weights 3/5/8kg; indicative client seed price Rs.4500 base.
Anwar Ratol Special — intense aroma, velvety fiber-less; Seasonal Specials; Rs.5200 base.
Chaunsa Delight — golden skin when ripe, classic premium; Premium Reserve; Rs.3800 base.
Langra Green — green skin when ripe, tart-sweet; Seasonal Specials; Rs.3200 base.
Smoothie Grade — ripe with minor blemishes, juices/lassis; Bulk Harvest; 5kg & 8kg; Rs.2800 base.
Sindhri Bulk Crate — wooden crate, families/small business; Bulk Harvest; 8kg; Rs.6500 base.
Collections: Premium Reserve, Seasonal Specials, Bulk Harvest. Varieties: Sindhri, Chaunsa, Anwar Ratol, Langra, Mixed. Always tell shoppers to open /shop for current PKR, stock, and images.`,
  },
  {
    title: `${SITE_PREFIX} Wholesale & partnerships`,
    type: "text",
    content: `Wholesale page: global retailers and distributors; refined varieties from orchards. Aura advantage: traceability QR on shipments (harvest date, orchard block, soil health). Cold-chain mastery for ripening stage on arrival. Dedicated account manager for inventory and forecasting. Tier examples: Boutique Retailer 50kg+; Primary Distributor 250kg+ with co-branding and net-30; Global Enterprise 1000kg+ with rebates and ERP API. Inquiry form on /wholesale#inquiry — vetting team responds in about 4 business hours. Contact blocks on page list wholesale@mangoraura.com and +44 (0) 800-MANGO-AURA (as displayed in UI).`,
  },
  {
    title: `${SITE_PREFIX} Shop hero & seasonal messaging`,
    type: "text",
    content: `Shop hero carousel themes: Harvest Season 2024 / limited Sindhri; Pure Golden Indulgence handpicked from Sindh; Freshly Picked Delivered Fast farm to door 24h; New Arrivals finest varieties; Royal Orchard Experience premium quality and luxury packaging. CTAs point to shop catalog anchor or /our-story for Learn More.`,
  },
  {
    title: `${SITE_PREFIX} Home page & customer experience`,
    type: "text",
    content: `Home: organic premium positioning, farm-to-table Multan 24h, hero CTAs to shop and our story. Stats strip: orders daily, natural growth, trusted users. Best sellers carousel from live API. Trending varieties grid. Join Orchard Circle email capture. Customer Love section with verified-style reviews carousel. Footer: explore shop, our story, wholesale, policies, newsletter, Instagram royalorchardpk, Facebook royalorchardpk42.`,
  },
  {
    title: `${SITE_PREFIX} Cart, checkout & account help`,
    type: "text",
    content: `Shopping: add products from shop or product pages; cart drawer accessible from navbar; adjust quantities in cart page. Checkout collects shipping and payment details for delivery. Users can sign in for account and order history at /orders and profile at /account. Password reset available via forgot-password flow. For payment or delivery issues, use support widget (WhatsApp, email) or policy pages.`,
  },
];

async function seedSiteKnowledge() {
  const result = await ChatbotKnowledge.deleteMany({ title: { $regex: new RegExp(`^${SITE_PREFIX.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`) } });
  if (result.deletedCount > 0) {
    // eslint-disable-next-line no-console
    console.log(`[chatbot] removed ${result.deletedCount} previous site knowledge entr(y|ies)`);
  }
  if (SITE_KNOWLEDGE_ENTRIES.length === 0) return;
  await ChatbotKnowledge.insertMany(
    SITE_KNOWLEDGE_ENTRIES.map((e) => ({
      title: e.title,
      content: e.content,
      type: e.type,
    })),
  );
  // eslint-disable-next-line no-console
  console.log(`[chatbot] seeded ${SITE_KNOWLEDGE_ENTRIES.length} site knowledge documents`);
}

module.exports = { seedSiteKnowledge, SITE_KNOWLEDGE_ENTRIES };
