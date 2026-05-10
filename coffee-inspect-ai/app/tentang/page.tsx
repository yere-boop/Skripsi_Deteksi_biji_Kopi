"use client";

import { motion } from "framer-motion";
import {
  Brain, Cpu, Database, Globe, Coffee, ShieldCheck,
  ScanFace, BarChart3, Layers, ArrowRight, Code2, Sparkles
} from "lucide-react";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const techStack = [
  { name: "Next.js 16", desc: "Framework React modern untuk frontend", icon: Globe, color: "from-white/20 to-white/5" },
  { name: "TensorFlow / Keras", desc: "Deep Learning untuk klasifikasi gambar", icon: Brain, color: "from-amber-500/20 to-amber-500/5" },
  { name: "FastAPI", desc: "Backend Python untuk serving model AI", icon: Cpu, color: "from-green-500/20 to-green-500/5" },
  { name: "Convex", desc: "Realtime database & backend functions", icon: Database, color: "from-blue-500/20 to-blue-500/5" },
  { name: "Framer Motion", desc: "Animasi dan transisi halus", icon: Sparkles, color: "from-purple-500/20 to-purple-500/5" },
  { name: "TypeScript", desc: "Type-safe development", icon: Code2, color: "from-cyan-500/20 to-cyan-500/5" },
];

const features = [
  {
    icon: Coffee,
    title: "Identifikasi Spesies",
    desc: "Mengklasifikasikan jenis kopi (Arabika atau Robusta) berdasarkan analisis visual morfologi biji kopi menggunakan model CNN.",
  },
  {
    icon: ScanFace,
    title: "Klasifikasi Tingkat Sangrai",
    desc: "Menentukan tingkat sangrai (Light, Medium, Dark Roast) melalui analisis warna dan tekstur permukaan biji kopi.",
  },
  {
    icon: ShieldCheck,
    title: "Deteksi Cacat Fisik",
    desc: "Mengidentifikasi tingkat cacat fisik biji kopi untuk penentuan grade mutu sesuai standar SNI.",
  },
  {
    icon: BarChart3,
    title: "Skor Mutu Terintegrasi",
    desc: "Menghitung skor mutu keseluruhan (0-100) berdasarkan kombinasi spesies, tingkat sangrai, dan tingkat cacat fisik.",
  },
];

const steps = [
  { step: "01", title: "Upload Gambar", desc: "Pengguna mengunggah foto sampel biji kopi melalui antarmuka web." },
  { step: "02", title: "Preprocessing", desc: "Gambar di-resize ke 224×224 pixel dan dinormalisasi untuk input model." },
  { step: "03", title: "Inferensi AI", desc: "Tiga model CNN memproses gambar secara paralel untuk klasifikasi." },
  { step: "04", title: "Hasil & Penyimpanan", desc: "Hasil analisis ditampilkan dan disimpan ke database untuk dokumentasi." },
];

export default function TentangPage() {
  return (
    <main className="min-h-screen bg-[#0d0a08] text-[#f4efe6] selection:bg-amber-700/50">
      <Navbar />

      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 h-[600px] w-[600px] rounded-full bg-amber-900/10 blur-[120px]" />
        <div className="absolute bottom-0 right-[-10%] h-[500px] w-[500px] rounded-full bg-orange-900/10 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 pt-28 pb-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-4 py-2 text-sm font-medium text-amber-400">
            <Layers className="h-4 w-4" />
            <span>Tentang Sistem</span>
          </div>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-white md:text-5xl">
            Coffee Inspect<span className="text-amber-500">.AI</span>
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-white/50">
            Sistem inspeksi kualitas biji kopi berbasis kecerdasan buatan (AI) yang dirancang
            untuk mengidentifikasi spesies, tingkat sangrai, dan cacat fisik secara otomatis
            menggunakan teknik <span className="text-white/70 font-medium">Computer Vision</span> dan{" "}
            <span className="text-white/70 font-medium">Convolutional Neural Network (CNN)</span>.
          </p>
        </motion.div>

        {/* Methodology Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-16"
        >
          <h2 className="text-3xl font-bold text-white">
            Metodologi <span className="text-amber-500">Penelitian</span>
          </h2>
          <p className="mt-3 max-w-3xl text-white/50">
            Sistem ini dikembangkan menggunakan pendekatan pengembangan perangkat lunak
            berbasis prototyping dengan arsitektur microservice.
          </p>

          {/* Architecture Diagram */}
          <div className="mt-8 rounded-[2rem] border border-white/5 bg-white/[0.02] p-8">
            <div className="grid gap-6 md:grid-cols-3">
              {[
                { label: "Frontend", tech: "Next.js + React", desc: "Antarmuka pengguna responsif dan interaktif", color: "border-blue-500/30", icon: Globe },
                { label: "AI Service", tech: "FastAPI + TensorFlow", desc: "Serving model deep learning untuk prediksi", color: "border-amber-500/30", icon: Brain },
                { label: "Database", tech: "Convex Cloud", desc: "Penyimpanan data realtime dan serverless", color: "border-green-500/30", icon: Database },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * i }}
                  className={`rounded-2xl border ${item.color} bg-white/[0.02] p-6 text-center`}
                >
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white/5">
                    <item.icon className="h-6 w-6 text-amber-400" />
                  </div>
                  <h4 className="mt-4 text-lg font-bold text-white">{item.label}</h4>
                  <p className="mt-1 text-sm font-medium text-amber-400">{item.tech}</p>
                  <p className="mt-2 text-sm text-white/40">{item.desc}</p>
                </motion.div>
              ))}
            </div>

            {/* Flow arrows */}
            <div className="mt-6 flex items-center justify-center gap-4 text-white/20">
              <span className="text-xs">Frontend</span>
              <ArrowRight className="h-4 w-4" />
              <span className="text-xs">AI Service</span>
              <ArrowRight className="h-4 w-4" />
              <span className="text-xs">Database</span>
            </div>
          </div>
        </motion.div>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-20"
        >
          <h2 className="text-3xl font-bold text-white">
            Alur <span className="text-amber-500">Kerja Sistem</span>
          </h2>
          <p className="mt-3 max-w-3xl text-white/50">
            Proses inspeksi kopi dari upload gambar hingga hasil analisis AI.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * i }}
                className="group relative rounded-2xl border border-white/5 bg-white/[0.02] p-6 transition-all hover:bg-white/[0.04] hover:border-white/10"
              >
                <span className="text-4xl font-black text-amber-500/10 group-hover:text-amber-500/20 transition-colors">
                  {item.step}
                </span>
                <h4 className="mt-2 text-lg font-bold text-white">{item.title}</h4>
                <p className="mt-2 text-sm leading-relaxed text-white/40">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-20"
        >
          <h2 className="text-3xl font-bold text-white">
            Fitur <span className="text-amber-500">Utama</span>
          </h2>
          <p className="mt-3 max-w-3xl text-white/50">
            Empat kapabilitas utama yang ditawarkan sistem inspeksi ini.
          </p>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * i }}
                className="group flex gap-5 rounded-2xl border border-white/5 bg-white/[0.02] p-6 transition-all hover:bg-white/[0.04]"
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-amber-500/10">
                  <feature.icon className="h-7 w-7 text-amber-400" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white">{feature.title}</h4>
                  <p className="mt-2 text-sm leading-relaxed text-white/50">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Tech Stack */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-20"
        >
          <h2 className="text-3xl font-bold text-white">
            Teknologi yang <span className="text-amber-500">Digunakan</span>
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {techStack.map((tech, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.05 * i }}
                className="flex items-center gap-4 rounded-2xl border border-white/5 bg-white/[0.02] p-5 transition-all hover:bg-white/[0.04]"
              >
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${tech.color}`}>
                  <tech.icon className="h-5 w-5 text-white/70" />
                </div>
                <div>
                  <p className="font-semibold text-white">{tech.name}</p>
                  <p className="text-xs text-white/40">{tech.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-20 rounded-[3rem] bg-gradient-to-br from-[#1c120a] to-[#0a0704] border border-amber-900/30 p-10 md:p-16 text-center"
        >
          <h3 className="text-3xl font-black text-white md:text-4xl">
            Siap Mencoba Sistem Ini?
          </h3>
          <p className="mt-4 text-white/50">
            Mulai inspeksi kualitas biji kopi Anda dengan teknologi AI terkini.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/inspeksi"
              className="flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 px-8 py-4 font-bold text-white shadow-lg shadow-amber-500/25 transition-all hover:scale-105"
            >
              <ScanFace className="h-5 w-5" />
              Mulai Inspeksi
            </Link>
            <Link
              href="/dashboard"
              className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-8 py-4 font-bold text-white transition-all hover:bg-white/10"
            >
              <BarChart3 className="h-5 w-5" />
              Buka Dashboard
            </Link>
          </div>
        </motion.div>
      </div>

      <Footer />
    </main>
  );
}
