"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, LogOut, Coffee, ChevronDown, BarChart3 } from "lucide-react";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";

export default function UserDropdown() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (!user) return null;

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-xl border border-white/5 bg-white/[0.03] px-3 py-2 transition-all hover:bg-white/[0.06]"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 text-xs font-bold text-white">
          {initials}
        </div>
        <div className="hidden lg:block text-left">
          <p className="text-xs font-semibold text-white leading-tight max-w-[100px] truncate">{user.name}</p>
          <p className="text-[10px] text-white/40 leading-tight max-w-[100px] truncate">{user.email}</p>
        </div>
        <ChevronDown className={`h-3.5 w-3.5 text-white/40 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-64 overflow-hidden rounded-2xl border border-white/10 bg-[#1a1510]/95 backdrop-blur-xl shadow-2xl shadow-black/40 z-50"
          >
            {/* User Info Header */}
            <div className="border-b border-white/5 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-sm font-bold text-white shadow-lg shadow-amber-500/20">
                  {initials}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                  <p className="text-xs text-white/40 truncate">{user.email}</p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="p-2">
              <Link
                href="/dashboard"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/60 transition-colors hover:bg-white/5 hover:text-white"
              >
                <BarChart3 className="h-4 w-4" />
                Dashboard
              </Link>
              <Link
                href="/inspeksi"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/60 transition-colors hover:bg-white/5 hover:text-white"
              >
                <Coffee className="h-4 w-4" />
                Inspeksi Baru
              </Link>
            </div>

            {/* Logout */}
            <div className="border-t border-white/5 p-2">
              <button
                onClick={() => { logout(); setOpen(false); }}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-red-400/80 transition-colors hover:bg-red-500/10 hover:text-red-400"
              >
                <LogOut className="h-4 w-4" />
                Keluar dari Akun
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
