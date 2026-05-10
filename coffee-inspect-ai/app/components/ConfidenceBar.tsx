"use client";

import { motion } from "framer-motion";

interface ConfidenceBarProps {
  label: string;
  value: number; // 0-1
  color?: string;
}

export default function ConfidenceBar({ label, value, color = "#f59e0b" }: ConfidenceBarProps) {
  const percentage = Math.round(value * 100);

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-white/60">{label}</span>
        <span className="text-sm font-bold text-white">{percentage}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-white/5">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
          className="h-full rounded-full"
          style={{
            background: `linear-gradient(90deg, ${color}, ${color}dd)`,
            boxShadow: `0 0 12px ${color}40`,
          }}
        />
      </div>
    </div>
  );
}
