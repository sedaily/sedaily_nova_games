"use client"

import { motion } from "framer-motion"
import { Trophy, Award, Medal, Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface RankingBadgeProps {
  percentage: number
  delay?: number
}

export function RankingBadge({ percentage, delay = 0 }: RankingBadgeProps) {
  const getRankingData = (percentage: number) => {
    if (percentage >= 90) {
      return {
        rank: "S급",
        title: "완벽한 마스터",
        icon: Trophy,
        color: "#FFD700",
        bgColor: "from-yellow-500/20 to-yellow-600/20",
        borderColor: "border-yellow-500/50",
        description: "놀라운 실력입니다!",
      }
    } else if (percentage >= 80) {
      return {
        rank: "A급",
        title: "우수한 실력자",
        icon: Award,
        color: "#22C55E",
        bgColor: "from-green-500/20 to-green-600/20",
        borderColor: "border-green-500/50",
        description: "매우 훌륭합니다!",
      }
    } else if (percentage >= 70) {
      return {
        rank: "B급",
        title: "실력있는 도전자",
        icon: Medal,
        color: "#5B7CFF",
        bgColor: "from-blue-500/20 to-blue-600/20",
        borderColor: "border-blue-500/50",
        description: "좋은 성과입니다!",
      }
    } else if (percentage >= 60) {
      return {
        rank: "C급",
        title: "성장하는 학습자",
        icon: Star,
        color: "#9B8CFF",
        bgColor: "from-purple-500/20 to-purple-600/20",
        borderColor: "border-purple-500/50",
        description: "계속 노력하세요!",
      }
    } else {
      return {
        rank: "D급",
        title: "도전하는 초보자",
        icon: Star,
        color: "#F59E0B",
        bgColor: "from-orange-500/20 to-orange-600/20",
        borderColor: "border-orange-500/50",
        description: "다시 도전해보세요!",
      }
    }
  }

  const rankingData = getRankingData(percentage)
  const Icon = rankingData.icon

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0, rotateY: -180 }}
      animate={{ scale: 1, opacity: 1, rotateY: 0 }}
      transition={{
        delay,
        duration: 0.8,
        type: "spring",
        stiffness: 150,
      }}
      className="relative"
    >
      {/* Zoom-in effect with blur-out background */}
      <motion.div
        initial={{ scale: 0.5, filter: "blur(10px)" }}
        animate={{ scale: 1, filter: "blur(0px)" }}
        transition={{
          delay: delay + 0.2,
          duration: 0.6,
          ease: "easeOut",
        }}
        className={`glassmorphism-card p-8 rounded-3xl ${rankingData.borderColor} border-2 relative overflow-hidden`}
      >
        {/* Background gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br ${rankingData.bgColor} opacity-50`} />

        {/* Animated background particles */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{
              backgroundColor: rankingData.color,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 0.6, 0],
              y: [0, -50, -100],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 2,
              ease: "easeOut",
            }}
          />
        ))}

        <div className="relative z-10 text-center space-y-6">
          {/* Rank Icon */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              delay: delay + 0.4,
              duration: 0.6,
              type: "spring",
              stiffness: 200,
            }}
            className="flex justify-center"
          >
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${rankingData.color}20, ${rankingData.color}40)`,
                boxShadow: `0 0 30px ${rankingData.color}40`,
              }}
            >
              <Icon className="w-10 h-10" style={{ color: rankingData.color }} />
            </div>
          </motion.div>

          {/* Rank Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: delay + 0.6, duration: 0.5 }}
          >
            <Badge
              className="text-2xl px-8 py-4 font-bold korean-text rounded-full"
              style={{
                backgroundColor: `${rankingData.color}20`,
                color: rankingData.color,
                border: `2px solid ${rankingData.color}50`,
                boxShadow: `0 0 20px ${rankingData.color}30`,
              }}
            >
              {rankingData.rank}
            </Badge>
          </motion.div>

          {/* Title and Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: delay + 0.8, duration: 0.5 }}
            className="space-y-3"
          >
            <h3 className="text-2xl font-bold korean-text text-foreground">{rankingData.title}</h3>
            <p className="text-lg korean-text text-muted-foreground">{rankingData.description}</p>
          </motion.div>

          {/* Animated glow effect */}
          <motion.div
            className="absolute inset-0 rounded-3xl"
            animate={{
              boxShadow: [
                `0 0 20px ${rankingData.color}20`,
                `0 0 40px ${rankingData.color}40`,
                `0 0 20px ${rankingData.color}20`,
              ],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
        </div>
      </motion.div>
    </motion.div>
  )
}
