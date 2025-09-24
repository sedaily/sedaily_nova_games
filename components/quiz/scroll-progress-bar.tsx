"use client"

import { motion } from "framer-motion"
import { useScrollProgress } from "@/hooks/use-scroll-progress"

export function ScrollProgressBar() {
  const scrollProgress = useScrollProgress()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 h-2 bg-background/30 backdrop-blur-md border-b border-border/20"
    >
      <motion.div
        className="h-full bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_100%] shadow-lg shadow-primary/20"
        style={{ width: `${scrollProgress}%` }}
        animate={{
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        }}
        transition={{
          backgroundPosition: {
            duration: 4,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          },
        }}
      />

      <motion.div
        className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary/50 to-accent/50 blur-sm"
        style={{ width: `${scrollProgress}%` }}
        animate={{
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
    </motion.div>
  )
}
