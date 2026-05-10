"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Coffee, ChevronRight, Menu, X, LogOut, User } from "lucide-react";
import LiveClock from "./LiveClock";
import UserDropdown from "./UserDropdown";
import { useAuth } from "../context/AuthContext";

const navLinks = [
  { href: "/", label: "Beranda" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/inspeksi", label: "Inspeksi" },
  { href: "/riwayat", label: "Riwayat" },
  { href: "/tentang", label: "Tentang" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="fixed top-0 inset-x-0 z-50 border-b border-white/5 bg-[#0d0a08]/70 backdrop-blur-md"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-600 to-amber-900 shadow-lg shadow-amber-900/50">
              <Coffee className="h-5 w-5 text-amber-50" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white">
                Coffee Inspect<span className="text-amber-500">.AI</span>
              </h1>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden gap-8 text-sm font-medium md:flex items-center">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative transition-colors ${
                  pathname === link.href
                    ? "text-amber-500"
                    : "text-white/70 hover:text-white"
                }`}
              >
                {link.label}
                {pathname === link.href && (
                  <motion.div
                    layoutId="navIndicator"
                    className="absolute -bottom-2 left-0 right-0 h-0.5 rounded-full bg-amber-500"
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Live Clock */}
          <LiveClock />

          <div className="flex items-center gap-3">
            {isAuthenticated && user ? (
              <>
                {/* User Dropdown */}
                <div className="hidden sm:block">
                  <UserDropdown />
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hidden sm:inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-white/10"
                >
                  Masuk
                </Link>
                <Link
                  href="/register"
                  className="group relative hidden sm:inline-flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-amber-500 to-orange-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-amber-500/25 transition-all hover:scale-105"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Daftar
                    <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="flex md:hidden h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-white transition-colors hover:bg-white/10"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute right-0 top-0 h-full w-72 border-l border-white/5 bg-[#0d0a08]/95 backdrop-blur-xl p-8 pt-24"
              onClick={(e) => e.stopPropagation()}
            >
              {/* User Info in Mobile */}
              {isAuthenticated && user && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="mb-6 flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.03] p-4"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-orange-600">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{user.name}</p>
                    <p className="text-xs text-white/40">{user.email}</p>
                  </div>
                </motion.div>
              )}

              <div className="flex flex-col gap-2">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 rounded-xl px-4 py-3 text-lg font-medium transition-colors ${
                        pathname === link.href
                          ? "bg-amber-500/10 text-amber-400"
                          : "text-white/60 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-8 space-y-3"
              >
                {isAuthenticated ? (
                  <button
                    onClick={() => { logout(); setMobileOpen(false); }}
                    className="flex w-full items-center justify-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-6 py-3.5 font-semibold text-red-400 transition-all hover:bg-red-500/20"
                  >
                    <LogOut className="h-4 w-4" />
                    Keluar
                  </button>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setMobileOpen(false)}
                      className="flex w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3.5 font-semibold text-white"
                    >
                      Masuk
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setMobileOpen(false)}
                      className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-amber-500/25"
                    >
                      Daftar
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </>
                )}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
