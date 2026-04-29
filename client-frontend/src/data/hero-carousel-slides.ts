export type HeroSlide = {
  id: string;
  title: string;
  subtitle: string;
  cta: string;
  /** `#catalog` for in-page scroll, or a router path like `/our-story` */
  to: string;
  image: string;
  imageAlt: string;
};

export const HERO_SLIDES: readonly HeroSlide[] = [
  {
    id: "harvest-2024",
    title: "Harvest Season 2024",
    subtitle: "Limited stock of premium Sindhri mangoes",
    cta: "Shop Now",
    to: "#catalog",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBz_Rv5_wd9vDrI4h58XmSfhYZghD1GZrWjgdbhXXJS3P8uKmPp4HULPSewShQmV-Ii6eftIMRvYzBuAzDW_6SPp8R9ST4M8KuYX0QILUhAxLtU9mCxMdjT51BRvdl2zdfKWptohN3WUVNa3QXeiEsZSIlqdQOd5v65BOAWJY38cv3HOAmzErRdUvNW_GXh9-gHobn4nTp9ajj27gez84f7Z7kJGFoeAKztH5chrNjpNHfJT5zOC7P0F7bHNjVOXB2xj0c0eg7Oqlpm",
    imageAlt: "Premium ripe Sindhri mangoes in golden light",
  },
  {
    id: "golden-indulgence",
    title: "Pure Golden Indulgence",
    subtitle: "Handpicked at peak ripeness from Sindh orchards",
    cta: "Browse Collection",
    to: "#catalog",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCv3CJi_8VFDrlb6kF-hdUwylBzavCfM7znd7Mzhfhldjaf-RNry-_E52AJS7J6xEqSkvVjVqMxpRfu8DJIvEQ6FMWfiIMDn11mW_waLztLsceyJ9czQhCXqJvjQ9l831sCd40ZPj53bcIHlqkFHKYe8MTV-IT8jmD-W5FgM525JZNzgPSj95I8zhXsbfS7VpVbSRxOVPEoCWYlfsqhzj5yB0PR0110t0BPTF1FlMIaQ2FVoP39v0A6L0vh2S_OM4hgI2aX1lNPXQA0",
    imageAlt: "Hand-cut mango showing vibrant flesh",
  },
  {
    id: "delivered-fast",
    title: "Freshly Picked, Delivered Fast",
    subtitle: "From farm to your doorstep within 24 hours",
    cta: "Order Now",
    to: "#catalog",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAOklle5xXoJeqoR4aVRtN8HMtkxjOgPnT0Etkly_ErUBMVwwWhsvmlk05syx1T_T5zMpWD0J70sNg3NXTK82ihseyz40DSxbayXPSleVEz6xsVAk1XGgvVkPgsd4U01rUrmF_KwMHjRYyt_u3HaawDGPGvyMuUqTpuzju8-9w7bbz5DToSXth7vI3bC3dZrmilRU6bpCkDKESCRrry9qUjwARJom6Dnv8UY1wWXLITdENtQmNKvP9KbZ1FGuZENrAbqunfSAeInK4-",
    imageAlt: "Carton of mangoes ready for delivery",
  },
  {
    id: "new-arrivals",
    title: "New Arrivals",
    subtitle: "Discover this season's finest mango varieties",
    cta: "Explore",
    to: "#catalog",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBL94WGbtABZ0yJeGy2qlRGx6YVYLixJg_kJAqV5biCC7DcKtQ10ybGqSKib3GN6AZ_9KTGPFl8317Ep7m6MkrTUiLqC2tZ223RmMBPbMm_j9O4BTHSe7UNZmRhGQKJ7Kgo0PdpYzEekd-ubXQaYEsXPJMbXKhBgvvFyXh4DNPQyM9O8wYWkCo89MRsOhkziQ3_I2tt9sBDsqHIm2p75ZvPmAwPOrEHK2KeArVwvd0OROHR5pWWKwuCd-31Y4U07FwfAcDWnN504miR",
    imageAlt: "Assorted premium mango varieties",
  },
  {
    id: "royal-experience",
    title: "The Royal Orchard Experience",
    subtitle: "Premium quality, unmatched taste, luxury packaging",
    cta: "Learn More",
    to: "/our-story",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDZIRbthMFwmKYK1hDSLVezMk2nbKzyIoHfw2TcWeyEjiwciVHgNfXzuNJgKMyaWJ32ItGTLZGcu4owU7ctVTGfq7lOXa3hDp7wZabLZAs-hkOBvPZhk-hmKrLZfN41Wy_MxraiMg5d9dqcKK589RE7Wdhzrw-F3Zbt-SvsVnahqjGZbahivylww0IgHSe_2dNigP9nFurrakjKeVJSFAc1Gwf8bKnJayg2oUBSAC_1oBc6F2QNNOxUCfBX2lfQYoZW0eZRs56WBK2p",
    imageAlt: "Sunlit orchard with mango trees",
  },
];
