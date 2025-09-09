import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock } from "lucide-react"
import Link from "next/link"

interface GameCardProps {
  title: string
  description: string
  duration: string
  difficulty: "초급" | "중급" | "고급"
  isPopular?: boolean
  isPro?: boolean
  emoji: string
  href: string
}

export function GameCard({ title, description, duration, isPopular, isPro, emoji, href }: GameCardProps) {
  // difficulty
  // const difficultyColors = {
  //   초급: "bg-green-100 text-green-800",
  //   중급: "bg-yellow-100 text-yellow-800",
  //   고급: "bg-red-100 text-red-800",
  // }

  return (
    <Link href={href} className="block">
      <Card className="group relative overflow-hidden bg-white border-[#E6EEF7] rounded-2xl shadow-[0_8px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_28px_rgba(0,0,0,0.12)] transition-all duration-150 ease-out hover:-translate-y-0.5 cursor-pointer">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{emoji}</span>
              <div>
                <CardTitle className="text-lg font-semibold text-balance text-foreground">{title}</CardTitle>
                {isPopular && (
                  <Badge variant="secondary" className="mt-1 text-xs bg-primary/10 text-primary border-primary/20">
                    인기
                  </Badge>
                )}
              </div>
            </div>
            {isPro && (
              <Badge variant="outline" className="text-xs border-secondary text-secondary bg-secondary/5">
                PRO
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <CardDescription className="text-sm text-pretty leading-relaxed text-muted-foreground">
            {description}
          </CardDescription>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>{duration}</span>
            </div>
          </div>

          <Button className="w-full group-hover:bg-primary/90 transition-all duration-150 focus-ring" size="sm">
            바로 시작
          </Button>
        </CardContent>
      </Card>
    </Link>
  )
}
