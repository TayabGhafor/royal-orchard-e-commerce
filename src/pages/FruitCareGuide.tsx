import { PageLayout, Section } from "@/components/PageLayout";

const FruitCareGuide = () => (
  <PageLayout
    eyebrow="Connoisseur's Manual"
    icon="spa"
    title="Fruit Care Guide"
    subtitle="Unlock the fullest expression of every mango. A few small rituals make a world of difference."
  >
    <Section title="When Your Box Arrives">
      <p>Open the box immediately and inspect each fruit. Mangoes shipped at peak harvest are typically <strong>firm but yielding</strong>. Set them in a single layer in a cool, ventilated area — never refrigerate unripe mangoes.</p>
    </Section>
    <Section title="Ripening at Home">
      <ul className="list-disc pl-6 space-y-2">
        <li>Room temperature (22–28°C) for 2–4 days.</li>
        <li>To accelerate: place in a paper bag with a banana or apple.</li>
        <li>Ripe when fragrant near the stem and the flesh yields gently to a light squeeze.</li>
      </ul>
    </Section>
    <Section title="Storing Ripe Mangoes">
      <p>Once fully ripe, mangoes can be refrigerated for up to <strong>5 days</strong>. Store them whole — cut fruit oxidizes quickly. For longer storage, peel, slice, and freeze in airtight containers for up to 6 months.</p>
    </Section>
    <Section title="Serving Suggestions">
      <ul className="list-disc pl-6 space-y-2">
        <li><strong>Chilled, sliced</strong>: serve directly with a squeeze of lime.</li>
        <li><strong>Mango lassi</strong>: blend with yogurt, milk, and a touch of cardamom.</li>
        <li><strong>Salsa</strong>: dice with red onion, cilantro, jalapeño, and lime juice.</li>
        <li><strong>Dessert pairing</strong>: complements vanilla bean ice cream or sticky rice beautifully.</li>
      </ul>
    </Section>
    <Section title="Cutting Technique">
      <p>Stand the mango stem-up. Slice down on either side of the flat pit to create two "cheeks". Score the flesh in a grid without piercing the skin, then invert and slice cubes off cleanly.</p>
    </Section>
    <Section title="Variety-Specific Notes">
      <ul className="list-disc pl-6 space-y-2">
        <li><strong>Chaunsa</strong>: ideal at 4–5 days post-harvest. Honey notes intensify.</li>
        <li><strong>Sindhri</strong>: ripens fast — eat within 3 days for floral aroma.</li>
        <li><strong>Anwar Ratol</strong>: smaller, fiberless, perfect for direct slurping.</li>
      </ul>
    </Section>
  </PageLayout>
);

export default FruitCareGuide;