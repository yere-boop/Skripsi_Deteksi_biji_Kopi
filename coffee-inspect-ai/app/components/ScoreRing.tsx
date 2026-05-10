"use client";

import { motion } from "framer-motion";

interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
}

export default function ScoreRing({ score, size = 120, strokeWidth = 8 }: ScoreRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;

  const getColor = (s: number) => {
    if (s >= 85) return { stroke: "#22c55e", glow: "rgba(34,197,94,0.3)", label: "Excellent" };
    if (s >= 70) return { stroke: "#f59e0b", glow: "rgba(245,158,11,0.3)", label: "Good" };
    if (s >= 50) return { stroke: "#f97316", glow: "rgba(249,115,22,0.3)", label: "Fair" };
    return { stroke: "#ef4444", glow: "rgba(239,68,68,0.3)", label: "Poor" };
  };

  const color = getColor(score);

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color.stroke}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - progress }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
          style={{ filter: `drop-shadow(0 0 8px ${color.glow})` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="font-bold text-white"
          style={{ fontSize: size * 0.18 }}
        >
          {score}
        </motion.span>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="font-medium text-white/40 uppercase tracking-wider"
          style={{ fontSize: Math.max(8, size * 0.07) }}
        >
          {color.label}
        </motion.span>
      </div>
    </div>
  );
}
