"use client";

import { useState, useEffect } from "react";
import { Clock, CalendarDays } from "lucide-react";

export default function LiveClock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!now) return null;

  const dayNames = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const monthNames = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember",
  ];

  const dayName = dayNames[now.getDay()];
  const day = now.getDate();
  const month = monthNames[now.getMonth()];
  const year = now.getFullYear();

  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const seconds = now.getSeconds().toString().padStart(2, "0");

  return (
    <div className="hidden lg:flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.03] px-4 py-2 backdrop-blur-sm">
      <div className="flex items-center gap-2 text-white/50">
        <CalendarDays className="h-3.5 w-3.5 text-amber-500/70" />
        <span className="text-xs font-medium">
          {dayName}, {day} {month} {year}
        </span>
      </div>
      <div className="h-4 w-[1px] bg-white/10" />
      <div className="flex items-center gap-2 text-white/50">
        <Clock className="h-3.5 w-3.5 text-amber-500/70" />
        <span className="text-xs font-mono font-semibold tracking-wider text-amber-400/80">
          {hours}
          <span className="animate-pulse">:</span>
          {minutes}
          <span className="animate-pulse">:</span>
          {seconds}
        </span>
      </div>
    </div>
  );
}
