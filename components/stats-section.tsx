import { TrendingUp, Users, Clock, Award } from "lucide-react"

export function StatsSection() {
  const stats = [
    {
      icon: Users,
      value: "50K+",
      label: "누적 사용자",
      color: "text-primary",
    },
    {
      icon: TrendingUp,
      value: "300+",
      label: "게임 문제수",
      color: "text-secondary",
    },
    {
      icon: Clock,
      value: "10분",
      label: "평균 학습 시간",
      color: "text-accent",
    },
    {
      icon: Award,
      value: "98%",
      label: "만족도",
      color: "text-primary",
    },
  ]

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div
                className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-background shadow-sm mb-4 ${stat.color}`}
              >
                <stat.icon className="w-6 h-6" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
