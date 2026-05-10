"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Coffee } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0d0a08]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-amber-600 to-amber-900 shadow-lg shadow-amber-900/50">
            <Coffee className="h-7 w-7 text-amber-50 animate-pulse" />
          </div>
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-amber-500" />
          <p className="text-sm text-white/40">Memuat...</p>
        </motion.div>
      </main>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
