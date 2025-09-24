"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Zap, Brain, Sparkles } from "lucide-react"
import { AccessibleMotionWrapper } from "./accessible-motion-wrapper"
import { useDevicePerformance } from "@/hooks/use-device-performance"

interface FuturisticIntroScreenProps {
  onComplete: () => void
}

export function FuturisticIntroScreen({ onComplete }: FuturisticIntroScreenProps) {
  const [currentPhase, setCurrentPhase] = useState(0)
  const [glitchText, setGlitchText] = useState("AI 퀴즈")
  const { motionLevel } = useDevicePerformance()

  const glitchChars = "!@#$%^&*()_+-=[]{}|;:,.<>?"
  const originalText = "AI 퀴즈"

  // Reduce particle count for low-end devices
  const particleCount = motionLevel === "full" ? 50 : motionLevel === "reduced" ? 20 : 0

  useEffect(() => {
    // Faster transitions for reduced motion
    const phaseDurations = motionLevel === "none" ? [500, 500, 500, 500] : [1000, 1500, 1200, 800]

    const phaseTimer = setTimeout(() => {
      if (currentPhase < 3) {
        setCurrentPhase(currentPhase + 1)
      } else {
        setTimeout(onComplete, motionLevel === "none" ? 200 : 800)
      }
    }, phaseDurations[currentPhase])

    return () => clearTimeout(phaseTimer)
  }, [currentPhase, onComplete, motionLevel])

  useEffect(() => {
    // Skip glitch effect for reduced motion
    if (currentPhase === 1 && motionLevel === "full") {
      const glitchInterval = setInterval(() => {
        const glitched = originalText
          .split("")
          .map((char, index) => {
            if (Math.random() < 0.3) {
              return glitchChars[Math.floor(Math.random() * glitchChars.length)]
            }
            return char
          })
          .join("")
        setGlitchText(glitched)

        setTimeout(() => setGlitchText(originalText), 100)
      }, 200)

      const clearGlitch = setTimeout(() => {
        clearInterval(glitchInterval)
        setGlitchText(originalText)
      }, 1200)

      return () => {
        clearInterval(glitchInterval)
        clearTimeout(clearGlitch)
      }
    }
  }, [currentPhase, motionLevel])

  // Static fallback for no motion
  if (motionLevel === "none") {
    return (
      <div className="fixed inset-0 z-50 bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-32 h-32 mx-auto mb-8 relative">
            <div className="w-full h-full bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
              <Brain className="w-16 h-16 text-white" />
            </div>
          </div>
          <h1 className="text-8xl md:text-9xl font-bold korean-text bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent mb-8">
            AI 퀴즈
          </h1>
          <p className="text-2xl md:text-3xl korean-text text-muted-foreground mb-12">미래형 학습 플랫폼</p>
          <p className="text-lg korean-text text-muted-foreground">시스템 초기화 중...</p>
        </div>
      </div>
    )
  }

  return (
    <AnimatePresence>
      <AccessibleMotionWrapper
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, scale: motionLevel === "reduced" ? 1 : 1.1 }}
        transition={{ duration: motionLevel === "reduced" ? 0.4 : 0.8, ease: "easeInOut" }}
        reducedMotionVariant={{
          initial: { opacity: 1 },
          exit: { opacity: 0 },
          transition: { duration: 0.4 },
        }}
        className="fixed inset-0 z-50 bg-background flex items-center justify-center overflow-hidden"
      >
        {/* Reduced particle count for performance */}
        {[...Array(particleCount)].map((_, i) => (
          <AccessibleMotionWrapper
            key={i}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 4 + 2,
              height: Math.random() * 4 + 2,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: i % 3 === 0 ? "#5B7CFF" : i % 3 === 1 ? "#9B8CFF" : "#22C55E",
            }}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 0.6, 0],
              x: [0, Math.random() * 200 - 100],
              y: [0, Math.random() * 200 - 100],
            }}
            transition={{
              duration: motionLevel === "reduced" ? 2 : 3 + Math.random() * 2,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 2,
              ease: "easeOut",
            }}
            reducedMotionVariant={{
              animate: {
                opacity: [0.3, 0.6, 0.3],
              },
              transition: {
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              },
            }}
          />
        ))}

        {/* Simplified grid for reduced motion */}
        <div className="absolute inset-0 opacity-20">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `
                linear-gradient(rgba(91, 124, 255, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(91, 124, 255, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        <div className="relative z-10 text-center">
          {/* Phase 0: Logo appearance */}
          <AnimatePresence>
            {currentPhase >= 0 && (
              <AccessibleMotionWrapper
                initial={{ scale: 0, rotate: motionLevel === "reduced" ? 0 : -180, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{
                  type: motionLevel === "reduced" ? "tween" : "spring",
                  stiffness: 200,
                  damping: 20,
                  duration: motionLevel === "reduced" ? 0.5 : 1,
                }}
                reducedMotionVariant={{
                  initial: { opacity: 0 },
                  animate: { opacity: 1 },
                  transition: { duration: 0.3 },
                }}
                className="mb-12"
              >
                <div className="relative">
                  <AccessibleMotionWrapper
                    animate={
                      motionLevel === "full"
                        ? {
                            rotate: [0, 360],
                            scale: [1, 1.1, 1],
                          }
                        : motionLevel === "reduced"
                          ? {
                              scale: [1, 1.05, 1],
                            }
                          : {}
                    }
                    transition={
                      motionLevel === "full"
                        ? {
                            rotate: { duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
                            scale: { duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
                          }
                        : {
                            duration: 3,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "easeInOut",
                          }
                    }
                    className="w-32 h-32 mx-auto mb-8 relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-full blur-xl opacity-50" />
                    <div className="relative w-full h-full bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
                      <Brain className="w-16 h-16 text-white" />
                    </div>
                  </AccessibleMotionWrapper>

                  {/* Simplified orbital elements for reduced motion */}
                  {motionLevel === "full" &&
                    [...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute top-1/2 left-1/2 w-2 h-2 bg-accent rounded-full"
                        style={{
                          transformOrigin: `${40 + i * 20}px 0px`,
                        }}
                        animate={{
                          rotate: [0, 360],
                        }}
                        transition={{
                          duration: 3 + i,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "linear",
                        }}
                      />
                    ))}
                </div>
              </AccessibleMotionWrapper>
            )}
          </AnimatePresence>

          {/* Phase 1: Text with conditional glitch */}
          <AnimatePresence>
            {currentPhase >= 1 && (
              <AccessibleMotionWrapper
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: motionLevel === "reduced" ? 0.3 : 0.6 }}
                className="mb-8"
              >
                <motion.h1
                  className="text-8xl md:text-9xl font-bold korean-text bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent"
                  style={{
                    filter:
                      motionLevel === "full" && currentPhase === 1 && glitchText !== originalText
                        ? "blur(1px)"
                        : "none",
                    textShadow:
                      motionLevel === "full" && currentPhase === 1 && glitchText !== originalText
                        ? "0 0 10px rgba(91, 124, 255, 0.5)"
                        : "none",
                  }}
                >
                  {glitchText}
                </motion.h1>
              </AccessibleMotionWrapper>
            )}
          </AnimatePresence>

          {/* Phase 2: Subtitle */}
          <AnimatePresence>
            {currentPhase >= 2 && (
              <AccessibleMotionWrapper
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.2 }}
                transition={{ duration: motionLevel === "reduced" ? 0.4 : 0.8, ease: "easeOut" }}
                className="mb-12"
              >
                <AccessibleMotionWrapper
                  className="text-2xl md:text-3xl korean-text text-muted-foreground"
                  animate={
                    motionLevel === "full"
                      ? {
                          textShadow: [
                            "0 0 5px rgba(91, 124, 255, 0.3)",
                            "0 0 20px rgba(91, 124, 255, 0.6)",
                            "0 0 5px rgba(91, 124, 255, 0.3)",
                          ],
                        }
                      : {}
                  }
                  transition={
                    motionLevel === "full"
                      ? {
                          duration: 2,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "easeInOut",
                        }
                      : {}
                  }
                >
                  미래형 학습 플랫폼
                </AccessibleMotionWrapper>
              </AccessibleMotionWrapper>
            )}
          </AnimatePresence>

          {/* Phase 3: Loading elements */}
          <AnimatePresence>
            {currentPhase >= 3 && (
              <AccessibleMotionWrapper
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: motionLevel === "reduced" ? 0.3 : 0.6 }}
                className="space-y-6"
              >
                {/* Loading bar */}
                <div className="w-64 h-2 mx-auto bg-muted rounded-full overflow-hidden">
                  <AccessibleMotionWrapper
                    className="h-full bg-gradient-to-r from-primary to-accent"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: motionLevel === "reduced" ? 0.4 : 0.8, ease: "easeOut" }}
                  />
                </div>

                {/* Loading text */}
                <AccessibleMotionWrapper
                  className="text-lg korean-text text-muted-foreground"
                  animate={
                    motionLevel !== "none"
                      ? {
                          opacity: [0.5, 1, 0.5],
                        }
                      : {}
                  }
                  transition={
                    motionLevel !== "none"
                      ? {
                          duration: 1.5,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "easeInOut",
                        }
                      : {}
                  }
                >
                  시스템 초기화 중...
                </AccessibleMotionWrapper>

                {/* Floating icons - simplified for reduced motion */}
                <div className="flex justify-center space-x-8">
                  {[Zap, Sparkles, Brain].map((Icon, i) => (
                    <AccessibleMotionWrapper
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.2, duration: 0.5 }}
                    >
                      <AccessibleMotionWrapper
                        animate={
                          motionLevel === "full"
                            ? {
                                y: [0, -10, 0],
                                rotate: [0, 5, -5, 0],
                              }
                            : motionLevel === "reduced"
                              ? {
                                  y: [0, -5, 0],
                                }
                              : {}
                        }
                        transition={
                          motionLevel !== "none"
                            ? {
                                duration: 2 + i * 0.5,
                                repeat: Number.POSITIVE_INFINITY,
                                ease: "easeInOut",
                              }
                            : {}
                        }
                      >
                        <Icon className="w-8 h-8 text-primary" />
                      </AccessibleMotionWrapper>
                    </AccessibleMotionWrapper>
                  ))}
                </div>
              </AccessibleMotionWrapper>
            )}
          </AnimatePresence>
        </div>

        {/* Cinematic vignette - simplified for performance */}
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-background/50 pointer-events-none" />
      </AccessibleMotionWrapper>
    </AnimatePresence>
  )
}
