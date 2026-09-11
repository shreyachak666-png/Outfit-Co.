export type Product = {
  id: string;
  outfit_id: string;
  name: string;
  url: string;
  position: number;
};

export type Outfit = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  image_url: string | null;
  image_path: string | null;
  card_color: string;
  published: boolean;
  position: number;
  created_at: string;
  updated_at: string;
};

export type OutfitWithProducts = Outfit & {
  products: Product[];
};

export type CardColorPreset = {
  name: string;
  value: string;
  textClass: string;
};

// Preset card/background colours. `textClass` picks readable text for that
// background (dark chocolate/burgundy need light text, everything else
// reads best with the standard dark ink text).
export const CARD_COLOR_PRESETS: CardColorPreset[] = [
  { name: "Ivory", value: "#FBF7F0", textClass: "text-ink" },
  { name: "Cream", value: "#F6EEE0", textClass: "text-ink" },
  { name: "Soft Blush", value: "#F1DAD4", textClass: "text-ink" },
  { name: "Beige", value: "#EADFC8", textClass: "text-ink" },
  { name: "White", value: "#FFFDFB", textClass: "text-ink" },
  { name: "Chocolate", value: "#3A2A20", textClass: "text-ivory" },
  { name: "Muted Burgundy", value: "#722F3A", textClass: "text-ivory" },
];

export const DEFAULT_CARD_COLOR = "#FBF7F0";
