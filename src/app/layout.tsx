import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DeskCraft — Configure your workspace",
  description:
    "An interactive 3D desk configurator with instant pricing, sharing, and PNG export.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
