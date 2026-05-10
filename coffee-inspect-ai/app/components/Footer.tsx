"use client";

import { Coffee, Mail } from "lucide-react";
import Link from "next/link";

const navLinks = [
  { href: "/", label: "Beranda" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/inspeksi", label: "Inspeksi" },
  { href: "/riwayat", label: "Riwayat" },
  { href: "/tentang", label: "Tentang" },
];

const techLinks = [
  { label: "Next.js 16", href: "https://nextjs.org" },
  { label: "TensorFlow", href: "https://tensorflow.org" },
  { label: "FastAPI", href: "https://fastapi.tiangolo.com" },
  { label: "Convex", href: "https://convex.dev" },
];

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/5 bg-[#0a0806]">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-3">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-600 to-amber-900 shadow-lg shadow-amber-900/30">
                <Coffee className="h-5 w-5 text-amber-50" />
              </div>
              <div>
                <p className="text-lg font-bold text-white">
                  Coffee Inspect<span className="text-amber-500">.AI ONLINE</span>
                </p>
              </div>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/35">
              Sistem inspeksi kualitas biji kopi berbasis kecerdasan buatan. Menggunakan Computer Vision dan CNN untuk analisis yang presisi.
            </p>
            <div className="mt-5 flex items-center gap-1 text-xs text-white/20">
              <span className="inline-flex h-2 w-2 rounded-full bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.5)]" />
              <span className="ml-1">Sistem Aktif</span>
              <span className="mx-2">•</span>
              <span>v2.0</span>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-white/30">Navigasi</p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-lg px-3 py-2 text-sm text-white/40 transition-colors hover:bg-white/5 hover:text-white/70"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Tech Stack */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-white/30">Teknologi</p>
            <div className="mt-4 space-y-2">
              {techLinks.map((tech) => (
                <a
                  key={tech.label}
                  href={tech.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/40 transition-colors hover:bg-white/5 hover:text-white/70"
                >
                  {tech.label}
                  <span className="text-[10px] opacity-30">↗</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center gap-4 border-t border-white/5 pt-8 sm:flex-row sm:justify-between">
          <p className="text-xs text-white/20">
            © {new Date().getFullYear()} Coffee Inspect AI — Skripsi Project
          </p>
          <p className="text-xs text-white/15">
            Built with ☕ & AI
          </p>
        </div>
      </div>
    </footer>
  );
}
