"use client"

import { cn } from "@/lib/utils"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { EnhancedOptionButton } from "./enhanced-option-button"
import { EnhancedNewsLinkCard } from "./enhanced-news-link-card"
import type { QuizItem } from "@/types/quiz"
import { grade } from "@/lib/quiz-data"
import { motion } from "framer-motion"
import { useIntersectionObserver } from "@/hooks/use-intersection-observer"

interface ScrollQuestionSectionProps {
  item: QuizItem
  index: number
  onAnswered: (id: number, isCorrect: boolean, selectedAnswer: string) => void
  initialAnswer?: { selected: string; correct: boolean }
}

export function ScrollQuestionSection({ item, index, onAnswered, initialAnswer }: ScrollQuestionSectionProps) {
  const [selected, setSelected] = useState<string | null>(initialAnswer?.selected || null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(initialAnswer?.correct ?? null)
  const [revealed, setRevealed] = useState(!!initialAnswer)

  const { elementRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.6,
    rootMargin: "-10% 0px -10% 0px",
  })

  const handleOptionClick = (option: string) => {
    if (selected) return // Already answered

    const correct = grade(option, item.answer)
    setSelected(option)
    setIsCorrect(correct)
    setRevealed(true)
    onAnswered(item.id, correct, option)
  }

  const getOptionState = (option: string) => {
    if (!selected) return "default"
    if (option === selected) {
      return isCorrect ? "correct" : "wrong"
    }
    if (option === item.answer && !isCorrect) {
      return "correct" // Show correct answer when user was wrong
    }
    return "disabled"
  }

  return (
    <section
      ref={elementRef}
      className="min-h-screen flex items-center justify-center py-32 px-4 relative section-border-gradient particle-container"
    >
      <div className="section-gradient-overlay" />

      <motion.div
        initial={{ opacity: 0, y: 80, scale: 0.9, rotateY: -15 }}
        animate={
          isIntersecting
            ? { opacity: 1, y: 0, scale: 1, rotateY: 0 }
            : { opacity: 0.4, y: 30, scale: 0.95, rotateY: -8 }
        }
        transition={{
          duration: 1.4,
          ease: [0.25, 0.46, 0.45, 0.94],
          opacity: { duration: 1.2 },
          scale: { duration: 1.4 },
          y: { duration: 1.3 },
          rotateY: { duration: 1.5, ease: "easeOut" },
        }}
        style={{
          perspective: "1000px",
          transformStyle: "preserve-3d",
        }}
        className="w-full max-w-4xl mx-auto sticky top-20 z-10"
      >
        <motion.div
          animate={revealed ? { rotateY: [0, 5, 0] } : {}}
          transition={{
            duration: 0.8,
            ease: "easeOut",
          }}
          style={{
            transformStyle: "preserve-3d",
          }}
        >
          <Card className="glassmorphism-card shadow-2xl overflow-hidden rounded-2xl neon-glow-primary">
            <CardHeader className="pb-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-radial from-primary/10 to-transparent blur-3xl" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-radial from-accent/8 to-transparent blur-2xl" />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <Badge
                    variant="secondary"
                    className="korean-text text-base px-6 py-3 bg-primary/20 text-primary border-primary/40 rounded-full font-semibold neon-glow-primary"
                  >
                    문제 {index + 1}
                  </Badge>
                  {revealed && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                      animate={{ opacity: 1, scale: 1, rotate: 0 }}
                      transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                    >
                      <Badge
                        variant={isCorrect ? "default" : "destructive"}
                        className={cn(
                          "korean-text px-6 py-3 text-base font-semibold rounded-full",
                          isCorrect ? "neon-glow-success" : "neon-glow-danger",
                        )}
                      >
                        {isCorrect ? "정답" : "오답"}
                      </Badge>
                    </motion.div>
                  )}
                </div>

                <motion.h2
                  className="text-3xl md:text-4xl font-bold leading-relaxed korean-text text-balance mb-2 gradient-text-neon"
                  initial={{ opacity: 0, y: 30 }}
                  animate={isIntersecting ? { opacity: 1, y: 0 } : { opacity: 0.8, y: 15 }}
                  transition={{ delay: 0.3, duration: 1.0 }}
                >
                  {item.question}
                </motion.h2>

                {item.passage && (
                  <motion.div
                    className="mt-8 p-8 glassmorphism rounded-2xl border border-white/10 backdrop-blur-sm"
                    initial={{ opacity: 0, y: 30 }}
                    animate={isIntersecting ? { opacity: 1, y: 0 } : { opacity: 0.8, y: 15 }}
                    transition={{ delay: 0.5, duration: 1.0 }}
                  >
                    <p className="text-base leading-relaxed korean-text text-muted-foreground">{item.passage}</p>
                  </motion.div>
                )}
              </div>
            </CardHeader>

            <CardContent className="pt-8 pb-10">
              <motion.div
                className="space-y-5"
                role="radiogroup"
                aria-labelledby={`question-${item.id}`}
                aria-describedby={revealed ? `explanation-${item.id}` : undefined}
              >
                {item.options.map((option, optionIndex) => (
                  <EnhancedOptionButton
                    key={optionIndex}
                    label={option}
                    selected={selected === option}
                    state={getOptionState(option)}
                    onClick={() => handleOptionClick(option)}
                    disabled={!!selected}
                    index={optionIndex}
                  />
                ))}
              </motion.div>

              {revealed && <EnhancedNewsLinkCard link={item.newsLink} explanation={item.explanation} />}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-radial from-primary/8 via-primary/4 to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-gradient-radial from-accent/8 via-accent/4 to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.6, 0.3, 0.6],
          }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      </div>
    </section>
  )
}
