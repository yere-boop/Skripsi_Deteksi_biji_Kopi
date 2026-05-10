"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { motion } from "framer-motion";
import { Coffee, Mail, Lock, Eye, EyeOff, LogIn, Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/Toast";
import FloatingBeans from "../components/FloatingBeans";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { toast } = useToast();
  const loginMutation = useMutation(api.users.login);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast("Email dan password wajib diisi", "warning");
      return;
    }

    setLoading(true);
    try {
      const result = await loginMutation({ email, password });
      if (result.success && result.user) {
        login(result.user);
        toast("Login berhasil! Selamat datang 🎉", "success");
        router.push("/dashboard");
      } else {
        toast(result.message, "error");
      }
    } catch (error) {
      console.error(error);
      toast("Terjadi kesalahan saat login", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0d0a08] text-[#f4efe6] flex items-center justify-center selection:bg-amber-700/50">
      {/* Floating Coffee Beans */}
      <FloatingBeans />

      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 h-[600px] w-[600px] rounded-full bg-amber-900/15 blur-[120px]" />
        <div className="absolute bottom-1/4 right-[-10%] h-[500px] w-[500px] rounded-full bg-orange-900/15 blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-md px-6">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10 text-center"
        >
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-600 to-amber-900 shadow-lg shadow-amber-900/50">
              <Coffee className="h-6 w-6 text-amber-50" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">
                Coffee Inspect<span className="text-amber-500">.AI</span>
              </h1>
            </div>
          </Link>
        </motion.div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <div className="relative overflow-hidden rounded-[2rem] border border-white/5 bg-white/[0.02] backdrop-blur-xl">
            {/* Glow */}
            <div className="absolute -top-20 left-1/2 h-40 w-60 -translate-x-1/2 rounded-full bg-amber-500/10 blur-3xl" />

            <div className="relative p-8 sm:p-10">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white">Masuk ke Akun</h2>
                <p className="mt-2 text-sm text-white/40">
                  Masukkan email dan password Anda
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-white/70">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="contoh@email.com"
                      className="w-full rounded-xl border border-white/10 bg-white/5 py-3.5 pl-11 pr-4 text-white placeholder-white/30 outline-none transition-all focus:border-amber-500/50 focus:bg-white/[0.07] focus:ring-1 focus:ring-amber-500/20"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-white/70">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Masukkan password"
                      className="w-full rounded-xl border border-white/10 bg-white/5 py-3.5 pl-11 pr-12 text-white placeholder-white/30 outline-none transition-all focus:border-amber-500/50 focus:bg-white/[0.07] focus:ring-1 focus:ring-amber-500/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 py-3.5 font-semibold text-white shadow-lg shadow-amber-500/25 transition-all hover:scale-[1.02] hover:shadow-amber-500/40 disabled:opacity-50 disabled:hover:scale-100"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    <>
                      <LogIn className="h-5 w-5" />
                      Masuk
                    </>
                  )}
                </button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-sm text-white/40">
                  Belum punya akun?{" "}
                  <Link
                    href="/register"
                    className="font-semibold text-amber-400 hover:text-amber-300 transition-colors"
                  >
                    Daftar Sekarang
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center text-xs text-white/20"
        >
          © {new Date().getFullYear()} Coffee Inspect AI. All rights reserved.
        </motion.p>
      </div>
    </main>
  );
}
