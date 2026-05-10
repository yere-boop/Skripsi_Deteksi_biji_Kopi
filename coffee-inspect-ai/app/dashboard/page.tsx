"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { motion } from "framer-motion";
import {
  BarChart3, CheckCircle2, TrendingUp, Plus, ArrowRight, Clock,
  Coffee, Flame, AlertTriangle, Activity
} from "lucide-react";
import Navbar from "../components/Navbar";
import ScoreRing from "../components/ScoreRing";
import { useToast } from "../components/Toast";
import ProtectedRoute from "../components/ProtectedRoute";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (target === 0) { setCount(0); return; }
    let start = 0;
    const duration = 1500;
    const step = Math.max(1, Math.floor(target / 60));
    const interval = duration / (target / step);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else { setCount(start); }
    }, interval);
    return () => clearInterval(timer);
  }, [target]);

  return (
    <span className="tabular-nums">{count}{suffix}</span>
  );
}

function MiniBar({ label, value, total, color }: { label: string; value: number; total: number; color: string }) {
  const pct = total > 0 ? (value / total) * 100 : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="w-20 text-xs text-white/40 truncate">{label}</span>
      <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
          className="h-full rounded-full"
          style={{ background: color }}
        />
      </div>
      <span className="w-8 text-right text-xs font-bold text-white/60">{value}</span>
    </div>
  );
}

export default function DashboardPage() {
  const stats = useQuery(api.inspections.getStats);
  const inspections = useQuery(api.inspections.getAll);
  const seed = useMutation(api.inspections.seed);
  const { toast } = useToast();
  const { user } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 11) return "Selamat Pagi";
    if (hour < 15) return "Selamat Siang";
    if (hour < 18) return "Selamat Sore";
    return "Selamat Malam";
  };

  const handleSeed = async () => {
    const result = await seed({});
    toast(result, "success");
  };

  // Compute distributions
  const speciesDist: Record<string, number> = {};
  const roastDist: Record<string, number> = {};
  const statusDist: Record<string, number> = {};

  inspections?.forEach((item) => {
    speciesDist[item.species] = (speciesDist[item.species] || 0) + 1;
    roastDist[item.roastLevel] = (roastDist[item.roastLevel] || 0) + 1;
    statusDist[item.status] = (statusDist[item.status] || 0) + 1;
  });

  const total = inspections?.length || 0;

  const speciesColors: Record<string, string> = {
    Arabika: "#f59e0b", Robusta: "#ef4444", Liberica: "#22c55e",
  };
  const roastColors: Record<string, string> = {
    "Light Roast": "#fbbf24", "Medium Roast": "#f97316", "Dark Roast": "#7c2d12",
  };

  return (
    <ProtectedRoute>
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
          className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-4 py-2 text-sm font-medium text-amber-400">
              <BarChart3 className="h-4 w-4" />
              <span>Pusat Kontrol</span>
            </div>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-white md:text-5xl">
              {user ? (
                <>{getGreeting()}, <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">{user.name.split(' ')[0]}</span> 👋</>
              ) : (
                "Dashboard"
              )}
            </h1>
            <p className="mt-3 max-w-2xl text-lg text-white/50">
              Pantau total inspeksi, distribusi data, dan aktivitas sistem secara realtime.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSeed}
              className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/10"
            >
              Isi Data Contoh
            </button>
            <Link
              href="/inspeksi"
              className="flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 px-6 py-3 font-semibold text-white shadow-lg shadow-amber-500/25 transition-all hover:scale-105"
            >
              <Plus className="h-5 w-5" />
              Inspeksi Baru
            </Link>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              label: "Total Inspeksi",
              value: stats ? stats.total : 0,
              icon: <BarChart3 className="h-6 w-6 text-amber-400" />,
              suffix: "",
            },
            {
              label: "Inspeksi Selesai",
              value: stats ? stats.completed : 0,
              icon: <CheckCircle2 className="h-6 w-6 text-green-400" />,
              suffix: "",
            },
            {
              label: "Rata-rata Skor",
              value: stats ? stats.averageScore : 0,
              icon: <TrendingUp className="h-6 w-6 text-orange-400" />,
              suffix: "",
            },
            {
              label: "Tingkat Keberhasilan",
              value: stats && stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0,
              icon: <Activity className="h-6 w-6 text-blue-400" />,
              suffix: "%",
            },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + idx * 0.1 }}
              className="group relative overflow-hidden rounded-[2rem] border border-white/5 bg-white/[0.02] p-7 transition-all hover:bg-white/[0.04] hover:border-white/10"
            >
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-amber-500/5 blur-2xl transition-all group-hover:bg-amber-500/10" />
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-white/50">{stat.label}</p>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5">
                  {stat.icon}
                </div>
              </div>
              <p className="mt-4 text-4xl font-bold text-white">
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              </p>
            </motion.div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {/* Average Score Ring */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col items-center rounded-[2rem] border border-white/5 bg-white/[0.02] p-8"
          >
            <div className="flex items-center gap-2 text-sm font-medium text-amber-400 self-start">
              <TrendingUp className="h-4 w-4" />
              Rata-rata Skor
            </div>
            <div className="mt-6">
              <ScoreRing score={stats?.averageScore || 0} size={160} strokeWidth={10} />
            </div>
            <p className="mt-4 text-center text-sm text-white/40">
              Skor rata-rata dari semua inspeksi yang telah selesai
            </p>
          </motion.div>

          {/* Species Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="rounded-[2rem] border border-white/5 bg-white/[0.02] p-8"
          >
            <div className="flex items-center gap-2 text-sm font-medium text-amber-400">
              <Coffee className="h-4 w-4" />
              Distribusi Spesies
            </div>
            <div className="mt-6 space-y-4">
              {Object.entries(speciesDist).length > 0 ? (
                Object.entries(speciesDist).map(([species, count]) => (
                  <MiniBar
                    key={species}
                    label={species}
                    value={count}
                    total={total}
                    color={speciesColors[species] || "#f59e0b"}
                  />
                ))
              ) : (
                <p className="text-sm text-white/30 text-center py-8">Belum ada data</p>
              )}
            </div>
          </motion.div>

          {/* Roast Level Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="rounded-[2rem] border border-white/5 bg-white/[0.02] p-8"
          >
            <div className="flex items-center gap-2 text-sm font-medium text-amber-400">
              <Flame className="h-4 w-4" />
              Distribusi Sangrai
            </div>
            <div className="mt-6 space-y-4">
              {Object.entries(roastDist).length > 0 ? (
                Object.entries(roastDist).map(([roast, count]) => (
                  <MiniBar
                    key={roast}
                    label={roast}
                    value={count}
                    total={total}
                    color={roastColors[roast] || "#f97316"}
                  />
                ))
              ) : (
                <p className="text-sm text-white/30 text-center py-8">Belum ada data</p>
              )}
            </div>
          </motion.div>
        </div>

        {/* Status Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="mt-8 rounded-[2rem] border border-white/5 bg-white/[0.02] p-8"
        >
          <div className="flex items-center gap-2 text-sm font-medium text-amber-400">
            <AlertTriangle className="h-4 w-4" />
            Status Inspeksi
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              { label: "Selesai", count: statusDist["Selesai"] || 0, color: "bg-green-500", textColor: "text-green-400" },
              { label: "Diproses", count: statusDist["Diproses"] || 0, color: "bg-blue-500", textColor: "text-blue-400" },
              { label: "Tersimpan", count: statusDist["Tersimpan"] || 0, color: "bg-yellow-500", textColor: "text-yellow-400" },
            ].map((st, i) => (
              <motion.div
                key={st.label}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + i * 0.1 }}
                className="flex items-center gap-4 rounded-xl border border-white/5 bg-white/[0.02] p-5"
              >
                <div className={`h-3 w-3 rounded-full ${st.color} shadow-lg`} style={{ boxShadow: `0 0 12px ${st.color.replace("bg-", "")}` }} />
                <div>
                  <p className="text-sm text-white/50">{st.label}</p>
                  <p className={`text-2xl font-bold ${st.textColor}`}>{st.count}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-8 rounded-[2rem] border border-white/5 bg-white/[0.02] p-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm font-medium text-amber-400">
                <Clock className="h-4 w-4" />
                Aktivitas Terbaru
              </div>
              <h3 className="mt-2 text-2xl font-bold text-white">Riwayat Inspeksi</h3>
            </div>
            <Link
              href="/riwayat"
              className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-white/10"
            >
              Lihat Semua
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-8 space-y-3">
            {!inspections && (
              <div className="flex items-center gap-3 p-4">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-amber-500" />
                <p className="text-sm text-white/40">Memuat data...</p>
              </div>
            )}

            {inspections?.length === 0 && (
              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-8 text-center">
                <Coffee className="mx-auto h-10 w-10 text-white/15" />
                <p className="mt-3 text-white/40">Belum ada data inspeksi.</p>
                <p className="text-sm text-white/25">Klik &quot;Isi Data Contoh&quot; atau mulai inspeksi baru.</p>
              </div>
            )}

            {inspections?.slice(0, 5).map((item, idx) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + idx * 0.08 }}
                className="group flex items-center gap-5 rounded-xl border border-white/5 bg-white/[0.02] p-5 transition-colors hover:bg-white/[0.04]"
              >
                {/* Mini Score */}
                <div className="hidden sm:block">
                  <ScoreRing score={item.score} size={48} strokeWidth={4} />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white truncate">{item.sampleName}</p>
                  <p className="mt-1 text-sm text-white/40">
                    {item.species} • {item.roastLevel} • {item.defectLevel || "-"}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className={`rounded-md px-2 py-1 text-xs font-medium ${
                    item.status === "Selesai" ? "bg-green-500/10 text-green-400" :
                    item.status === "Diproses" ? "bg-blue-500/10 text-blue-400" :
                    "bg-yellow-500/10 text-yellow-400"
                  }`}>
                    {item.status}
                  </div>
                  <div className="rounded-lg bg-amber-500/10 px-3 py-1.5 text-sm font-bold text-amber-400">
                    {item.score === 0 ? "-" : `${item.score}/100`}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
      <Footer />
    </main>
    </ProtectedRoute>
  );
}