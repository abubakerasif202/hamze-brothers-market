/**
 * Image registry. Every image used on the site is listed here with its alt
 * text and source so it can be swapped without touching page layouts.
 *
 * - kind "store": real photos from Hamze Brothers' own Instagram (cropped to
 *   remove overlaid dates/prices).
 * - kind "stock": Unsplash License photography, used to illustrate produce
 *   types. Replace with the shop's own photography when supplied.
 * - kind "illustration": AI-generated imagery, illustrative rather than a
 *   photograph of the shop.
 * Full provenance list: IMAGE_SOURCES.md
 */

export interface SiteImage {
  src: string;
  alt: string;
  width: number;
  height: number;
  kind: "store" | "stock" | "brand" | "illustration";
}

const stock = (file: string, alt: string, width: number, height: number): SiteImage => ({
  src: `/images/produce/${file}.jpg`,
  alt,
  width,
  height,
  kind: "stock",
});

export const images = {
  logoFull: {
    src: "/brand/hamze-brothers-logo-full.png",
    alt: "Hamze Brothers Fruit Market logo — حمزة اخوان — Fresh. Local. Family.",
    width: 647,
    height: 846,
    kind: "brand",
  },
  logoMark: {
    src: "/brand/hamze-brothers-mark.png",
    alt: "",
    width: 489,
    height: 451,
    kind: "brand",
  },
  logoBadge: {
    src: "/brand/hamze-brothers-badge-512.png",
    alt: "Hamze Brothers Fruit Market logo",
    width: 512,
    height: 512,
    kind: "brand",
  },

  bloodOrange: {
    src: "/images/store/blood-orange-squeeze.jpg",
    alt: "Gloved hands pulling apart a ripe blood orange above a crate of oranges at Hamze Brothers",
    width: 1320,
    height: 1330,
    kind: "store",
  },
  inStoreDisplay: {
    src: "/images/store/in-store-display.jpg",
    alt: "Inside Hamze Brothers: eggplants on the shelf above stacked rice bags and onion sacks",
    width: 1320,
    height: 780,
    kind: "store",
  },
  heroFruitPlatter: {
    src: "/images/produce/hero-fruit-platter.jpeg",
    alt: "A colourful platter of seasonal fruit, including berries, grapes, citrus and watermelon",
    width: 1312,
    height: 1200,
    kind: "illustration",
  },

  fruitAssortment: stock(
    "fruit-assortment",
    "A colourful spread of papaya, citrus, grapes, kiwifruit and avocado",
    1400,
    934,
  ),
  vegetables: stock("vegetables-assortment", "Fresh tomatoes, corn, capsicum, zucchini and mushrooms", 1400, 934),
  orangeJuiceBottle: stock(
    "orange-juice-bottle",
    "A bottle of freshly squeezed orange juice surrounded by cut oranges",
    933,
    1400,
  ),
  orangeJuiceGlass: stock("orange-juice-glass", "A glass of fresh orange juice beside halved oranges", 1400, 1050),
  spinach: stock("spinach", "Bunches of fresh spinach leaves", 1400, 1400),
  lettuce: stock("lettuce", "Crisp green lettuce leaves", 1400, 934),
  rosemary: stock("rosemary", "A potted rosemary plant", 1120, 1400),
  spices: stock("spices", "Spoons of colourful ground spices and whole seeds", 1400, 934),
  apples: stock("apples", "A pile of shiny red apples", 1400, 1050),
  oranges: stock("oranges", "Two navel oranges with leaves", 933, 1400),
  mandarin: stock("mandarin", "A single mandarin with its stem and leaf", 1120, 1400),
  bananas: stock("bananas", "Bunches of ripe yellow bananas", 788, 1400),
  strawberries: stock("strawberries", "Ripe red strawberries", 1400, 934),
  blueberries: stock("blueberries", "A bowl of blueberries", 1400, 935),
  grapes: stock("grapes", "A bunch of dark grapes", 933, 1400),
  pomegranates: stock("pomegranates", "Whole and halved pomegranates showing ruby seeds", 1400, 934),
  watermelon: stock("watermelon", "A whole watermelon with a cut wedge", 1400, 1400),
  avocado: stock("avocado", "A halved avocado", 1400, 1049),
  mango: stock("mango", "A ripe yellow mango", 1400, 1050),
  pineapple: stock("pineapple", "A whole ripe pineapple", 933, 1400),
  lemons: stock("lemons", "A pile of bright yellow lemons", 1050, 1400),
  kiwifruit: stock("kiwifruit", "Halved kiwifruit showing green flesh", 1400, 934),
  tomatoes: stock("tomatoes", "Ripe red tomatoes on the vine", 973, 1400),
  carrots: stock("carrots", "A bunch of fresh carrots with green tops", 933, 1400),
  potatoes: stock("potatoes", "Washed brushed potatoes", 1400, 934),
  brownOnions: stock("brown-onions", "A pile of brown onions", 1400, 934),
  redOnions: stock("red-onions", "A pile of red onions", 933, 1400),
  broccoli: stock("broccoli", "A bowl of fresh broccoli florets", 1400, 934),
  eggs: stock("eggs", "A bowl of brown eggs", 1400, 934),
  greenApples: stock("green-apples", "Green apples, whole and sliced", 1400, 1399),
  cherries: stock("cherries", "A pair of red cherries", 1120, 1400),
} satisfies Record<string, SiteImage>;

export type ImageKey = keyof typeof images;
