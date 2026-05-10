"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText, Trash2, MapPin, Coffee, ImageIcon, Search,
  Filter, SortDesc, Grid3X3, List, X, ChevronDown, Eye
} from "lucide-react";
import Navbar from "../components/Navbar";
import ScoreRing from "../components/ScoreRing";
import { useToast } from "../components/Toast";
import ProtectedRoute from "../components/ProtectedRoute";
import Footer from "../components/Footer";

type ViewMode = "list" | "grid";

export default function RiwayatPage() {
  const inspections = useQuery(api.inspections.getAll);
  const removeInspection = useMutation(api.inspections.remove);
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState("");
  const [speciesFilter, setSpeciesFilter] = useState("all");
  const [roastFilter, setRoastFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "score-high" | "score-low">("newest");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [showFilters, setShowFilters] = useState(false);

  // Compute unique values for filters
  const speciesList = useMemo(() => {
    if (!inspections) return [];
    return [...new Set(inspections.map((i) => i.species))];
  }, [inspections]);

  const roastList = useMemo(() => {
    if (!inspections) return [];
    return [...new Set(inspections.map((i) => i.roastLevel))];
  }, [inspections]);

  // Filter and sort
  const filtered = useMemo(() => {
    if (!inspections) return [];
    let result = [...inspections];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (i) =>
          i.sampleName.toLowerCase().includes(q) ||
          i.species.toLowerCase().includes(q) ||
          i.roastLevel.toLowerCase().includes(q) ||
          (i.location || "").toLowerCase().includes(q)
      );
    }

    if (speciesFilter !== "all") {
      result = result.filter((i) => i.species === speciesFilter);
    }
    if (roastFilter !== "all") {
      result = result.filter((i) => i.roastLevel === roastFilter);
    }

    switch (sortBy) {
      case "oldest":
        result.sort((a, b) => a.createdAt - b.createdAt);
        break;
      case "score-high":
        result.sort((a, b) => b.score - a.score);
        break;
      case "score-low":
        result.sort((a, b) => a.score - b.score);
        break;
      default:
        result.sort((a, b) => b.createdAt - a.createdAt);
    }

    return result;
  }, [inspections, searchQuery, speciesFilter, roastFilter, sortBy]);

  const activeFilterCount = [speciesFilter !== "all", roastFilter !== "all"].filter(Boolean).length;

  const handleDelete = async (id: Id<"inspections">, sampleName: string) => {
    const ok = confirm(`Yakin ingin menghapus data "${sampleName}"?`);
    if (!ok) return;
    try {
      await removeInspection({ id });
      toast("Data berhasil dihapus", "success");
    } catch (error) {
      console.error(error);
      toast("Gagal menghapus data", "error");
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSpeciesFilter("all");
    setRoastFilter("all");
    setSortBy("newest");
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
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-4 py-2 text-sm font-medium text-amber-400">
            <FileText className="h-4 w-4" />
            <span>Riwayat Inspeksi</span>
          </div>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-white md:text-5xl">
            Daftar Hasil Inspeksi
          </h1>
          <p className="mt-3 max-w-3xl text-lg text-white/50">
            Cari, filter, dan kelola seluruh hasil inspeksi kopi Anda.
          </p>
        </motion.div>

        {/* Search & Toolbar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center"
        >
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari sampel, spesies, lokasi..."
              className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-white placeholder-white/30 outline-none transition-colors focus:border-amber-500/50 focus:bg-white/[0.07] focus:ring-1 focus:ring-amber-500/20"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-all ${
              showFilters || activeFilterCount > 0
                ? "border-amber-500/30 bg-amber-500/10 text-amber-400"
                : "border-white/10 bg-white/5 text-white/60 hover:bg-white/10"
            }`}
          >
            <Filter className="h-4 w-4" />
            Filter
            {activeFilterCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-black">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Sort */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="appearance-none rounded-xl border border-white/10 bg-white/5 py-3 pl-4 pr-10 text-sm font-medium text-white/60 outline-none transition-colors hover:bg-white/10 focus:border-amber-500/50"
            >
              <option value="newest">Terbaru</option>
              <option value="oldest">Terlama</option>
              <option value="score-high">Skor Tertinggi</option>
              <option value="score-low">Skor Terendah</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30 pointer-events-none" />
          </div>

          {/* View Toggle */}
          <div className="flex rounded-xl border border-white/10 bg-white/5 overflow-hidden">
            <button
              onClick={() => setViewMode("list")}
              className={`flex items-center gap-1 px-3 py-3 text-sm transition-colors ${
                viewMode === "list" ? "bg-amber-500/10 text-amber-400" : "text-white/40 hover:text-white/60"
              }`}
            >
              <List className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`flex items-center gap-1 px-3 py-3 text-sm transition-colors ${
                viewMode === "grid" ? "bg-amber-500/10 text-amber-400" : "text-white/40 hover:text-white/60"
              }`}
            >
              <Grid3X3 className="h-4 w-4" />
            </button>
          </div>
        </motion.div>

        {/* Filter Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="mt-4 flex flex-wrap items-center gap-4 rounded-2xl border border-white/5 bg-white/[0.02] p-5">
                <div>
                  <p className="mb-2 text-xs font-medium text-white/40">Spesies</p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setSpeciesFilter("all")}
                      className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                        speciesFilter === "all" ? "bg-amber-500/20 text-amber-400" : "bg-white/5 text-white/40 hover:bg-white/10"
                      }`}
                    >
                      Semua
                    </button>
                    {speciesList.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSpeciesFilter(s)}
                        className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                          speciesFilter === s ? "bg-amber-500/20 text-amber-400" : "bg-white/5 text-white/40 hover:bg-white/10"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="h-8 w-[1px] bg-white/10 hidden sm:block" />

                <div>
                  <p className="mb-2 text-xs font-medium text-white/40">Tingkat Sangrai</p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setRoastFilter("all")}
                      className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                        roastFilter === "all" ? "bg-amber-500/20 text-amber-400" : "bg-white/5 text-white/40 hover:bg-white/10"
                      }`}
                    >
                      Semua
                    </button>
                    {roastList.map((r) => (
                      <button
                        key={r}
                        onClick={() => setRoastFilter(r)}
                        className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                          roastFilter === r ? "bg-amber-500/20 text-amber-400" : "bg-white/5 text-white/40 hover:bg-white/10"
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                {activeFilterCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="ml-auto flex items-center gap-1 rounded-lg bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-400 transition-all hover:bg-red-500/20"
                  >
                    <X className="h-3 w-3" /> Reset Filter
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Count */}
        {inspections && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 text-sm text-white/30"
          >
            Menampilkan {filtered.length} dari {inspections.length} inspeksi
          </motion.p>
        )}

        {/* Loading */}
        {!inspections && (
          <div className="mt-12 flex flex-col items-center rounded-[2rem] border border-white/5 bg-white/[0.02] p-12">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-amber-500" />
            <p className="mt-4 text-white/40">Memuat data...</p>
          </div>
        )}

        {/* Empty */}
        {inspections?.length === 0 && (
          <div className="mt-12 flex flex-col items-center rounded-[2rem] border border-white/5 bg-white/[0.02] p-12">
            <Coffee className="h-12 w-12 text-white/15" />
            <p className="mt-4 text-lg font-medium text-white/40">Belum ada data inspeksi.</p>
            <p className="mt-1 text-sm text-white/25">Mulai inspeksi pertama Anda dari halaman Inspeksi.</p>
          </div>
        )}

        {/* No Results from filter */}
        {filtered.length === 0 && inspections && inspections.length > 0 && (
          <div className="mt-12 flex flex-col items-center rounded-[2rem] border border-white/5 bg-white/[0.02] p-12">
            <Search className="h-12 w-12 text-white/15" />
            <p className="mt-4 text-lg font-medium text-white/40">Tidak ada hasil yang cocok.</p>
            <button onClick={clearFilters} className="mt-3 text-sm text-amber-400 hover:text-amber-300 transition-colors">
              Reset semua filter
            </button>
          </div>
        )}

        {/* LIST VIEW */}
        {viewMode === "list" && (
          <div className="mt-6 space-y-6">
            <AnimatePresence>
              {filtered.map((item, idx) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  layout
                  className="overflow-hidden rounded-[2rem] border border-white/5 bg-white/[0.02] transition-all hover:border-white/10"
                >
                  <div className="grid gap-0 lg:grid-cols-[280px_1fr]">
                    {/* Image */}
                    <div className="border-b border-white/5 bg-white/[0.02] p-5 lg:border-b-0 lg:border-r">
                      <div className="overflow-hidden rounded-2xl border border-white/5 bg-[#0a0806]">
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt={item.sampleName} className="h-60 w-full object-cover" />
                        ) : (
                          <div className="flex h-60 flex-col items-center justify-center gap-3 text-white/15">
                            <ImageIcon className="h-8 w-8" />
                            <p className="text-xs">No Image</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                        <div className="flex items-start gap-4">
                          <div className="hidden sm:block mt-1">
                            <ScoreRing score={item.score} size={56} strokeWidth={4} />
                          </div>
                          <div>
                            <h2 className="text-xl font-bold text-white">{item.sampleName}</h2>
                            <div className="mt-1 flex items-center gap-2 text-sm text-white/40">
                              <MapPin className="h-3.5 w-3.5" />
                              {item.location || "Lokasi tidak tersedia"}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className={`rounded-md px-2.5 py-1 text-xs font-medium ${
                            item.status === "Selesai" ? "bg-green-500/10 text-green-400" :
                            item.status === "Diproses" ? "bg-blue-500/10 text-blue-400" :
                            "bg-yellow-500/10 text-yellow-400"
                          }`}>
                            {item.status}
                          </div>
                          <Link
                            href={`/riwayat/${item._id}`}
                            className="flex h-8 items-center gap-1.5 rounded-lg bg-amber-500/10 px-3 text-xs font-medium text-amber-400 transition-all hover:bg-amber-500/20"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            Detail
                          </Link>
                          <button
                            onClick={() => handleDelete(item._id, item.sampleName)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10 text-red-400 transition-all hover:bg-red-500/20"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="mt-5 grid gap-2 grid-cols-2 xl:grid-cols-4">
                        {[
                          { label: "Spesies", value: item.species },
                          { label: "Sangrai", value: item.roastLevel },
                          { label: "Cacat Fisik", value: item.defectLevel || "-" },
                          { label: "Skor", value: item.score > 0 ? `${item.score}/100` : "-" },
                        ].map((s, i) => (
                          <div key={i} className="rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2.5">
                            <p className="text-[10px] text-white/30 uppercase tracking-wider">{s.label}</p>
                            <p className="mt-0.5 text-sm font-semibold text-white">{s.value}</p>
                          </div>
                        ))}
                      </div>

                      {item.aiSummary && (
                        <div className="mt-4 rounded-lg border border-white/5 bg-white/[0.02] px-4 py-3">
                          <p className="text-[10px] text-amber-400/60 uppercase tracking-wider">Ringkasan AI</p>
                          <p className="mt-1 text-sm leading-relaxed text-white/50">{item.aiSummary}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* GRID VIEW */}
        {viewMode === "grid" && (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence>
              {filtered.map((item, idx) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  layout
                  className="group overflow-hidden rounded-[2rem] border border-white/5 bg-white/[0.02] transition-all hover:border-white/10"
                >
                  {/* Image */}
                  <div className="relative overflow-hidden">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.sampleName} className="h-48 w-full object-cover transition-transform group-hover:scale-105" />
                    ) : (
                      <div className="flex h-48 items-center justify-center bg-white/[0.02]">
                        <ImageIcon className="h-8 w-8 text-white/10" />
                      </div>
                    )}
                    <div className="absolute top-3 right-3 flex gap-2">
                      <div className={`rounded-md px-2 py-1 text-xs font-medium backdrop-blur-md ${
                        item.status === "Selesai" ? "bg-green-500/20 text-green-400" :
                        item.status === "Diproses" ? "bg-blue-500/20 text-blue-400" :
                        "bg-yellow-500/20 text-yellow-400"
                      }`}>
                        {item.status}
                      </div>
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex items-start justify-between">
                      <div className="min-w-0 flex-1">
                        <h3 className="text-lg font-bold text-white truncate">{item.sampleName}</h3>
                        <p className="mt-1 flex items-center gap-1 text-xs text-white/40">
                          <MapPin className="h-3 w-3" />
                          {item.location || "-"}
                        </p>
                      </div>
                      <ScoreRing score={item.score} size={44} strokeWidth={3} />
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="rounded-md bg-amber-500/10 px-2 py-1 text-xs font-medium text-amber-400">
                        {item.species}
                      </span>
                      <span className="rounded-md bg-orange-500/10 px-2 py-1 text-xs font-medium text-orange-400">
                        {item.roastLevel}
                      </span>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xs text-white/30">
                        {new Date(item.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                      <button
                        onClick={() => handleDelete(item._id, item.sampleName)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-500/10 text-red-400 transition-all hover:bg-red-500/20 opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
      <Footer />
    </main>
    </ProtectedRoute>
  );
}