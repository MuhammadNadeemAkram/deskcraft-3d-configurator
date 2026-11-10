import { Suspense } from "react";
import { ConfiguratorShell } from "@/components/configurator/ConfiguratorShell";

export default function Home() {
  return (
    <Suspense fallback={<main className="page-loading">Preparing your workspace…</main>}>
      <ConfiguratorShell />
    </Suspense>
  );
}
