"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft, Coffee, Flame, ShieldCheck, MapPin, FileText,
  Calendar, Download, Sparkles, ImageIcon, Printer
} from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ScoreRing from "../../components/ScoreRing";
import ProtectedRoute from "../../components/ProtectedRoute";

export default function DetailInspeksiPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const inspection = useQuery(api.inspections.getById, {
    id: id as Id<"inspections">,
  });

  const handleExportPDF = () => {
    if (!inspection) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const date = new Date(inspection.createdAt).toLocaleDateString("id-ID", {
      weekday: "long", day: "numeric", month: "long", year: "numeric",
    });
    const time = new Date(inspection.createdAt).toLocaleTimeString("id-ID", {
      hour: "2-digit", minute: "2-digit",
    });

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Laporan Inspeksi - ${inspection.sampleName}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Inter', sans-serif; color: #1a1a1a; padding: 40px; max-width: 800px; margin: 0 auto; }
          .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #d97706; padding-bottom: 20px; margin-bottom: 30px; }
          .logo { font-size: 24px; font-weight: 800; color: #92400e; }
          .logo span { color: #d97706; }
          .meta { text-align: right; font-size: 12px; color: #666; }
          .title { font-size: 28px; font-weight: 800; color: #1a1a1a; margin-bottom: 8px; }
          .subtitle { font-size: 14px; color: #666; margin-bottom: 30px; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 30px; }
          .card { background: #fef3c7; border: 1px solid #fde68a; border-radius: 12px; padding: 16px; }
          .card-label { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #92400e; font-weight: 600; }
          .card-value { font-size: 20px; font-weight: 700; margin-top: 4px; color: #1a1a1a; }
          .score-section { text-align: center; background: linear-gradient(135deg, #92400e, #d97706); color: white; border-radius: 16px; padding: 30px; margin-bottom: 30px; }
          .score-value { font-size: 64px; font-weight: 800; }
          .score-label { font-size: 14px; opacity: 0.8; margin-top: 4px; }
          .summary { background: #fffbeb; border: 1px solid #fde68a; border-radius: 12px; padding: 20px; margin-bottom: 30px; }
          .summary-title { font-size: 14px; font-weight: 700; color: #92400e; margin-bottom: 8px; }
          .summary-text { font-size: 14px; line-height: 1.8; color: #444; }
          .footer { border-top: 1px solid #e5e5e5; padding-top: 20px; margin-top: 40px; text-align: center; font-size: 11px; color: #999; }
          .info-row { display: flex; gap: 8px; align-items: center; font-size: 13px; color: #666; margin-bottom: 6px; }
          @media print { body { padding: 20px; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">Coffee Inspect<span>.AI</span></div>
          <div class="meta">
            <div>Laporan Inspeksi Kopi</div>
            <div>${date}</div>
            <div>${time} WIB</div>
          </div>
        </div>

        <div class="title">${inspection.sampleName}</div>
        <div class="info-row">📍 Lokasi: ${inspection.location || "Tidak tersedia"}</div>
        <div class="info-row">📋 Status: ${inspection.status}</div>
        <div class="subtitle" style="margin-top: 12px;">Catatan: ${inspection.notes || "Tidak ada catatan"}</div>

        <div class="score-section">
          <div class="score-value">${inspection.score}</div>
          <div class="score-label">Skor Mutu / 100</div>
        </div>

        <div class="grid">
          <div class="card">
            <div class="card-label">☕ Spesies Kopi</div>
            <div class="card-value">${inspection.species}</div>
          </div>
          <div class="card">
            <div class="card-label">🔥 Tingkat Sangrai</div>
            <div class="card-value">${inspection.roastLevel}</div>
          </div>
          <div class="card">
            <div class="card-label">🛡️ Cacat Fisik</div>
            <div class="card-value">${inspection.defectLevel || "-"}</div>
          </div>
          <div class="card">
            <div class="card-label">📊 Skor Akhir</div>
            <div class="card-value">${inspection.score}/100</div>
          </div>
        </div>

        ${inspection.aiSummary ? `
        <div class="summary">
          <div class="summary-title">🤖 Ringkasan Analisis AI</div>
          <div class="summary-text">${inspection.aiSummary}</div>
        </div>
        ` : ""}

        <div class="footer">
          <p>Dokumen ini dihasilkan secara otomatis oleh sistem Coffee Inspect AI</p>
          <p>© ${new Date().getFullYear()} Coffee Inspect AI — Sistem Inspeksi Kopi Berbasis Kecerdasan Buatan</p>
        </div>
      </body>
      </html>
    `);

    printWindow.document.close();
    setTimeout(() => printWindow.print(), 500);
  };

  return (
    <ProtectedRoute>
    <main className="min-h-screen bg-[#0d0a08] text-[#f4efe6] selection:bg-amber-700/50">
      <Navbar />

      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 h-[600px] w-[600px] rounded-full bg-amber-900/10 blur-[120px]" />
        <div className="absolute bottom-0 right-[-10%] h-[500px] w-[500px] rounded-full bg-orange-900/10 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-6 pt-28 pb-20">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => router.back()}
          className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white/60 transition-all hover:bg-white/10 hover:text-white mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali
        </motion.button>

        {/* Loading */}
        {inspection === undefined && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-amber-500" />
            <p className="mt-4 text-white/40">Memuat data inspeksi...</p>
          </div>
        )}

        {/* Not Found */}
        {inspection === null && (
          <div className="flex flex-col items-center justify-center py-20 rounded-[2rem] border border-white/5 bg-white/[0.02]">
            <Coffee className="h-12 w-12 text-white/15" />
            <p className="mt-4 text-lg font-medium text-white/40">Data inspeksi tidak ditemukan.</p>
            <button onClick={() => router.push("/riwayat")} className="mt-4 text-amber-400 hover:text-amber-300 text-sm">
              Kembali ke Riwayat
            </button>
          </div>
        )}

        {/* Content */}
        {inspection && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-4 py-2 text-sm font-medium text-amber-400">
                  <FileText className="h-4 w-4" />
                  <span>Detail Inspeksi</span>
                </div>
                <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-white md:text-4xl">
                  {inspection.sampleName}
                </h1>
                <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-white/40">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" />
                    {inspection.location || "Lokasi tidak tersedia"}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Date(inspection.createdAt).toLocaleDateString("id-ID", {
                      weekday: "long", day: "numeric", month: "long", year: "numeric",
                    })}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={handleExportPDF}
                  className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 font-semibold text-white transition-all hover:bg-white/10"
                >
                  <Printer className="h-4 w-4" />
                  Cetak Laporan
                </button>
                <button
                  onClick={handleExportPDF}
                  className="flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 px-5 py-3 font-semibold text-white shadow-lg shadow-amber-500/25 transition-all hover:scale-105"
                >
                  <Download className="h-4 w-4" />
                  Export PDF
                </button>
              </div>
            </div>

            <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_320px]">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Image */}
                <div className="overflow-hidden rounded-[2rem] border border-white/5 bg-white/[0.02] p-6">
                  <h3 className="flex items-center gap-2 text-sm font-medium text-amber-400">
                    <ImageIcon className="h-4 w-4" /> Gambar Sampel
                  </h3>
                  <div className="mt-4 overflow-hidden rounded-2xl border border-white/5 bg-[#0a0806]">
                    {inspection.imageUrl ? (
                      <img
                        src={inspection.imageUrl}
                        alt={inspection.sampleName}
                        className="h-80 w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-80 flex-col items-center justify-center gap-3 text-white/15">
                        <ImageIcon className="h-10 w-10" />
                        <p className="text-sm">Tidak ada gambar</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* AI Summary */}
                {inspection.aiSummary && (
                  <div className="rounded-[2rem] border border-white/5 bg-white/[0.02] p-6">
                    <h3 className="flex items-center gap-2 text-sm font-medium text-amber-400">
                      <Sparkles className="h-4 w-4" /> Ringkasan Analisis AI
                    </h3>
                    <div className="mt-4 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-600/10 border border-amber-500/10 p-5">
                      <p className="leading-relaxed text-white/70">{inspection.aiSummary}</p>
                    </div>
                  </div>
                )}

                {/* Notes */}
                {inspection.notes && (
                  <div className="rounded-[2rem] border border-white/5 bg-white/[0.02] p-6">
                    <h3 className="flex items-center gap-2 text-sm font-medium text-amber-400">
                      <FileText className="h-4 w-4" /> Catatan
                    </h3>
                    <p className="mt-4 leading-relaxed text-white/50">{inspection.notes}</p>
                  </div>
                )}
              </div>

              {/* Right Column - Score & Details */}
              <div className="space-y-6">
                {/* Score */}
                <div className="flex flex-col items-center rounded-[2rem] border border-white/5 bg-white/[0.02] p-8">
                  {/* Grade Badge */}
                  {inspection.score > 0 && (() => {
                    const s = inspection.score;
                    const grade = s >= 90 ? { emoji: "🏆", label: "Premium (Grade 1)", desc: "Kualitas premium, sangat layak ekspor", color: "green" }
                      : s >= 80 ? { emoji: "⭐", label: "Sangat Baik (Grade 2)", desc: "Memenuhi standar ekspor", color: "green" }
                      : s >= 70 ? { emoji: "✅", label: "Baik (Grade 3)", desc: "Layak pasar domestik premium", color: "blue" }
                      : s >= 60 ? { emoji: "⚠️", label: "Cukup (Grade 4)", desc: "Perlu perbaikan pasca panen", color: "yellow" }
                      : { emoji: "❌", label: "Kurang (Grade 5)", desc: "Perlu sortasi ulang", color: "red" };
                    return (
                      <div className={`mb-4 flex items-center gap-3 rounded-2xl border w-full p-4 ${
                        grade.color === "green" ? "border-green-500/20 bg-green-500/5" :
                        grade.color === "blue" ? "border-blue-500/20 bg-blue-500/5" :
                        grade.color === "yellow" ? "border-yellow-500/20 bg-yellow-500/5" :
                        "border-red-500/20 bg-red-500/5"
                      }`}>
                        <span className="text-2xl">{grade.emoji}</span>
                        <div>
                          <p className="text-sm font-bold text-white">{grade.label}</p>
                          <p className="text-[11px] text-white/50">{grade.desc}</p>
                        </div>
                      </div>
                    );
                  })()}
                  <p className="text-sm font-medium text-amber-400">Skor Mutu</p>
                  <div className="mt-4">
                    <ScoreRing score={inspection.score} size={160} strokeWidth={10} />
                  </div>
                  <div className={`mt-4 rounded-full px-4 py-1.5 text-sm font-medium ${
                    inspection.status === "Selesai"
                      ? "bg-green-500/10 text-green-400"
                      : inspection.status === "Diproses"
                        ? "bg-blue-500/10 text-blue-400"
                        : "bg-yellow-500/10 text-yellow-400"
                  }`}>
                    {inspection.status}
                  </div>
                </div>

                {/* Detail Cards */}
                <div className="space-y-3">
                  {[
                    { icon: Coffee, label: "Spesies Kopi", value: inspection.species, color: "text-amber-400" },
                    { icon: Flame, label: "Tingkat Sangrai", value: inspection.roastLevel, color: "text-orange-400" },
                    { icon: ShieldCheck, label: "Cacat Fisik", value: inspection.defectLevel || "-", color: "text-green-400" },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + i * 0.1 }}
                      className="flex items-center gap-4 rounded-2xl border border-white/5 bg-white/[0.02] p-5"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5">
                        <item.icon className={`h-5 w-5 ${item.color}`} />
                      </div>
                      <div>
                        <p className="text-xs text-white/40">{item.label}</p>
                        <p className="mt-0.5 font-semibold text-white">{item.value}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <Footer />
    </main>
    </ProtectedRoute>
  );
}
