"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, Lightbulb } from "lucide-react"
import { motion } from "framer-motion"

interface EnhancedNewsLinkCardProps {
  link?: string
  explanation?: string
}

export function EnhancedNewsLinkCard({ link, explanation }: EnhancedNewsLinkCardProps) {
  if (!link && !explanation) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
        delay: 0.2,
      }}
      className="mt-8"
    >
      <Card className="bg-gradient-to-br from-secondary/60 to-muted/40 border-border/30 shadow-xl backdrop-blur-sm overflow-hidden">
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: "auto" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <CardContent className="p-8">
            {explanation && (
              <motion.div
                className="mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <motion.div
                    initial={{ rotate: 0 }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  >
                    <Lightbulb className="w-5 h-5 text-primary" />
                  </motion.div>
                  <span className="text-base font-semibold text-primary korean-text">해설</span>
                </div>
                <motion.p
                  className="text-base leading-relaxed korean-text text-card-foreground/90 bg-background/20 p-4 rounded-lg border border-border/20"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  {explanation}
                </motion.p>
              </motion.div>
            )}

            {link && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <Button
                  variant="outline"
                  size="lg"
                  asChild
                  className="korean-text bg-background/50 hover:bg-background/80 border-primary/20 hover:border-primary/40 transition-all duration-300 rounded-xl px-6 py-3"
                >
                  <a href={link} target="_blank" rel="noopener noreferrer" aria-label="관련 뉴스 기사 새 탭에서 열기">
                    <ExternalLink className="w-5 h-5 mr-3" />
                    관련 기사 자세히 보기
                  </a>
                </Button>
              </motion.div>
            )}
          </CardContent>
        </motion.div>
      </Card>
    </motion.div>
  )
}
