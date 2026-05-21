const { Blog } = require("./blog.model");

const SEED_BLOGS = [
  {
    title: "The Art of Ripening: A Connoisseur's Guide to Sindhri",
    slug: "art-of-ripening-sindhri",
    excerpt:
      "From orchard to table — discover the sensory rituals that unlock the honeyed perfume of Pakistan's most celebrated mango.",
    thumbnail:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA-W21rhVw7p0PRPHFiv6wrOnAYitsoVRgF-PBJfcTh-ozbHgHnFaVLZoa0BtRWADFeyTvBBqcfm3fTOb3NXwEDPg1XwDy4VtRISglV6tloXM7tqmw8cDfUsGONO5oMVZMN2Iq9ANrkOezoAB7Ajwa3AWKVl-L0wicbyHbBb-qAse42rhS3lwdbK8pL03COl67H50TfnW-s-tjRQDDFR2ag1DMVZT7UkjlJxqNJcwyBvlFnbYAdY-JJOFo24CBqUqhDn_FrvzHtsNwe",
    author: "Royal Orchard Editorial",
    tags: ["Sindhri", "Ripening", "Guide"],
    readTimeMinutes: 8,
    content: `<h2>Patience Is the Secret Ingredient</h2>
<p>At Royal Orchard, we believe ripening is not a countdown — it is a <strong>conversation</strong> between fruit, air, and time. Sindhri mangoes arrive from our Tando Jam groves with a green-gold blush and an aroma that hints at the sweetness within.</p>
<h3>The Three-Day Ritual</h3>
<ul>
<li><strong>Day 1:</strong> Rest mangoes stem-side down in a woven basket at room temperature, away from direct sun.</li>
<li><strong>Day 2:</strong> Gently turn each fruit — the shoulders should yield with a whisper of pressure.</li>
<li><strong>Day 3:</strong> Chill for two hours before serving to concentrate sugars without dulling perfume.</li>
</ul>
<blockquote>The first slice should glisten like amber — fiber-less, velvety, unforgettable.</blockquote>
<p>Pair with chilled rose water or a light cardamom cream for an editorial presentation worthy of summer entertaining.</p>`,
  },
  {
    title: "Inside the Golden Hour: How We Hand-Select Every Harvest",
    slug: "golden-hour-hand-selection",
    excerpt:
      "Walk the rows with our orchard masters as dawn light paints the mangoes in liquid gold — and learn what we reject before it ever reaches your door.",
    thumbnail:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAPXVr7w97A9lDIAUKkYxirejxfW8uVEk1bAw27W7aWcboCqIRSRaO3KzlKnCExEFGNtZAn4euKfBvim7zqAU0ivC2GEvy8CceHHudkCYoDItezl1cWNovNT6V2_V6Cv3fGiKlKIGaJF7JkUWn3nUpkJRSL9Oj7oNbMMGVUKvsRQYxpBZvClldqgDTQtYsc1owaoccIlUG-ydEYP8Xl7iFZaqq-nGDtXOzlQUbjoWUg-AE4bnuUd9teDa1lqfn5Nt1Vq0FLlanEyi2_",
    author: "Elias Thorne Jr.",
    tags: ["Harvest", "Heritage", "Quality"],
    readTimeMinutes: 6,
    content: `<h2>Selection Before Scale</h2>
<p>Commercial packing lines favor volume. We favor <em>character</em>. Each Anwar Ratol and Chaunsa is cupped in the palm, weighed for heft, and inspected for uniform blush — only then does it earn the Royal Orchard seal.</p>
<h3>What We Never Ship</h3>
<ol>
<li>Fruit with stem tears that invite early fermentation.</li>
<li>Skin blemishes deeper than a thumbnail — cosmetic only, but we hold a higher bar.</li>
<li>Under-sized specimens that cannot carry our weight-grade promise.</li>
</ol>
<p>By noon, crates are on climate-controlled transport. By evening, your order is staged for next-morning dispatch — freshness as a discipline, not a slogan.</p>`,
  },
  {
    title: "Mango & Memory: Three Generations of Thorne Family Recipes",
    slug: "thorne-family-mango-recipes",
    excerpt:
      "Heritage desserts, chilled lassis, and the rose-petal preserve our grandmother still stirs at golden hour.",
    thumbnail:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB0ZYNDqbiR2MiLyMPzlBIX8gglFq3CFVWupvEFdaQInbB94s1QXCVq_DHGT8c9he0eobcmyhQ3kLQtgV-5cf-iZEI5U1Z66-mxdPDSf-paWujdt_iavqL6nDjOQablY71Cb8jKzPB5ZV7j1tNk1xIDE-jUm-7jHF5qFHpZXUdDEPHxkGwce2PE4p3qePIDgV3KUM0gYpAfdABAOgTH4MfnKlESy5g_j_U2EprS7pUqHDuJ4WGbVvvijgD8NGhXK5DBBtcyreZx2AeX",
    author: "Royal Orchard Kitchen",
    tags: ["Recipes", "Family", "Dessert"],
    readTimeMinutes: 10,
    content: `<h2>From Grove to Table</h2>
<p>Our kitchen ledger dates to 1954 — smudged with saffron stains and pressed mango leaves. These three recipes remain the heartbeat of every Thorne reunion.</p>
<h3>1. Sindhri Rose Lassi</h3>
<p>Blend chilled yogurt, ripe Sindhri pulp, rose water, and a pinch of cardamom. Serve in chilled copper cups with crushed pistachios.</p>
<h3>2. Chaunsa Sunset Tart</h3>
<p>A buttery shortcrust filled with Chaunsa curd, brushed with apricot glaze, finished with edible gold leaf — dramatic, never fussy.</p>
<h3>3. Anwar Ratol Preserve</h3>
<p>Slow-cooked with raw sugar and lemon zest, this preserve captures the variety's honeyed perfume for year-round toast and cheese boards.</p>
<p><strong>Tip:</strong> Always use fruit at peak ripeness — the recipes forgive nothing less.</p>`,
  },
  {
    title: "Sustainable Orchards: Water, Soil, and the Next Fifty Years",
    slug: "sustainable-orchards-fifty-years",
    excerpt:
      "How precision irrigation and regenerative soil practices keep our valley sweet for the next generation.",
    thumbnail:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD681H5qgs1CDgdsbBvTcEMidzZZsxudwW2an0VeF1PTttdeWi2UOxc6QRyKajGTAfMK8-YOSqxtsGFq2UR1gcqFPx76YY5skc79jgsWMMh8uLeKXgTTNh_Jj6jtXvRK_kprX-RGbpc44US_aFYjv5lNHBXlw2oJvgq0mXyBav8VuCXo3owdOlQTfTu8QhnKanDzXz4LEFHPt3oXnB5fffsHXYCUQqWLpq-fVB82KUir9pLe6xhVE9LsB7dFlbbpUD0yMCh3xoPZFZc",
    author: "Royal Orchard Sustainability",
    tags: ["Sustainability", "Farming", "Future"],
    readTimeMinutes: 7,
    content: `<h2>Stewardship as Strategy</h2>
<p>Mangoes are a gift of climate — and climate is changing. We have invested in <strong>drip irrigation networks</strong> that cut water use by 38% while maintaining brix levels in our premium blocks.</p>
<h3>Soil Health Program</h3>
<ul>
<li>Annual compost from pruned wood and fallen leaves returned to the root zone.</li>
<li>Cover crops between rows to fix nitrogen naturally.</li>
<li>Soil microbiome testing every season — data-driven, not guesswork.</li>
</ul>
<p>Our goal is simple: the valley that fed Elias Thorne in 1954 should feed his great-grandchildren with the same sweetness. Sustainability is not marketing — it is the only harvest that compounds.</p>`,
  },
];

async function seedBlogs() {
  for (const post of SEED_BLOGS) {
    // eslint-disable-next-line no-await-in-loop
    await Blog.findOneAndUpdate(
      { slug: post.slug },
      {
        $setOnInsert: {
          ...post,
          status: "published",
          publishedAt: new Date(Date.now() - Math.floor(Math.random() * 20) * 86400000),
          isSeedData: true,
        },
      },
      { upsert: true, new: true },
    );
  }
}

module.exports = { seedBlogs };
