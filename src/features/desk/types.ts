export const deskSizes = ["120x60", "140x70", "160x80"] as const;
export const surfaceFinishes = ["white", "oak", "walnut"] as const;
export const legFinishes = ["black", "white"] as const;
export const accessoryIds = ["tray", "drawer", "arm"] as const;

export type DeskSize = (typeof deskSizes)[number];
export type SurfaceFinish = (typeof surfaceFinishes)[number];
export type LegFinish = (typeof legFinishes)[number];
export type AccessoryId = (typeof accessoryIds)[number];

export type DeskConfig = {
  version: 1;
  size: DeskSize;
  surface: SurfaceFinish;
  legs: LegFinish;
  accessories: AccessoryId[];
};

export type PriceLineItem = {
  id: string;
  label: string;
  amountCents: number;
};

export type PriceBreakdown = {
  lineItems: PriceLineItem[];
  subtotalCents: number;
  currency: "USD";
};
