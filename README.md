# DeskCraft

DeskCraft is a portfolio-ready, interactive 3D desk configurator. Visitors can tailor a modern desk, inspect it from every angle, see a transparent product estimate, copy a reproducible configuration link, and download a high-resolution PNG.

## What is included

- Parametric 3D desk built with React Three Fiber and Three.js—no external 3D models or textures.
- Three sizes: 120 × 60 cm, 140 × 70 cm, and 160 × 80 cm.
- White laminate, natural oak, and walnut surface options.
- Matte-black and soft-white powder-coated leg finishes.
- Cable tray, under-desk drawer, and monitor-arm accessories.
- Deterministic, cent-based USD pricing with visible line items.
- URL-backed configuration state, including robust normalization for malformed links.
- Share-link copying and a client-side 1600 × 1000 px PNG render export.
- Responsive UI for desktop, tablet, and mobile layouts.

## Run locally

```bash
npm ci
npm run dev
```

Open [http://127.0.0.1:3000](http://127.0.0.1:3000).

To make a production-ready static build:

```bash
npm run build
```

The static site is exported to `out/`.

## Configuration URLs

DeskCraft deliberately keeps the URL as the source of truth. The default configuration is:

```text
/?v=1&s=140x70&t=white&l=black
```

Accessories are repeated `a` parameters in a stable catalog order:

```text
/?v=1&s=160x80&t=walnut&l=white&a=tray&a=drawer&a=arm
```

Unknown values are ignored; invalid size, surface, and leg values resolve safely to defaults. This makes copied links durable without requiring a database or account.

## Pricing model

The base desk includes a white laminate surface and matte-black frame:

| Size | Base price |
| --- | ---: |
| 120 × 60 cm | $399 |
| 140 × 70 cm | $459 |
| 160 × 80 cm | $529 |

Surface additions range from $80–$110 for oak and $120–$170 for walnut. Soft-white legs add $25. Accessories add $29 for a cable tray, $89 for an under-desk drawer, and $129 for a monitor arm.

All prices are stored as integer cents in [`src/features/desk/pricing.ts`](src/features/desk/pricing.ts). The viewer, summary, share URL, and PNG export share the same normalized configuration model.

## Architecture

```text
src/features/desk/          Pure configuration, catalog, URL, and price logic
src/components/configurator/ Interactive controls, summary, sharing, and export orchestration
src/components/desk/         Reusable 3D desk scene, viewer, lighting, and export canvas
src/app/                     Next.js App Router shell and global presentation styles
```

The `DeskScene` component is rendered both in the visible interactive canvas and a temporary off-screen export canvas. That keeps exported PNGs faithful to the selected configuration without capturing browser UI.

## Scope notes

DeskCraft intentionally does not include payment, cart, shipping, tax, inventory, account management, or manufacturing-CAD workflows. Prices are product estimates before delivery, tax, and installation.

The optional server-side quote-request integration described in the original product plan is intentionally not enabled in this static first release. It can be added later as a server endpoint that re-normalizes the submitted configuration and recomputes the price before forwarding it to a CRM or webhook.

## Verification

The production build is verified with:

```bash
npm run build
```
