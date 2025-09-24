"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, BookOpen } from "lucide-react"
import { motion } from "framer-motion"

interface NewsLinkCardProps {
  link?: string
  explanation?: string
}

export function NewsLinkCard({ link, explanation }: NewsLinkCardProps) {
  if (!link && !explanation) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.36, ease: "easeOut" }}
      className="mt-6"
    >
      <Card className="bg-secondary/50 border-border/50">
        <CardContent className="p-6">
          {explanation && (
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground korean-text">해설</span>
              </div>
              <p className="text-sm leading-relaxed korean-text text-card-foreground">{explanation}</p>
            </div>
          )}

          {link && (
            <Button variant="outline" size="sm" asChild className="korean-text bg-transparent">
              <a href={link} target="_blank" rel="noopener noreferrer" aria-label="관련 뉴스 기사 새 탭에서 열기">
                <ExternalLink className="w-4 h-4 mr-2" />
                관련 기사 보기
              </a>
            </Button>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
