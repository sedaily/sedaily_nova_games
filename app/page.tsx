"use client"

import { useState, useEffect } from "react"
import { ScrollQuestionSection } from "@/components/quiz/scroll-question-section"
import { EnhancedScrollProgressBar } from "@/components/quiz/enhanced-scroll-progress-bar"
import { EnhancedIntroSection } from "@/components/quiz/enhanced-intro-section"
import { FuturisticIntroScreen } from "@/components/quiz/futuristic-intro-screen"
import { AnimatedScoreCounter } from "@/components/quiz/animated-score-counter"
import { RankingBadge } from "@/components/quiz/ranking-badge"
import { sampleQuizData, getQuizProgress, saveQuizProgress } from "@/lib/quiz-data"
import type { AnswerMap } from "@/types/quiz"
import { motion, AnimatePresence } from "framer-motion"
import { Trophy, RotateCcw, Home, Sparkles } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function EnhancedScrollQuizPage() {
  const [answeredMap, setAnsweredMap] = useState<AnswerMap>({})
  const [isLoading, setIsLoading] = useState(true)
  const [showIntro, setShowIntro] = useState(true)
  const [showFuturisticIntro, setShowFuturisticIntro] = useState(true)
  const [showScoreAnimation, setShowScoreAnimation] = useState(false)
  const [showRanking, setShowRanking] = useState(false)

  useEffect(() => {
    const savedProgress = getQuizProgress()
    setAnsweredMap(savedProgress)
    setIsLoading(false)

    if (Object.keys(savedProgress).length > 0) {
      setShowIntro(false)
      setShowFuturisticIntro(false)
    }
  }, [])

  useEffect(() => {
    if (!isLoading) {
      const timeoutId = setTimeout(() => {
        saveQuizProgress(answeredMap)
      }, 100)
      return () => clearTimeout(timeoutId)
    }
  }, [answeredMap, isLoading])

  const handleAnswered = (id: number, isCorrect: boolean, selectedAnswer: string) => {
    setAnsweredMap((prev) => ({
      ...prev,
      [id]: {
        selected: selectedAnswer,
        correct: isCorrect,
      },
    }))
  }

  const scrollToFirstQuestion = () => {
    setShowIntro(false)
    setTimeout(() => {
      const firstSection = document.querySelector("section[data-question]")
      if (firstSection) {
        firstSection.scrollIntoView({ behavior: "smooth" })
      }
    }, 100)
  }

  const handleFuturisticIntroComplete = () => {
    setShowFuturisticIntro(false)
  }

  const handleScoreAnimationComplete = () => {
    setShowRanking(true)
  }

  const answeredCount = Object.keys(answeredMap).length
  const correctCount = Object.values(answeredMap).filter((a) => a.correct).length
  const isCompleted = answeredCount === sampleQuizData.length
  const percentage = Math.round((correctCount / sampleQuizData.length) * 100)

  // Trigger score animation when quiz is completed
  useEffect(() => {
    if (isCompleted && !showScoreAnimation) {
      const timer = setTimeout(() => {
        setShowScoreAnimation(true)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [isCompleted, showScoreAnimation])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-8"
        >
          <motion.div
            className="w-24 h-24 border-4 border-primary/30 border-t-primary rounded-full mx-auto"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          />
          <motion.p
            className="korean-text text-muted-foreground text-2xl font-medium"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          >
            AI 퀴즈를 불러오는 중...
          </motion.p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {showFuturisticIntro && <FuturisticIntroScreen onComplete={handleFuturisticIntroComplete} />}

      <EnhancedScrollProgressBar />

      {showIntro && !showFuturisticIntro && (
        <EnhancedIntroSection
          onStart={scrollToFirstQuestion}
          answeredCount={answeredCount}
          correctCount={correctCount}
          totalQuestions={sampleQuizData.length}
        />
      )}

      <div className="relative">
        {sampleQuizData.map((item, index) => (
          <div key={item.id} data-question={item.id} className="mb-16">
            <ScrollQuestionSection
              item={item}
              index={index}
              onAnswered={handleAnswered}
              initialAnswer={answeredMap[item.id]}
            />
          </div>
        ))}

        {isCompleted && (
          <section className="min-h-screen flex items-center justify-center relative overflow-hidden particle-container">
            <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/8 to-accent/8" />

            {/* Enhanced particle effects */}
            {[...Array(50)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: Math.random() * 8 + 4,
                  height: Math.random() * 8 + 4,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  background: i % 4 === 0 ? "#5B7CFF" : i % 4 === 1 ? "#9B8CFF" : i % 4 === 2 ? "#22C55E" : "#FFD700",
                }}
                animate={{
                  scale: [0, 1.5, 0],
                  opacity: [0, 0.8, 0],
                  y: [0, -150, -300],
                  x: [0, Math.random() * 100 - 50, Math.random() * 200 - 100],
                }}
                transition={{
                  duration: 4 + Math.random() * 2,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: Math.random() * 3,
                  ease: "easeOut",
                }}
              />
            ))}

            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 60 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
              viewport={{ once: true }}
              className="w-full max-w-6xl mx-auto px-4 relative z-10"
            >
              <Card className="glassmorphism-card rounded-3xl overflow-hidden neon-glow-primary">
                <CardContent className="p-12 md:p-20 text-center space-y-16">
                  {/* Completion Header */}
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    transition={{
                      delay: 0.3,
                      type: "spring",
                      stiffness: 200,
                      duration: 1,
                    }}
                    viewport={{ once: true }}
                    className="relative"
                  >
                    <motion.div
                      animate={{
                        rotate: [0, 360],
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        rotate: { duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
                        scale: { duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
                      }}
                    >
                      <Trophy className="w-32 h-32 md:w-40 md:h-40 text-primary mx-auto mb-8 neon-glow-primary" />
                    </motion.div>

                    {/* Sparkle effects around trophy */}
                    {[...Array(8)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute"
                        style={{
                          left: "50%",
                          top: "50%",
                          transformOrigin: `${60 + Math.random() * 40}px 0px`,
                        }}
                        animate={{
                          rotate: [0, 360],
                          scale: [0, 1, 0],
                          opacity: [0, 1, 0],
                        }}
                        transition={{
                          duration: 2 + i * 0.3,
                          repeat: Number.POSITIVE_INFINITY,
                          delay: i * 0.2,
                          ease: "easeOut",
                        }}
                      >
                        <Sparkles className="w-6 h-6 text-accent" />
                      </motion.div>
                    ))}
                  </motion.div>

                  {/* Title */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    viewport={{ once: true }}
                    className="space-y-6"
                  >
                    <h2 className="text-5xl md:text-7xl font-bold korean-text gradient-text-neon text-balance">
                      퀴즈 완료!
                    </h2>
                    <p className="text-2xl md:text-3xl korean-text text-muted-foreground leading-relaxed text-balance">
                      총 <span className="text-primary font-bold">{sampleQuizData.length}</span>문제에 도전하셨습니다.
                    </p>
                  </motion.div>

                  {/* Animated Score Counter */}
                  <AnimatePresence>
                    {showScoreAnimation && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.5 }}
                      >
                        <AnimatedScoreCounter
                          finalScore={correctCount}
                          totalQuestions={sampleQuizData.length}
                          onComplete={handleScoreAnimationComplete}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Ranking Badge */}
                  <AnimatePresence>
                    {showRanking && (
                      <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                      >
                        <RankingBadge percentage={percentage} delay={0.2} />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Action Buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2, duration: 0.8 }}
                    viewport={{ once: true }}
                    className="flex gap-6 justify-center flex-wrap pt-8"
                  >
                    <Button
                      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                      variant="outline"
                      size="lg"
                      className="korean-text px-8 py-4 rounded-full text-lg border-2 hover:scale-105 transition-all duration-300 font-semibold glassmorphism"
                    >
                      <Home className="w-5 h-5 mr-3" />
                      처음으로 돌아가기
                    </Button>
                    <Button
                      onClick={() => {
                        localStorage.removeItem("quiz-progress-v1")
                        window.location.reload()
                      }}
                      variant="neon"
                      size="lg"
                      className="korean-text px-8 py-4 rounded-full text-lg hover:scale-105 transition-all duration-300 font-semibold"
                    >
                      <RotateCcw className="w-5 h-5 mr-3" />
                      다시 도전하기
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </section>
        )}
      </div>
    </div>
  )
}
