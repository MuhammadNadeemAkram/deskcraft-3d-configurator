import { accessoryCatalog, legCatalog, sizeCatalog, surfaceCatalog } from "./catalog";
import type { DeskConfig, PriceBreakdown } from "./types";

export function calculatePrice(config: DeskConfig): PriceBreakdown {
  const size = sizeCatalog[config.size];
  const surface = surfaceCatalog[config.surface];
  const legs = legCatalog[config.legs];

  const lineItems = [
    { id: "base", label: `${size.label} desk`, amountCents: size.baseCents },
    {
      id: `surface-${config.surface}`,
      label: surface.label,
      amountCents: surface.premiumBySize[config.size],
    },
    {
      id: `legs-${config.legs}`,
      label: legs.label,
      amountCents: legs.premiumCents,
    },
    ...config.accessories.map((id) => ({
      id: `accessory-${id}`,
      label: accessoryCatalog[id].label,
      amountCents: accessoryCatalog[id].premiumCents,
    })),
  ];

  return {
    lineItems,
    subtotalCents: lineItems.reduce((total, item) => total + item.amountCents, 0),
    currency: "USD",
  };
}

export function formatCurrency(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(cents / 100);
}
