import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tentang | Coffee Inspect AI",
  description: "Informasi tentang sistem inspeksi kopi berbasis AI, metodologi, dan teknologi yang digunakan.",
};

export default function TentangLayout({ children }: { children: React.ReactNode }) {
  return children;
}
