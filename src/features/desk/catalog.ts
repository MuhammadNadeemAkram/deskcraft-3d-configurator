import type {
  AccessoryId,
  DeskSize,
  LegFinish,
  SurfaceFinish,
} from "./types";

export const sizeCatalog: Record<
  DeskSize,
  { label: string; dimensions: { width: number; depth: number }; baseCents: number }
> = {
  "120x60": {
    label: "120 × 60 cm",
    dimensions: { width: 1.2, depth: 0.6 },
    baseCents: 39900,
  },
  "140x70": {
    label: "140 × 70 cm",
    dimensions: { width: 1.4, depth: 0.7 },
    baseCents: 45900,
  },
  "160x80": {
    label: "160 × 80 cm",
    dimensions: { width: 1.6, depth: 0.8 },
    baseCents: 52900,
  },
};

export const surfaceCatalog: Record<
  SurfaceFinish,
  {
    label: string;
    description: string;
    premiumBySize: Record<DeskSize, number>;
    color: string;
    roughness: number;
  }
> = {
  white: {
    label: "White laminate",
    description: "Clean satin surface",
    premiumBySize: { "120x60": 0, "140x70": 0, "160x80": 0 },
    color: "#e7e4dc",
    roughness: 0.34,
  },
  oak: {
    label: "Natural oak",
    description: "Warm, natural grain tone",
    premiumBySize: { "120x60": 8000, "140x70": 9500, "160x80": 11000 },
    color: "#c49363",
    roughness: 0.42,
  },
  walnut: {
    label: "Walnut veneer",
    description: "Deep architectural wood tone",
    premiumBySize: { "120x60": 12000, "140x70": 14500, "160x80": 17000 },
    color: "#533526",
    roughness: 0.4,
  },
};

export const legCatalog: Record<
  LegFinish,
  { label: string; premiumCents: number; color: string }
> = {
  black: { label: "Matte black", premiumCents: 0, color: "#171a1f" },
  white: { label: "Soft white", premiumCents: 2500, color: "#ede9e1" },
};

export const accessoryCatalog: Record<
  AccessoryId,
  { label: string; description: string; premiumCents: number }
> = {
  tray: {
    label: "Cable tray",
    description: "Tucks cables beneath the desk",
    premiumCents: 2900,
  },
  drawer: {
    label: "Under-desk drawer",
    description: "Slim storage within reach",
    premiumCents: 8900,
  },
  arm: {
    label: "Monitor arm",
    description: "Minimal rear-mounted support",
    premiumCents: 12900,
  },
};
