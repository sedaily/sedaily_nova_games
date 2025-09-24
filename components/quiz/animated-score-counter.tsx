"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

interface AnimatedScoreCounterProps {
  finalScore: number
  totalQuestions: number
  duration?: number
  onComplete?: () => void
}

export function AnimatedScoreCounter({
  finalScore,
  totalQuestions,
  duration = 2000,
  onComplete,
}: AnimatedScoreCounterProps) {
  const [currentScore, setCurrentScore] = useState(0)
  const [currentPercentage, setCurrentPercentage] = useState(0)

  useEffect(() => {
    const startTime = Date.now()
    const finalPercentage = Math.round((finalScore / totalQuestions) * 100)

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Easing function for smooth animation
      const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)
      const easedProgress = easeOutCubic(progress)

      setCurrentScore(Math.floor(easedProgress * finalScore))
      setCurrentPercentage(Math.floor(easedProgress * finalPercentage))

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setCurrentScore(finalScore)
        setCurrentPercentage(finalPercentage)
        onComplete?.()
      }
    }

    const timer = setTimeout(() => {
      animate()
    }, 500) // Delay before starting animation

    return () => clearTimeout(timer)
  }, [finalScore, totalQuestions, duration, onComplete])

  return (
    <div className="text-center space-y-6">
      {/* Score Counter */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-4"
      >
        <motion.div
          className="text-6xl md:text-8xl font-bold korean-text gradient-text-neon"
          animate={{
            scale: currentScore === finalScore ? [1, 1.1, 1] : 1,
          }}
          transition={{
            duration: 0.3,
            ease: "easeOut",
          }}
        >
          {currentScore}
          <span className="text-4xl md:text-5xl text-muted-foreground">/{totalQuestions}</span>
        </motion.div>

        <motion.div
          className="text-3xl md:text-4xl font-semibold korean-text"
          animate={{
            color:
              currentPercentage >= 80
                ? "#22C55E"
                : currentPercentage >= 60
                  ? "#9B8CFF"
                  : currentPercentage >= 40
                    ? "#F59E0B"
                    : "#EF4444",
          }}
          transition={{ duration: 0.3 }}
        >
          {currentPercentage}%
        </motion.div>
      </motion.div>

      {/* Animated Progress Ring */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.3, duration: 0.8, type: "spring", stiffness: 100 }}
        className="flex justify-center"
      >
        <div className="relative w-32 h-32">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="8"
              fill="none"
              className="drop-shadow-sm"
            />

            {/* Progress circle */}
            <motion.circle
              cx="50"
              cy="50"
              r="40"
              stroke="url(#scoreGradient)"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 40}`}
              initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
              animate={{
                strokeDashoffset: 2 * Math.PI * 40 * (1 - currentPercentage / 100),
              }}
              transition={{ duration: 2, ease: "easeOut" }}
              className="drop-shadow-lg"
              style={{
                filter: "drop-shadow(0 0 10px rgba(91, 124, 255, 0.5))",
              }}
            />

            {/* Gradient definition */}
            <defs>
              <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop
                  offset="0%"
                  stopColor={currentPercentage >= 80 ? "#22C55E" : currentPercentage >= 60 ? "#5B7CFF" : "#EF4444"}
                />
                <stop
                  offset="100%"
                  stopColor={currentPercentage >= 80 ? "#16A34A" : currentPercentage >= 60 ? "#9B8CFF" : "#DC2626"}
                />
              </linearGradient>
            </defs>
          </svg>

          {/* Center icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{
                rotate: [0, 360],
                scale: [1, 1.1, 1],
              }}
              transition={{
                rotate: { duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
                scale: { duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
              }}
              className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center"
            >
              <div className="w-4 h-4 bg-white rounded-full" />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
