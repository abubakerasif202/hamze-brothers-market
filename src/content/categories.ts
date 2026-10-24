import type { ImageKey } from "./images";

/**
 * Produce categories shown on the Home and Produce pages.
 *
 * Category descriptions are general. `examples` are items Hamze Brothers has
 * featured on its own Instagram, or everyday staples of a fruit market; they
 * are shown as examples only — seasonal availability varies and the site
 * never claims an item is in stock.
 */

export type CategoryId = "fruit" | "vegetables" | "greens" | "juices" | "pantry";

export interface Category {
  id: CategoryId;
  name: string;
  strapline: string;
  description: string;
  examples: string[];
  image: ImageKey;
  /** Restrained fruit accent used for tags and rules. */
  accent: "red" | "green" | "purple" | "orange" | "leaf";
}

export const categories: Category[] = [
  {
    id: "fruit",
    name: "Fruit",
    strapline: "Hand-selected, colour-packed, picked for flavour.",
    description:
      "Citrus by the box, crisp apples, summer stone fruit and the exotic finds that make a fruit bowl worth looking at. Every piece is hand-selected by the family before it reaches the floor.",
    examples: [
      "Oranges & blood oranges",
      "Mandarins",
      "Grapes",
      "Watermelon",
      "Avocados",
      "Pomegranates",
      "Persimmons",
      "Dragon fruit",
      "Janerik (sour green plums), in season",
    ],
    image: "fruitAssortment",
    accent: "red",
  },
  {
    id: "vegetables",
    name: "Vegetables",
    strapline: "Everything for tonight's dinner and the week ahead.",
    description:
      "Tomatoes by the box, cucumbers, onions, potatoes, beans and the everyday vegetables your family recipes are built on — stocked deep so you can buy for one meal or the whole week.",
    examples: ["Tomatoes", "Cucumbers", "Brown & red onions", "Potatoes", "Eggplant", "Beans", "Carrots"],
    image: "vegetables",
    accent: "green",
  },
  {
    id: "greens",
    name: "Herbs & Greens",
    strapline: "Bunches of green for salads, tabbouleh and the table.",
    description:
      "Leafy greens and fresh herbs for salads, wraps and slow-cooked family dishes. Ask the team what came in today.",
    examples: ["Lettuce", "Spinach", "Parsley", "Mint", "Coriander"],
    image: "spinach",
    accent: "leaf",
  },
  {
    id: "juices",
    name: "Fresh Juices",
    strapline: "Pressed in store. 100% fruit, nothing added.",
    description:
      "Juice goes from fruit to bottle in seconds on the in-store juice machine. Flavours rotate with what's in season — ask in store or check Instagram for today's line-up.",
    examples: ["Orange", "Blood orange", "Pomegranate", "Pineapple", "Orange & passionfruit", "Carrot", "Ginger shots"],
    image: "orangeJuiceBottle",
    accent: "orange",
  },
  {
    id: "pantry",
    name: "Pantry & Deli",
    strapline: "Staples, spices and authentic goodies under one roof.",
    description:
      "Pantry staples, spice and snack aisles, cold drinks, eggs and household essentials — plus authentic favourites like homemade shanklish that you won't find everywhere.",
    examples: ["Rice & oils", "Spices", "Snacks", "Cold drinks", "Eggs", "Homemade shanklish", "BBQ charcoal"],
    image: "spices",
    accent: "purple",
  },
];

export const categoryById = Object.fromEntries(categories.map((c) => [c.id, c])) as Record<CategoryId, Category>;
