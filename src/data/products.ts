export type WeightOption = "3kg" | "5kg" | "8kg";

export interface Product {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  price: number; // in USD for display ($)
  variety: "Sindhri" | "Chaunsa" | "Anwar Ratol" | "Langra" | "Mixed" | "Other";
  collection: "Premium Reserve" | "Seasonal Specials" | "Bulk Harvest";
  weights: WeightOption[];
  badge?: { label: string; tone: "secondary" | "tertiary" | "primary" };
  images: string[];
  rating: number;
  reviews: number;
}

// Image URLs preserved verbatim from the provided HTML reference files.
const IMG = {
  sindhriCrate:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuB_P67OPcaEINN064aFXkXRZJNDIf0HwXxQJQNaMGqaWSrQCP5k0z0V6Ss6uxpWPo0Y23nddmbQ3zr7kQTOZSLm0Gx8PPILK3vr-J5EdEF6-zJ05LxszzQzZqiSer5vjVrenUFUPyI9svVcZSuywa3gORN8CwwT7uA1LW6UKz7jFyscQ5Oqpk8B19plOyz8olSB-UXVG-yTGxDbngtpXll0LUlvYNTAkf_fSDubwIHldg86zUWb9gNth5g1DLgg1ncw3qI4r7c58F3_",
  anwarRatol:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCgoHmMrpPGx_8V3HwPeFGRcXDLC_bHKzhsURRF17rqNXb0CoMeTc-CmpvVZ9Rjln2XMVlaVTjM1xxrp4taJ5sf9P0ZnrLu7rykgtsj4v5hxUhO4M-YbnUpZt8FeBkTFMdZxAp5nUeBqr90Zc7G-y7K98aoJ4mf1mqa5gkCkEMdWxXJUq3stFL9Qkw4kabrohfdqP8BKYVKfOhtAf6mmwSxIeYV8ADdvZ8Tw8U6CHpxmfoqFyHviaqXiw61ukuTJ1Q6aJyW5uhjk1UZ",
  chaunsaSquare:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuD681H5qgs1CDgdsbBvTcEMidzZZsxudwW2an0VeF1PTttdeWi2UOxc6QRyKajGTAfMK8-YOSqxtsGFq2UR1gcqFPx76YY5skc79jgsWMMh8uLeKXgTTNh_Jj6jtXvRK_kprX-RGbpc44US_aFYjv5lNHBXlw2oJvgq0mXyBav8VuCXo3owdOlQTfTu8QhnKanDzXz4LEFHPt3oXnB5fffsHXYCUQqWLpq-fVB82KUir9pLe6xhVE9LsB7dFlbbpUD0yMCh3xoPZFZc",
  langra:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAIEXC6LwgMbuVsq2JIB6DkCUv0Ob3ASIBboiFQfyG885ngzRFpRsexofYx5Qt6PBIhfgH-tWF6isQj85qtb7Z9YN0sA-yaysF-R6v8JpwSUY0UGhi9rrTuNTfW2HriGBAFBYOgYAwCHqITN0qeU_hKeN-CuZmWp54MSW1vvRUBjPvI3n7GgE_bmWTu1uviVY_7KB1yeYKCDZ7pJjzBSVHKZPzAEr-4TQadIw0RZItMC2FB6Dx1gNIowGJBUD2e5mmTtTXijcNPn-KL",
  smoothie:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuASkgu2GBWoxs8IS817YcSI99b9uDVF83yT_y8ubUeFR6_VJMJUiCt3a_qVod6LcvVsY7krITRuQEN-8AgiKgYWXJINjWKyh_a9HL7kgSOs7VHTA9M8YVuDjir8RCoseCnqtQWhw8SeDYmQWQBchME_bjidtlauigW4Ej8l3lUiJauHA6gcmWHuP199yvLiw9e9QSrI99F2ik9HJu3Z-59FFqXyd6vjXedgmfOEqd7B6E7M4GZ0gKTt9RszSNz98lLheORH0fRb1Poh",
  sindhriHero:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuA-W21rhVw7p0PRPHFiv6wrOnAYitsoVRgF-PBJfcTh-ozbHgHnFaVLZoa0BtRWADFeyTvBBqcfm3fTOb3NXwEDPg1XwDy4VtRISglV6tloXM7tqmw8cDfUsGONO5oMVZMN2Iq9ANrkOezoAB7Ajwa3AWKVl-L0wicbyHbBb-qAse42rhS3lwdbK8pL03COl67H50TfnW-s-tjRQDDFR2ag1DMVZT7UkjlJxqNJcwyBvlFnbYAdY-JJOFo24CBqUqhDn_FrvzHtsNwe",
  sindhriBasket:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuChe8GtlYi8VjPyQ1LDvxPWjcg5bmC0Lu9bGI6xI42Der_QazL2ZpeT98nk_bDwXtkMY3yQ2s7T5zl_L1xS8CELhe2SnXpNmUdnTRn_GRl4dVrLNokLEhNECDslWcSk38PBJS9sPqtmTGFpvX2OUJc0WKV2fh4O-uJvDUmvlqUxRuBYN3cBGtdV5bYrQcCpOe7sQt3mwyryIO7xQv2-eN_gzScw4d2BFP55aY4DuJT3iGmsoQKPJAl3fl4Ant_o0F9psP3kSBc39MWO",
  slicedPlate:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCNVLGDZeJl9Jme6n1miSkcvO4tKBL2-CM1Qs4VlTpsbMpZw-bMqk5JLarknyoqNxKQkMzzgQLNNnjRXWLnO4BD2C5ieCaDZh7Tqsbcr47-0bSBwfDyGmlwMuur4OnuEWOri6RePPdFawdTm9YuH1DTKyPMTveZDte5bsPHO9L3QH-I1WtdMot7OFko8u7uQyPqM88r6TuHy3JD5yg-I38MXtHutxQ6lNiXr6rvxzBr1EqQ2VYHaOftWSGIOF-t9MihvKEHtMZycWsm",
  orchardCrate:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDxAb-XFRABcd7XebTJfhEgU6n1r5TV6cEez635D6-OKtd7UEBNWgfZB_UZwsrhw6rlVK0cmR1HYGVwuZBiZTRnXtumTMmn2qcRR-B4Z7cdS4RcYZpXSpPyNbedL1iTOaAVibvthS7A-8dtE_OSbEaU2oa1LJxektSYLxUqNFIPcqLQ0bZ13iboDNDU7lfXF30iRj2s2TXWy4mwRRa5Z7AHraEp4AOr8geYc7InP6eDePWiqSoqys0Fq5r_VqNGAi2y6NvMuO12BAkc",
};

export const products: Product[] = [
  {
    id: "sindhri-honey-gold",
    slug: "sindhri-honey-gold",
    name: "Sindhri Honey Gold",
    tagline: "The Queen of Mangoes from the Tando Jam orchards.",
    description:
      "Experience the Queen of Mangoes. Our Premium Sindhri variety is hand-selected from the heart of the orchard, known for its extreme sweetness, intoxicating aroma, and signature fiber-less texture.",
    price: 45,
    variety: "Sindhri",
    collection: "Premium Reserve",
    weights: ["3kg", "5kg", "8kg"],
    badge: { label: "Just Picked", tone: "secondary" },
    images: [IMG.sindhriHero, IMG.sindhriBasket, IMG.slicedPlate, IMG.orchardCrate],
    rating: 4.9,
    reviews: 128,
  },
  {
    id: "anwar-ratol-special",
    slug: "anwar-ratol-special",
    name: "Anwar Ratol Special",
    tagline: "Intense aroma with a velvety, fiber-less texture.",
    description:
      "An export-grade single-batch harvest. The Anwar Ratol is small in size but massive in flavor — a velvety, fiber-less mango with an unmistakable honeyed perfume.",
    price: 52,
    variety: "Anwar Ratol",
    collection: "Seasonal Specials",
    weights: ["3kg", "5kg", "8kg"],
    badge: { label: "Limited Harvest", tone: "tertiary" },
    images: [IMG.anwarRatol, IMG.slicedPlate, IMG.orchardCrate],
    rating: 4.8,
    reviews: 92,
  },
  {
    id: "chaunsa-delight",
    slug: "chaunsa-delight",
    name: "Chaunsa Delight",
    tagline: "Signature sweet aroma and golden yellow skin.",
    description:
      "Known for its signature sweet aroma and golden yellow skin when ripe. A classic premium Pakistani variety, perfect on its own or in desserts.",
    price: 38,
    variety: "Chaunsa",
    collection: "Premium Reserve",
    weights: ["3kg", "5kg", "8kg"],
    images: [IMG.chaunsaSquare, IMG.sindhriCrate, IMG.slicedPlate],
    rating: 4.7,
    reviews: 64,
  },
  {
    id: "langra-green",
    slug: "langra-green",
    name: "Langra Green",
    tagline: "Greenish skin even when ripe. Tart-sweet profile.",
    description:
      "Maintains a greenish skin even when fully ripe. The Langra has a distinctive tart-sweet profile loved by connoisseurs across South Asia.",
    price: 32,
    variety: "Langra",
    collection: "Seasonal Specials",
    weights: ["3kg", "5kg", "8kg"],
    images: [IMG.langra, IMG.chaunsaSquare, IMG.orchardCrate],
    rating: 4.6,
    reviews: 41,
  },
  {
    id: "smoothie-grade",
    slug: "smoothie-grade",
    name: "Smoothie Grade",
    tagline: "Perfectly ripe with minor blemishes — ideal for juices.",
    description:
      "Perfectly ripe fruit with minor skin blemishes, ideal for juices, lassis and desserts. All the flavor at a friendlier price.",
    price: 28,
    variety: "Mixed",
    collection: "Bulk Harvest",
    weights: ["5kg", "8kg"],
    images: [IMG.smoothie, IMG.slicedPlate],
    rating: 4.5,
    reviews: 33,
  },
  {
    id: "sindhri-crate-bulk",
    slug: "sindhri-crate-bulk",
    name: "Sindhri Bulk Crate",
    tagline: "Wooden crate fresh from Tando Jam.",
    description:
      "A full wooden crate of perfectly aligned golden Sindhri mangoes. The choice for families and small businesses.",
    price: 65,
    variety: "Sindhri",
    collection: "Bulk Harvest",
    weights: ["8kg"],
    badge: { label: "Bulk", tone: "primary" },
    images: [IMG.sindhriCrate, IMG.orchardCrate],
    rating: 4.8,
    reviews: 21,
  },
];

export const findProduct = (slug: string) => products.find((p) => p.slug === slug);
