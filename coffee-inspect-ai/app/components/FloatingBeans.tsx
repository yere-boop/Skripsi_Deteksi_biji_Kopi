"use client";

import { motion } from "framer-motion";

const beans = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  size: 8 + Math.random() * 16,
  x: Math.random() * 100,
  delay: Math.random() * 8,
  duration: 12 + Math.random() * 10,
  opacity: 0.03 + Math.random() * 0.06,
  rotate: Math.random() * 360,
}));

export default function FloatingBeans() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {beans.map((bean) => (
        <motion.div
          key={bean.id}
          className="absolute rounded-full"
          style={{
            width: bean.size,
            height: bean.size * 1.4,
            left: `${bean.x}%`,
            background: `radial-gradient(ellipse, rgba(180, 120, 60, ${bean.opacity * 2}) 0%, rgba(120, 70, 30, ${bean.opacity}) 100%)`,
            borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
            rotate: `${bean.rotate}deg`,
          }}
          animate={{
            y: ["-10vh", "110vh"],
            rotate: [bean.rotate, bean.rotate + 180],
            opacity: [0, bean.opacity, bean.opacity, 0],
          }}
          transition={{
            duration: bean.duration,
            delay: bean.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}

      {/* Floating glow orbs */}
      <motion.div
        className="absolute top-1/3 left-1/4 h-[300px] w-[300px] rounded-full bg-amber-800/5 blur-[80px]"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 h-[250px] w-[250px] rounded-full bg-orange-800/5 blur-[80px]"
        animate={{ 
          scale: [1.2, 1, 1.2],
          opacity: [0.4, 0.2, 0.4],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
