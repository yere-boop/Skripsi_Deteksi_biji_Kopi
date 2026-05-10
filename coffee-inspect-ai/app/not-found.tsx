"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Coffee, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0d0a08] text-[#f4efe6]">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 h-[600px] w-[600px] rounded-full bg-amber-900/10 blur-[120px]" />
        <div className="absolute bottom-1/4 right-[-10%] h-[500px] w-[500px] rounded-full bg-orange-900/10 blur-[120px]" />
      </div>

      <div className="relative z-10 text-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, type: "spring" }}
        >
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-600 to-amber-900 shadow-2xl shadow-amber-900/50">
            <Coffee className="h-10 w-10 text-amber-50" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="mt-8 text-8xl font-black text-amber-500/20">404</h1>
          <h2 className="mt-2 text-2xl font-bold text-white">
            Halaman Tidak Ditemukan
          </h2>
          <p className="mt-3 max-w-md mx-auto text-white/40">
            Sepertinya biji kopi yang Anda cari tidak ada di sini. Mungkin sudah diseduh menjadi kopi yang nikmat ☕
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Link
            href="/"
            className="flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-amber-500/25 transition-all hover:scale-105"
          >
            <Home className="h-4 w-4" />
            Ke Beranda
          </Link>
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3.5 font-semibold text-white transition-all hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </button>
        </motion.div>
      </div>
    </main>
  );
}
