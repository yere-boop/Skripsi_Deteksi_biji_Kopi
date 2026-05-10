import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Masuk | Coffee Inspect AI",
  description: "Login ke sistem inspeksi kopi berbasis AI",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
