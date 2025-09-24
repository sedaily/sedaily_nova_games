"use client"

import { motion } from "framer-motion"
import { Progress } from "@/components/ui/progress"

interface ProgressBarProps {
  total: number
  answered: number
}

export function ProgressBar({ total, answered }: ProgressBarProps) {
  const percentage = total > 0 ? (answered / total) * 100 : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border/50 p-4 z-50"
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium korean-text text-muted-foreground">진행률</span>
          <span className="text-sm font-medium korean-text text-muted-foreground">
            {answered}/{total}
          </span>
        </div>
        <Progress value={percentage} className="h-2" aria-label={`퀴즈 진행률: ${answered}/${total} 완료`} />
      </div>
    </motion.div>
  )
}
