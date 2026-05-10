import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Daftar | Coffee Inspect AI",
  description: "Buat akun baru untuk menggunakan sistem inspeksi kopi berbasis AI",
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
