"use client"

import { motion } from "framer-motion"
import { BookOpen, ArrowDown, Zap, Brain } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface EnhancedIntroSectionProps {
  onStart: () => void
  answeredCount: number
  correctCount: number
  totalQuestions: number
}

export function EnhancedIntroSection({
  onStart,
  answeredCount,
  correctCount,
  totalQuestions,
}: EnhancedIntroSectionProps) {
  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background/98 to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(91,124,255,0.15),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(155,140,255,0.15),transparent_60%)]" />

      <motion.div
        className="absolute inset-0 opacity-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ duration: 2 }}
      >
        <svg className="w-full h-full" viewBox="0 0 1000 1000" fill="none">
          <motion.path
            d="M100 200 L300 200 L300 400 L500 400"
            stroke="url(#gradient1)"
            strokeWidth="1"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 3, delay: 1 }}
          />
          <motion.path
            d="M600 600 L800 600 L800 300 L900 300"
            stroke="url(#gradient2)"
            strokeWidth="1"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 3, delay: 1.5 }}
          />
          <defs>
            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#5B7CFF" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#9B8CFF" stopOpacity="0.6" />
            </linearGradient>
            <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#9B8CFF" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#5B7CFF" stopOpacity="0.6" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>

      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-primary/40 rounded-full"
          style={{
            left: `${20 + i * 7}%`,
            top: `${30 + i * 5}%`,
          }}
          animate={{
            scale: [1, 2, 1],
            opacity: [0.4, 0.8, 0.4],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 4 + i * 0.3,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: i * 0.2,
          }}
        />
      ))}

      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="text-center space-y-12 px-4 relative z-10 max-w-6xl mx-auto"
      >
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8, type: "spring", stiffness: 200 }}
          className="flex items-center justify-center gap-8 mb-16"
        >
          <motion.div
            animate={{
              rotate: [0, 10, -10, 0],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 6,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            <BookOpen className="w-24 h-24 text-primary" />
          </motion.div>

          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 8,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            <Brain className="w-16 h-16 text-accent" />
          </motion.div>

          <motion.div
            animate={{
              y: [0, -10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 4,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: 1,
            }}
          >
            <Zap className="w-20 h-20 text-primary" />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="space-y-8"
        >
          <motion.h1
            className="text-6xl md:text-8xl font-bold korean-text leading-tight"
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.08,
                  delayChildren: 0.8,
                },
              },
            }}
          >
            {["AI와", "함께", "매일", "시사를", "푼다"].map((word, i) => (
              <motion.span
                key={i}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0 },
                }}
                className="inline-block mr-4 bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent"
              >
                {word}
              </motion.span>
            ))}
          </motion.h1>

          <motion.p
            className="text-2xl md:text-4xl korean-text text-muted-foreground max-w-4xl mx-auto leading-relaxed text-balance"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            스크롤하면 문제와 근거 기사가 순서대로 열립니다.
            <br />
            <span className="text-primary font-semibold">오늘의 이슈</span>를 가장 빠르게 체득하세요.
          </motion.p>
        </motion.div>

        {answeredCount > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.4, duration: 0.6 }}
            className="flex items-center justify-center gap-8 flex-wrap"
          >
            <Badge
              variant="outline"
              className="korean-text text-xl px-8 py-4 card-enhanced rounded-full font-semibold border-primary/30"
            >
              진행률: {answeredCount}/{totalQuestions}
            </Badge>
            <Badge
              variant="outline"
              className="korean-text text-xl px-8 py-4 card-enhanced rounded-full font-semibold border-accent/30"
            >
              정답률: {Math.round((correctCount / answeredCount) * 100)}%
            </Badge>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.8 }}
        >
          <Button
            onClick={onStart}
            size="lg"
            className="korean-text text-2xl px-16 py-8 rounded-full bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_100%] hover:bg-[position:100%_0] transition-all duration-500 glow-primary hover:scale-105 font-semibold"
          >
            지금 시작
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            >
              <ArrowDown className="w-8 h-8 ml-4" />
            </motion.div>
          </Button>
        </motion.div>
      </motion.div>
    </section>
  )
}
