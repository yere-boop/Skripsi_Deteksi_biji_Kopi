"use client";

import { FormEvent, useState, DragEvent } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload, ScanFace, RotateCcw, Sparkles, ImageIcon, FlaskConical,
  CheckCircle2, Loader2, ArrowRight, Coffee, Flame, ShieldCheck,
  Sun, Droplets, Layers, AlertTriangle, Info, Eye
} from "lucide-react";
import Navbar from "../components/Navbar";
import ScoreRing from "../components/ScoreRing";
import ConfidenceBar from "../components/ConfidenceBar";
import { useToast } from "../components/Toast";
import ProtectedRoute from "../components/ProtectedRoute";
import Footer from "../components/Footer";

type GradeInfo = {
  grade: string;
  color: string;
  emoji: string;
  desc: string;
};

type Recommendation = {
  type: "success" | "warning" | "info";
  title: string;
  desc: string;
};

type ImageFeatures = {
  brightness: number;
  warmth: number;
  saturation: number;
  colorUniformity: number;
  edgeDensity: number;
};

type PredictResponse = {
  species: { label: string; confidence: number; probabilities?: Record<string, number> };
  roastLevel: { label: string; confidence: number; probabilities?: Record<string, number> };
  quality: { label: string; confidence: number; probabilities?: Record<string, number> };
  score: number;
  grade: GradeInfo;
  summary: string;
  recommendations: Recommendation[];
  imageFeatures: ImageFeatures;
  analyzedAt: string;
};

const STEPS = [
  { label: "Upload", icon: Upload },
  { label: "Analisis AI", icon: ScanFace },
  { label: "Simpan", icon: CheckCircle2 },
];

export default function InspeksiPage() {
  const router = useRouter();
  const createInspection = useMutation(api.inspections.create);
  const { toast } = useToast();

  const [sampleName, setSampleName] = useState("");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [saved, setSaved] = useState(false);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [dragOver, setDragOver] = useState(false);

  const [aiResult, setAiResult] = useState<PredictResponse | null>(null);

  const handleImageChange = (file: File | null) => {
    setImageFile(file);
    if (!file) { setPreviewUrl(""); return; }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      handleImageChange(file);
    } else {
      toast("Hanya file gambar yang diterima", "warning");
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!sampleName.trim()) { toast("Nama sampel wajib diisi", "warning"); return; }
    if (!imageFile) { toast("Silakan upload gambar kopi terlebih dahulu", "warning"); return; }

    setLoading(true);
    setCurrentStep(1);

    try {
      // Step 1: Upload
      const uploadFormData = new FormData();
      uploadFormData.append("file", imageFile);
      const uploadResponse = await fetch("/api/upload", { method: "POST", body: uploadFormData });
      if (!uploadResponse.ok) throw new Error("Gagal upload gambar");
      const uploadResult = await uploadResponse.json();
      const savedImageUrl = uploadResult.imageUrl as string;

      // Step 2: AI Analysis
      setCurrentStep(2);
      const aiFormData = new FormData();
      aiFormData.append("file", imageFile);
      
      const API_URL = process.env.NEXT_PUBLIC_AI_API_URL || "http://localhost:8000";
      const aiResponse = await fetch(`${API_URL}/predict`, { method: "POST", body: aiFormData });
      
      if (aiResponse.status === 422) {
        const errorData = await aiResponse.json();
        if (errorData.error === "not_coffee") {
          toast("⚠️ Gambar bukan biji kopi! Silakan upload gambar biji kopi yang valid.", "warning");
          setCurrentStep(0);
          setLoading(false);
          return;
        }
      }
      
      if (!aiResponse.ok) throw new Error("Gagal mengambil hasil AI");
      const result: PredictResponse = await aiResponse.json();
      setAiResult(result);

      // Step 3: Save
      setCurrentStep(3);
      await createInspection({
        sampleName,
        species: result.species.label,
        roastLevel: result.roastLevel.label,
        location, notes,
        defectLevel: result.quality.label,
        aiSummary: result.summary,
        imageUrl: savedImageUrl,
        score: result.score,
      });

      toast("Data inspeksi berhasil disimpan! 🎉", "success");
      setSaved(true);
    } catch (error) {
      console.error(error);
      toast("Terjadi kesalahan saat memproses inspeksi", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSampleName(""); setLocation(""); setNotes("");
    setImageFile(null); setPreviewUrl(""); setAiResult(null);
    setCurrentStep(0); setSaved(false);
  };

  return (
    <ProtectedRoute>
    <main className="min-h-screen bg-[#0d0a08] text-[#f4efe6] selection:bg-amber-700/50">
      <Navbar />

      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/3 -left-1/4 h-[600px] w-[600px] rounded-full bg-amber-900/10 blur-[120px]" />
        <div className="absolute bottom-1/4 right-[-10%] h-[500px] w-[500px] rounded-full bg-orange-900/10 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 pt-28 pb-20">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-4 py-2 text-sm font-medium text-amber-400">
            <FlaskConical className="h-4 w-4" />
            <span>Inspeksi Baru</span>
          </div>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-white md:text-5xl">
            Tambah Data Inspeksi
          </h1>
          <p className="mt-3 max-w-3xl text-lg text-white/50">
            Upload gambar biji kopi, lalu sistem AI akan menganalisis dan menyimpan hasilnya.
          </p>
        </motion.div>

        {/* Step Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-10 flex items-center gap-2"
        >
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            const isActive = loading && currentStep >= i + 1;
            const isDone = currentStep > i + 1 || (currentStep === 3 && i === 2);
            return (
              <div key={i} className="flex items-center gap-2">
                <div className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-500 ${
                  isDone ? "bg-green-500/10 text-green-400 border border-green-500/20" :
                  isActive ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                  "bg-white/[0.02] text-white/30 border border-white/5"
                }`}>
                  {isDone ? <CheckCircle2 className="h-4 w-4" /> :
                   isActive ? <Loader2 className="h-4 w-4 animate-spin" /> :
                   <Icon className="h-4 w-4" />}
                  <span className="hidden sm:inline">{step.label}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <ArrowRight className={`h-4 w-4 ${isActive || isDone ? "text-amber-500/50" : "text-white/10"}`} />
                )}
              </div>
            );
          })}
        </motion.div>

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            onSubmit={handleSubmit}
            className="rounded-[2rem] border border-white/5 bg-white/[0.02] p-8"
          >
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-white/70">Nama Sampel *</label>
                <input
                  type="text" value={sampleName}
                  onChange={(e) => setSampleName(e.target.value)}
                  placeholder="Contoh: Arabika Kintamani 04"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/30 outline-none transition-colors focus:border-amber-500/50 focus:bg-white/[0.07] focus:ring-1 focus:ring-amber-500/20"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-white/70">Lokasi</label>
                <input
                  type="text" value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Contoh: Kintamani"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/30 outline-none transition-colors focus:border-amber-500/50 focus:bg-white/[0.07] focus:ring-1 focus:ring-amber-500/20"
                />
              </div>

              {/* Drag & Drop Upload */}
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-white/70">Upload Gambar Kopi *</label>
                <label
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  className={`group relative flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-6 py-10 transition-all ${
                    dragOver
                      ? "border-amber-500 bg-amber-500/5 scale-[1.02]"
                      : previewUrl
                        ? "border-green-500/30 bg-green-500/5"
                        : "border-white/10 bg-white/[0.02] hover:border-amber-500/30 hover:bg-white/[0.04]"
                  }`}
                >
                  {previewUrl ? (
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-400" />
                      <span className="text-sm font-medium text-green-400">{imageFile?.name}</span>
                    </div>
                  ) : (
                    <>
                      <Upload className={`h-8 w-8 transition-colors ${dragOver ? "text-amber-400" : "text-white/30 group-hover:text-amber-400"}`} />
                      <div className="text-center">
                        <p className="text-sm font-medium text-white/50">
                          <span className="text-amber-400">Klik untuk upload</span> atau drag & drop
                        </p>
                        <p className="mt-1 text-xs text-white/30">PNG, JPG, WEBP (max 10MB)</p>
                      </div>
                    </>
                  )}
                  <input
                    type="file" accept="image/*"
                    onChange={(e) => handleImageChange(e.target.files?.[0] || null)}
                    className="absolute inset-0 cursor-pointer opacity-0"
                  />
                </label>
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-white/70">Catatan</label>
                <textarea
                  rows={4} value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Tambahkan catatan tentang sampel kopi..."
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/30 outline-none transition-colors focus:border-amber-500/50 focus:bg-white/[0.07] focus:ring-1 focus:ring-amber-500/20 resize-none"
                />
              </div>
            </div>

            <div className="mt-8 flex gap-4">
              <button
                type="submit" disabled={loading}
                className="flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 px-7 py-3.5 font-semibold text-white shadow-lg shadow-amber-500/25 transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
              >
                {loading ? (
                  <><Loader2 className="h-5 w-5 animate-spin" />Memproses...</>
                ) : (
                  <><ScanFace className="h-5 w-5" />Analisis &amp; Simpan</>
                )}
              </button>
              <button
                type="button" onClick={handleReset}
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 font-semibold text-white transition-all hover:bg-white/10"
              >
                <RotateCcw className="h-4 w-4" />Reset
              </button>
            </div>
          </motion.form>

          {/* Preview & Results */}
          <div className="space-y-6">
            {/* Image Preview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="rounded-[2rem] border border-white/5 bg-white/[0.02] p-8"
            >
              <div className="flex items-center gap-2 text-sm font-medium text-amber-400">
                <ImageIcon className="h-4 w-4" />Preview Gambar
              </div>
              <h3 className="mt-2 text-xl font-bold text-white">Sampel Kopi</h3>

              <div className="mt-6 flex h-64 items-center justify-center rounded-2xl border border-white/5 bg-[#0a0806] overflow-hidden">
                <AnimatePresence mode="wait">
                  {previewUrl ? (
                    <motion.img
                      key="preview"
                      src={previewUrl} alt="Preview kopi"
                      initial={{ opacity: 0, scale: 1.05 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.4 }}
                      className="h-full w-full rounded-2xl object-cover"
                    />
                  ) : (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center gap-3 text-white/20"
                    >
                      <ImageIcon className="h-10 w-10" />
                      <p className="px-6 text-center text-sm">Belum ada gambar. Upload untuk melihat preview.</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* AI Results */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="rounded-[2rem] border border-white/5 bg-white/[0.02] p-8"
            >
              <div className="flex items-center gap-2 text-sm font-medium text-amber-400">
                <Sparkles className="h-4 w-4" />Hasil AI
              </div>
              <h3 className="mt-2 text-xl font-bold text-white">Analisis Otomatis</h3>

              <AnimatePresence mode="wait">
                {!aiResult ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="mt-6 rounded-xl border border-white/5 bg-white/[0.02] p-5 text-sm text-white/40"
                  >
                    {loading ? (
                      <div className="flex flex-col items-center gap-4 py-6">
                        <div className="relative">
                          <div className="h-16 w-16 rounded-full border-4 border-white/5" />
                          <div className="absolute inset-0 h-16 w-16 animate-spin rounded-full border-4 border-transparent border-t-amber-500" />
                          <Coffee className="absolute inset-0 m-auto h-6 w-6 text-amber-400 animate-pulse" />
                        </div>
                        <div className="text-center">
                          <p className="font-medium text-white/60">AI sedang menganalisis...</p>
                          <p className="mt-1 text-xs text-white/30">Mengidentifikasi spesies, sangrai, dan kualitas</p>
                        </div>
                      </div>
                    ) : (
                      "Hasil AI akan muncul di sini setelah Anda klik tombol Analisis & Simpan."
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mt-6 space-y-6"
                  >
                    {/* Grade Badge */}
                    {aiResult.grade && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className={`flex items-center gap-3 rounded-2xl border p-4 ${
                          aiResult.grade.color === "green" ? "border-green-500/20 bg-green-500/5" :
                          aiResult.grade.color === "blue" ? "border-blue-500/20 bg-blue-500/5" :
                          aiResult.grade.color === "yellow" ? "border-yellow-500/20 bg-yellow-500/5" :
                          "border-red-500/20 bg-red-500/5"
                        }`}
                      >
                        <span className="text-3xl">{aiResult.grade.emoji}</span>
                        <div>
                          <p className="text-sm font-bold text-white">{aiResult.grade.grade}</p>
                          <p className="text-xs text-white/50">{aiResult.grade.desc}</p>
                        </div>
                      </motion.div>
                    )}

                    {/* Score Ring */}
                    <div className="flex justify-center">
                      <ScoreRing score={aiResult.score} size={140} strokeWidth={8} />
                    </div>

                    {/* Classification Results */}
                    <div className="space-y-4">
                      <p className="text-xs font-semibold text-white/30 uppercase tracking-wider">Klasifikasi</p>
                      {[
                        { icon: Coffee, label: "Spesies", value: aiResult.species.label, conf: aiResult.species.confidence, color: "#f59e0b" },
                        { icon: Flame, label: "Sangrai", value: aiResult.roastLevel.label, conf: aiResult.roastLevel.confidence, color: "#f97316" },
                        { icon: ShieldCheck, label: "Cacat Fisik", value: aiResult.quality.label, conf: aiResult.quality.confidence, color: "#22c55e" },
                      ].map((item, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + i * 0.1 }}
                          className="rounded-xl border border-white/5 bg-white/[0.02] p-4"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <item.icon className="h-4 w-4" style={{ color: item.color }} />
                            <span className="text-sm font-semibold text-white">{item.value}</span>
                            <span className="ml-auto text-xs font-bold" style={{ color: item.color }}>
                              {Math.round(item.conf * 100)}%
                            </span>
                          </div>
                          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${item.conf * 100}%` }}
                              transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                              className="h-full rounded-full"
                              style={{ background: item.color, boxShadow: `0 0 8px ${item.color}40` }}
                            />
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Image Features */}
                    {aiResult.imageFeatures && (
                      <div className="space-y-3">
                        <p className="text-xs font-semibold text-white/30 uppercase tracking-wider flex items-center gap-1.5">
                          <Eye className="h-3 w-3" />Analisis Visual
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { label: "Kecerahan", value: aiResult.imageFeatures.brightness, max: 255, icon: Sun, unit: "/255" },
                            { label: "Saturasi", value: aiResult.imageFeatures.saturation, max: 100, icon: Droplets, unit: "%" },
                            { label: "Keseragaman", value: aiResult.imageFeatures.colorUniformity, max: 100, icon: Layers, unit: "%" },
                            { label: "Tekstur", value: aiResult.imageFeatures.edgeDensity, max: 50, icon: Eye, unit: "" },
                          ].map((feat, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.6 + i * 0.08 }}
                              className="rounded-lg border border-white/5 bg-white/[0.02] p-3"
                            >
                              <div className="flex items-center gap-1.5 mb-1.5">
                                <feat.icon className="h-3 w-3 text-amber-500/70" />
                                <span className="text-[10px] text-white/40">{feat.label}</span>
                              </div>
                              <p className="text-sm font-bold text-white">
                                {feat.value.toFixed(1)}<span className="text-[10px] text-white/30">{feat.unit}</span>
                              </p>
                              <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-white/5">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${Math.min((feat.value / feat.max) * 100, 100)}%` }}
                                  transition={{ duration: 0.8, delay: 0.8 + i * 0.1 }}
                                  className="h-full rounded-full bg-gradient-to-r from-amber-500/60 to-amber-400"
                                />
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Recommendations */}
                    {aiResult.recommendations && aiResult.recommendations.length > 0 && (
                      <div className="space-y-3">
                        <p className="text-xs font-semibold text-white/30 uppercase tracking-wider">Rekomendasi</p>
                        {aiResult.recommendations.map((rec, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 + i * 0.1 }}
                            className={`rounded-xl border p-4 ${
                              rec.type === "success" ? "border-green-500/15 bg-green-500/5" :
                              rec.type === "warning" ? "border-amber-500/15 bg-amber-500/5" :
                              "border-blue-500/15 bg-blue-500/5"
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              {rec.type === "success" ? <CheckCircle2 className="h-4 w-4 mt-0.5 text-green-400 shrink-0" /> :
                               rec.type === "warning" ? <AlertTriangle className="h-4 w-4 mt-0.5 text-amber-400 shrink-0" /> :
                               <Info className="h-4 w-4 mt-0.5 text-blue-400 shrink-0" />}
                              <div>
                                <p className="text-sm font-semibold text-white">{rec.title}</p>
                                <p className="mt-1 text-xs leading-relaxed text-white/50">{rec.desc}</p>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}

                    {/* AI Summary */}
                    <div className="rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-600/10 border border-amber-500/10 p-5">
                      <p className="text-xs font-medium text-amber-400 uppercase tracking-wider">Ringkasan AI</p>
                      <p className="mt-2 text-sm leading-relaxed text-white/70 whitespace-pre-line">{aiResult.summary}</p>
                    </div>

                    {/* Action Buttons after save */}
                    {saved && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex gap-3 pt-2"
                      >
                        <button
                          onClick={() => router.push("/riwayat")}
                          className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 py-3 font-semibold text-white shadow-lg shadow-amber-500/25 transition-all hover:scale-[1.02]"
                        >
                          Lihat Riwayat
                          <ArrowRight className="h-4 w-4" />
                        </button>
                        <button
                          onClick={handleReset}
                          className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 font-semibold text-white transition-all hover:bg-white/10"
                        >
                          <RotateCcw className="h-4 w-4" />
                          Baru
                        </button>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
    </ProtectedRoute>
  );
}