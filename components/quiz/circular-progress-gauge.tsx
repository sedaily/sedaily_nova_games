"use client"
import { motion } from "framer-motion"
import { useScrollProgress } from "@/hooks/use-scroll-progress"

export function CircularProgressGauge() {
  const raw = useScrollProgress()              // 0~100 (현 상태)
  const p = raw > 1 ? raw / 100 : raw          // 0~1로 정규화

  const circumference = 2 * Math.PI * 45
  const strokeDasharray = circumference
  const strokeDashoffset = (1 - p) * circumference

  return (
    <div className="fixed top-6 right-6 z-50">
      <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5, ease: "easeOut" }} className="relative">
        <div className="w-24 h-24 rounded-full bg-background/20 backdrop-blur-xl border border-white/10 shadow-2xl flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 blur-sm" />
          <svg className="w-20 h-20 -rotate-90 relative z-10" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" stroke="rgba(255,255,255,.1)" strokeWidth="3" fill="none" className="drop-shadow-sm" />
            <motion.circle
              cx="50" cy="50" r="45"
              stroke="url(#progressGradient)" strokeWidth="3" fill="none" strokeLinecap="round"
              strokeDasharray={strokeDasharray}
              animate={{ strokeDashoffset }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="drop-shadow-lg"
              style={{ filter: "drop-shadow(0 0 8px rgba(91,124,255,.4))" }}
            />
            <defs>
              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#5B7CFF" />
                <stop offset="50%" stopColor="#9B8CFF" />
                <stop offset="100%" stopColor="#22C55E" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.span
              className="text-sm font-bold korean-text text-foreground"
              animate={{ scale: p > 0.05 ? 1 : 0.8, opacity: p > 0.05 ? 1 : 0.6 }}
              transition={{ duration: 0.2 }}
            >
              {Math.round(p * 100)}%
            </motion.span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
