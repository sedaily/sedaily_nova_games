"use client"

import { useScrollProgress } from "@/hooks/use-scroll-progress"
import { motion } from "framer-motion"
import { CircularProgressGauge } from "./circular-progress-gauge"

export function EnhancedScrollProgressBar() {
  const progress = useScrollProgress()

  return (
    <>
      {/* Linear progress bar with glassmorphism */}
      <div className="fixed top-0 left-0 right-0 h-1 z-40">
        <div className="w-full h-full bg-background/20 backdrop-blur-sm border-b border-white/5">
          <motion.div
            className="h-full bg-gradient-to-r from-primary via-accent to-success relative overflow-hidden"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: progress }}
            transition={{ duration: 0.1, ease: "easeOut" }}
            style={{ transformOrigin: "left" }}
          >
            {/* Animated shimmer effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              animate={{
                x: ["-100%", "100%"],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
              style={{ width: "50%" }}
            />

            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-success blur-sm opacity-50" />
          </motion.div>
        </div>
      </div>

      {/* Circular progress gauge */}
      <CircularProgressGauge />
    </>
  )
}
