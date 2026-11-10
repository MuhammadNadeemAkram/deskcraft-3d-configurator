"use client";

import dynamic from "next/dynamic";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Check, Download, Link2, RotateCcw, ShieldCheck, Sparkles } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { accessoryCatalog, legCatalog, sizeCatalog, surfaceCatalog } from "@/features/desk/catalog";
import { createUpdatedConfig, defaultConfig, parseDeskConfig, serializeDeskConfig } from "@/features/desk/config";
import { calculatePrice, formatCurrency } from "@/features/desk/pricing";
import { accessoryIds, deskSizes, legFinishes, surfaceFinishes, type AccessoryId, type DeskConfig } from "@/features/desk/types";
import { ExportCanvas } from "../desk/DeskViewer";

const DeskViewer = dynamic(
  () => import("../desk/DeskViewer").then((module) => module.DeskViewer),
  {
    ssr: false,
    loading: () => <div className="viewer-panel panel page-loading">Loading the 3D desk…</div>,
  },
);

type OptionCardProps = {
  active: boolean;
  label: string;
  description?: string;
  onClick: () => void;
  swatch?: string;
};

function OptionCard({ active, label, description, onClick, swatch }: OptionCardProps) {
  return (
    <button
      className={`option-card${active ? " active" : ""}`}
      type="button"
      aria-pressed={active}
      onClick={onClick}
    >
      <strong>
        {swatch && <span className="swatch" style={{ background: swatch }} />}
        {label}
      </strong>
      {description && <small>{description}</small>}
    </button>
  );
}

function ControlPanel({ config, update }: { config: DeskConfig; update: (patch: Partial<DeskConfig>) => void }) {
  const toggleAccessory = (accessory: AccessoryId) => {
    const accessories = config.accessories.includes(accessory)
      ? config.accessories.filter((id) => id !== accessory)
      : [...config.accessories, accessory];
    update({ accessories });
  };

  return (
    <aside className="controls-panel panel" aria-label="Desk configuration">
      <p className="eyebrow">Build your desk</p>
      <h1 className="panel-heading">Made for your flow.</h1>

      <section className="control-group" aria-labelledby="size-heading">
        <div className="group-title-row">
          <h2 id="size-heading" className="group-title">Desk size</h2>
          <span className="group-hint">W × D</span>
        </div>
        <div className="option-grid size-grid">
          {deskSizes.map((size) => (
            <OptionCard
              key={size}
              active={config.size === size}
              label={sizeCatalog[size].label.replace(" cm", "")}
              onClick={() => update({ size })}
            />
          ))}
        </div>
      </section>

      <section className="control-group" aria-labelledby="surface-heading">
        <div className="group-title-row">
          <h2 id="surface-heading" className="group-title">Surface</h2>
          <span className="group-hint">Finish + feel</span>
        </div>
        <div className="option-grid finish-grid">
          {surfaceFinishes.map((surface) => (
            <OptionCard
              key={surface}
              active={config.surface === surface}
              label={surfaceCatalog[surface].label}
              description={surfaceCatalog[surface].description}
              swatch={surfaceCatalog[surface].color}
              onClick={() => update({ surface })}
            />
          ))}
        </div>
      </section>

      <section className="control-group" aria-labelledby="legs-heading">
        <div className="group-title-row">
          <h2 id="legs-heading" className="group-title">Leg finish</h2>
          <span className="group-hint">Powder-coated</span>
        </div>
        <div className="option-grid finish-grid">
          {legFinishes.map((legs) => (
            <OptionCard
              key={legs}
              active={config.legs === legs}
              label={legCatalog[legs].label}
              swatch={legCatalog[legs].color}
              onClick={() => update({ legs })}
            />
          ))}
        </div>
      </section>

      <section className="control-group" aria-labelledby="accessories-heading">
        <div className="group-title-row">
          <h2 id="accessories-heading" className="group-title">Add-ons</h2>
          <span className="group-hint">Optional</span>
        </div>
        <div className="accessory-list">
          {accessoryIds.map((accessory) => {
            const item = accessoryCatalog[accessory];
            const checked = config.accessories.includes(accessory);
            return (
              <label className="accessory-option" key={accessory}>
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleAccessory(accessory)}
                />
                <span className="accessory-copy">
                  <span className="accessory-topline">
                    <span>{item.label}</span>
                    <span>+{formatCurrency(item.premiumCents)}</span>
                  </span>
                  <small>{item.description}</small>
                </span>
              </label>
            );
          })}
        </div>
      </section>
    </aside>
  );
}

function PriceSummary({
  config,
  onShare,
  onExport,
  exporting,
}: {
  config: DeskConfig;
  onShare: () => void;
  onExport: () => void;
  exporting: boolean;
}) {
  const price = calculatePrice(config);

  return (
    <aside className="summary-panel panel" aria-label="Configuration price summary">
      <div>
        <p className="summary-label">Your configuration</p>
        <h2 className="summary-title">A desk that works beautifully.</h2>
        <div className="price-lines">
          {price.lineItems.map((line) => (
            <div className="price-line" key={line.id}>
              <span>{line.label}</span>
              <span>{line.amountCents === 0 ? "Included" : `+${formatCurrency(line.amountCents)}`}</span>
            </div>
          ))}
        </div>
      </div>
      <div>
        <div className="summary-divider" />
        <span className="total-label">Estimated product price</span>
        <h2 className="total">{formatCurrency(price.subtotalCents)}</h2>
        <p className="estimate-note">Desk and selected accessories only. Excludes tax, delivery, and installation.</p>
      </div>
      <div className="summary-actions">
        <button className="button button-primary" type="button" onClick={onExport} disabled={exporting}>
          <Download aria-hidden="true" size={15} />
          {exporting ? "Preparing PNG…" : "Download PNG"}
        </button>
        <button className="button" type="button" onClick={onShare}>
          <Link2 aria-hidden="true" size={15} />
          Copy share link
        </button>
      </div>
      <p className="summary-footer"><ShieldCheck aria-hidden="true" size={13} /> Share links include configuration only.</p>
    </aside>
  );
}

export function ConfiguratorShell() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [notice, setNotice] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  const config = useMemo(
    () => parseDeskConfig(new URLSearchParams(searchParams.toString())),
    [searchParams],
  );
  const canonicalQuery = useMemo(() => serializeDeskConfig(config), [config]);

  useEffect(() => {
    const current = searchParams.toString();
    if (current !== canonicalQuery.slice(1)) {
      router.replace(`${pathname}${canonicalQuery}`, { scroll: false });
    }
  }, [canonicalQuery, pathname, router, searchParams]);

  useEffect(() => {
    if (!notice) return;
    const timeout = window.setTimeout(() => setNotice(null), 3000);
    return () => window.clearTimeout(timeout);
  }, [notice]);

  const update = useCallback((patch: Partial<DeskConfig>) => {
    const next = createUpdatedConfig(config, patch);
    router.replace(`${pathname}${serializeDeskConfig(next)}`, { scroll: false });
  }, [config, pathname, router]);

  const copyShareLink = useCallback(async () => {
    const url = `${window.location.origin}${pathname}${canonicalQuery}`;
    try {
      await navigator.clipboard.writeText(url);
      setNotice("Share link copied. It will reopen this exact desk.");
    } catch {
      window.prompt("Copy this DeskCraft link:", url);
    }
  }, [canonicalQuery, pathname]);

  const downloadPng = useCallback((blob: Blob) => {
    const fileName = `deskcraft-${config.size}-${config.surface}-${config.legs}.png`;
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = fileName;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setExporting(false);
    setNotice("PNG ready — your configured desk has been downloaded.");
  }, [config.legs, config.size, config.surface]);

  const exportError = useCallback(() => {
    setExporting(false);
    setNotice("PNG export could not be completed in this browser. Please try again.");
  }, []);

  return (
    <main className="app-shell">
      <header className="app-header">
        <div className="brand">
          <span className="brand-mark"><Sparkles aria-hidden="true" size={17} /></span>
          <div>
            <span className="brand-name">DeskCraft</span>
            <span className="brand-subtitle">Workspace configurator</span>
          </div>
        </div>
        <div className="header-actions">
          <button className="button button-ghost" type="button" onClick={() => update(defaultConfig)} aria-label="Reset configuration">
            <RotateCcw aria-hidden="true" size={15} />
            <span>Reset</span>
          </button>
          <button className="button" type="button" onClick={copyShareLink} aria-label="Copy share link">
            <Link2 aria-hidden="true" size={15} />
            <span>Share</span>
          </button>
          <button className="button button-primary" type="button" onClick={() => setExporting(true)} disabled={exporting} aria-label="Download PNG">
            <Download aria-hidden="true" size={15} />
            <span>Download</span>
          </button>
        </div>
      </header>

      <div className="configurator-grid">
        <ControlPanel config={config} update={update} />
        <DeskViewer config={config} />
        <PriceSummary config={config} onShare={copyShareLink} onExport={() => setExporting(true)} exporting={exporting} />
      </div>

      {exporting && <ExportCanvas config={config} onComplete={downloadPng} onError={exportError} />}
      {notice && <div className="toast" role="status"><Check aria-hidden="true" size={15} /> {notice}</div>}
    </main>
  );
}
