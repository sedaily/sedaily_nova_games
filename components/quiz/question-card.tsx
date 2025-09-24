"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { OptionButton } from "./option-button"
import { NewsLinkCard } from "./news-link-card"
import type { QuizItem } from "@/types/quiz"
import { grade } from "@/lib/quiz-data"
import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"

interface QuestionCardProps {
  item: QuizItem
  index: number
  onAnswered: (id: number, isCorrect: boolean) => void
  initialAnswer?: { selected: string; correct: boolean }
}

export function QuestionCard({ item, index, onAnswered, initialAnswer }: QuestionCardProps) {
  const [selected, setSelected] = useState<string | null>(initialAnswer?.selected || null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(initialAnswer?.correct ?? null)
  const [revealed, setRevealed] = useState(!!initialAnswer)

  const ref = useRef(null)
  const isInView = useInView(ref, {
    once: true,
  })

  const handleOptionClick = (option: string) => {
    if (selected) return // Already answered

    const correct = grade(option, item.answer)
    setSelected(option)
    setIsCorrect(correct)
    setRevealed(true)
    onAnswered(item.id, correct)
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
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: -16 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -16 }}
      transition={{ duration: 0.36, ease: "easeOut" }}
      className="w-full max-w-4xl mx-auto mb-8"
    >
      <Card className="shadow-xl/20 border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between mb-4">
            <Badge variant="secondary" className="korean-text">
              문제 {index + 1}
            </Badge>
            {revealed && (
              <Badge variant={isCorrect ? "default" : "destructive"} className="korean-text">
                {isCorrect ? "정답" : "오답"}
              </Badge>
            )}
          </div>

          <h2 className="text-xl md:text-2xl font-semibold leading-relaxed korean-text text-balance">
            {item.question}
          </h2>

          {item.passage && (
            <div className="mt-4 p-4 bg-muted/30 rounded-lg border border-border/30">
              <p className="text-sm leading-relaxed korean-text text-muted-foreground">{item.passage}</p>
            </div>
          )}
        </CardHeader>

        <CardContent>
          <div
            className="space-y-3"
            role="radiogroup"
            aria-labelledby={`question-${item.id}`}
            aria-describedby={revealed ? `explanation-${item.id}` : undefined}
          >
            {item.options.map((option, optionIndex) => (
              <OptionButton
                key={optionIndex}
                label={option}
                selected={selected === option}
                state={getOptionState(option)}
                onClick={() => handleOptionClick(option)}
                disabled={!!selected}
              />
            ))}
          </div>

          {revealed && <NewsLinkCard link={item.newsLink} explanation={item.explanation} />}
        </CardContent>
      </Card>
    </motion.div>
  )
}
