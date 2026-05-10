"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Coffee, ShieldCheck, Zap, BarChart3, ChevronRight, CheckCircle2, ScanFace, FileText, LogIn, UserPlus } from "lucide-react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import FloatingBeans from "./components/FloatingBeans";
import { useAuth } from "./context/AuthContext";

export default function Home() {
  const { isAuthenticated, user } = useAuth();

  return (
    <main className="min-h-screen bg-[#0d0a08] text-[#f4efe6] selection:bg-amber-700/50">
      {/* Navigation */}
      <Navbar />
      <FloatingBeans />


      {/* Hero Section */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden pt-20">
        {/* Background Effects */}
        <div className="absolute top-1/4 -left-1/4 h-[800px] w-[800px] rounded-full bg-amber-900/20 blur-[120px]" />
        <div className="absolute bottom-0 right-[-10%] h-[600px] w-[600px] rounded-full bg-orange-900/20 blur-[120px]" />
        
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay"></div>

        <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-6 py-20 md:grid-cols-2 lg:gap-24">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-4 py-2 text-sm font-medium text-amber-400">
              <Zap className="h-4 w-4" />
              <span>Sistem Inspeksi Kopi Generasi Baru</span>
            </div>

            <h2 className="mt-8 text-5xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-6xl lg:text-7xl">
              Elevate Your <br />
              <span className="bg-gradient-to-r from-amber-400 via-orange-500 to-amber-600 bg-clip-text text-transparent">
                Coffee Quality
              </span>
            </h2>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/60">
              Platform kecerdasan buatan untuk identifikasi spesies, deteksi cacat fisik, dan klasifikasi tingkat sangrai dengan akurasi tinggi.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-5">
              {isAuthenticated ? (
                <>
                  <Link
                    href="/dashboard"
                    className="group relative flex h-14 items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-amber-500 to-orange-600 px-8 font-semibold text-white shadow-[0_0_40px_-10px_rgba(245,158,11,0.5)] transition-all hover:scale-105 hover:shadow-[0_0_60px_-15px_rgba(245,158,11,0.7)]"
                  >
                    Mulai Inspeksi Sekarang
                    <ScanFace className="h-5 w-5" />
                  </Link>

                  <Link
                    href="/inspeksi"
                    className="flex h-14 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-8 font-semibold text-white backdrop-blur-md transition-all hover:bg-white/10"
                  >
                    Pelajari AI Kami
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/register"
                    className="group relative flex h-14 items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-amber-500 to-orange-600 px-8 font-semibold text-white shadow-[0_0_40px_-10px_rgba(245,158,11,0.5)] transition-all hover:scale-105 hover:shadow-[0_0_60px_-15px_rgba(245,158,11,0.7)]"
                  >
                    <UserPlus className="h-5 w-5" />
                    Daftar Gratis
                  </Link>

                  <Link
                    href="/login"
                    className="flex h-14 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-8 font-semibold text-white backdrop-blur-md transition-all hover:bg-white/10"
                  >
                    <LogIn className="h-5 w-5" />
                    Masuk
                  </Link>
                </>
              )}
            </div>

            <div className="mt-14 flex items-center gap-8 border-t border-white/10 pt-8">
              <div>
                <p className="text-3xl font-bold text-white">99<span className="text-amber-500">%</span></p>
                <p className="text-sm font-medium text-white/50">Akurasi AI</p>
              </div>
              <div className="h-10 w-[1px] bg-white/10"></div>
              <div>
                <p className="text-3xl font-bold text-white">0.5<span className="text-amber-500">s</span></p>
                <p className="text-sm font-medium text-white/50">Waktu Proses</p>
              </div>
              <div className="h-10 w-[1px] bg-white/10"></div>
              <div>
                <p className="text-3xl font-bold text-white">24<span className="text-amber-500">/7</span></p>
                <p className="text-sm font-medium text-white/50">Akses Sistem</p>
              </div>
            </div>
          </motion.div>

          {/* Interactive UI Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
            className="relative mx-auto w-full max-w-lg perspective-1000"
          >
            <div className="absolute -inset-1 rounded-[2.5rem] bg-gradient-to-br from-amber-500/30 to-orange-600/30 blur-2xl opacity-50"></div>
            
            <div className="relative rounded-[2rem] border border-white/10 bg-[#14100c]/80 p-2 backdrop-blur-xl shadow-2xl">
              <div className="rounded-[1.75rem] border border-white/5 bg-[#0a0806] p-6">
                
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <div>
                    <p className="text-xs font-medium text-white/40 uppercase tracking-wider">Hasil Analisis</p>
                    <p className="text-lg font-bold text-white">Sample #8902</p>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/10 text-amber-500">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  {[
                    { label: "Spesies Kopi", value: "Arabica", badge: "High Confidence" },
                    { label: "Tingkat Sangrai", value: "Medium Roast", badge: "Agtron 45" },
                    { label: "Cacat Fisik", value: "0.2%", badge: "Grade 1" },
                  ].map((item, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + (i * 0.2) }}
                      className="group flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] p-4 transition-colors hover:bg-white/[0.04]"
                    >
                      <div>
                        <p className="text-xs text-white/50">{item.label}</p>
                        <p className="mt-1 font-semibold text-white">{item.value}</p>
                      </div>
                      <div className="rounded-md bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-400">
                        {item.badge}
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-6 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-600/20 p-5">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-sm font-medium text-white/70">Final Score</p>
                      <p className="mt-1 text-4xl font-bold text-white">92<span className="text-xl text-white/40">/100</span></p>
                    </div>
                    <BarChart3 className="h-10 w-10 text-amber-500 opacity-80" />
                  </div>
                </div>

              </div>
            </div>
            
            {/* Floating Element */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -right-6 top-20 rounded-2xl border border-white/10 bg-[#1c1612]/90 p-4 shadow-xl backdrop-blur-md"
            >
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.6)]"></div>
                <p className="text-sm font-medium text-white">AI Engine Online</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 py-24">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-3xl font-extrabold text-white md:text-5xl">
              Teknologi Inspeksi <span className="text-amber-500">Mutakhir</span>
            </h3>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-white/50">
              Ditenagai oleh model machine learning terkini untuk memberikan analisis yang presisi, objektif, dan dapat diandalkan setiap saat.
            </p>
          </motion.div>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {[
            {
              icon: <Coffee className="h-8 w-8 text-amber-400" />,
              title: "Identifikasi Spesies",
              desc: "Mengenali jenis kopi (Arabika, Robusta, dll) secara akurat berdasarkan morfologi visual biji kopi."
            },
            {
              icon: <ShieldCheck className="h-8 w-8 text-amber-400" />,
              title: "Deteksi Cacat Fisik",
              desc: "Identifikasi instan untuk biji hitam, pecah, berlubang, dan cacat lainnya untuk penentuan grade."
            },
            {
              icon: <ScanFace className="h-8 w-8 text-amber-400" />,
              title: "Klasifikasi Sangrai",
              desc: "Analisis konsistensi warna dan tingkat kematangan sangrai (Light, Medium, Dark) dengan presisi pixel."
            }
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.2 }}
              className="group relative overflow-hidden rounded-[2rem] border border-white/5 bg-white/[0.02] p-8 transition-all hover:bg-white/[0.04] hover:border-white/10"
            >
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-amber-500/5 blur-3xl transition-all group-hover:bg-amber-500/10"></div>
              
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 shadow-inner">
                {feature.icon}
              </div>
              <h4 className="text-2xl font-bold text-white">{feature.title}</h4>
              <p className="mt-4 leading-relaxed text-white/50">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="mx-auto max-w-7xl px-6 pb-32">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-[#1c120a] to-[#0a0704] border border-amber-900/30 p-10 md:p-20 text-center shadow-2xl"
        >
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] mix-blend-overlay"></div>
          <div className="absolute top-1/2 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-600/10 blur-[80px]"></div>
          
          <div className="relative z-10 mx-auto max-w-3xl">
            <h3 className="text-4xl font-black text-white md:text-5xl">
              Siap Memulai Inspeksi?
            </h3>
            <p className="mt-6 text-lg text-white/60">
              Ubah cara Anda menilai kualitas kopi dengan sistem berbasis AI. Lebih cepat, lebih akurat, dan terdokumentasi dengan rapi.
            </p>
            
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/dashboard"
                className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-amber-500 px-8 py-4 font-bold text-black shadow-lg shadow-amber-500/25 transition-all hover:bg-amber-400 hover:scale-105"
              >
                Buka Dashboard
                <ChevronRight className="h-5 w-5" />
              </Link>
              
              <Link
                href="/riwayat"
                className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-8 py-4 font-bold text-white backdrop-blur-sm transition-all hover:bg-white/10"
              >
                <FileText className="h-5 w-5" />
                Lihat Laporan
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
      
      {/* Footer */}
      <Footer />
    </main>
  );
}