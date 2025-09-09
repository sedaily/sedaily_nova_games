import { Header } from "@/components/header"
import { GameCard } from "@/components/game-card"
import { StatsSection } from "@/components/stats-section"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Target, Quote, ExternalLink, Sparkles, TrendingUp, Brain, Cpu, Lightbulb } from "lucide-react"

export default function HomePage() {
  const freeGames = [
    {
      title: "오늘의 경제 퀴즈",
      description: "Wordle 스타일로 경제 용어를 맞혀보세요. 힌트를 통해 단계별로 학습할 수 있습니다.",
      duration: "3-5분",
      difficulty: "초급" as const,
      isPopular: true,
      emoji: "🎯",
      href: "/games/econ-quiz", // Updated href to match new game route
    },
    {
      title: "서울경제 크로스워드",
      description: "최신 경제 뉴스를 바탕으로 한 크로스워드 퍼즐로 시사 상식을 늘려보세요.",
      duration: "5-7분",
      difficulty: "중급" as const,
      emoji: "📰",
      href: "/games/crossword",
    },
    {
      title: "경제 뉴스 빙고",
      description: "오늘의 경제 이슈 중 참/거짓을 골라 빙고를 완성하세요.",
      duration: "3-4분",
      difficulty: "초급" as const,
      emoji: "🎲",
      href: "/games/news-bingo",
    },
    {
      title: "경제 용어 릴레이",
      description: "AI와 함께 경제 용어 끝말잇기를 하며 어휘력을 늘려보세요.",
      duration: "5-8분",
      difficulty: "중급" as const,
      emoji: "🔄",
      href: "/games/word-relay",
    },
    {
      title: "경제 이슈 룰렛",
      description: "룰렛을 돌려 나온 주제로 퀴즈를 풀어보세요. 매번 다른 재미!",
      duration: "2-3분",
      difficulty: "초급" as const,
      isPopular: true,
      emoji: "🎡",
      href: "/games/issue-roulette",
    },
  ]

  const proGames = [
    {
      title: "블랙스완",
      description: "복잡한 경제 사건의 인과관계를 파악하고 올바른 순서로 배열해보세요.",
      duration: "10-15분",
      difficulty: "고급" as const,
      isPro: true,
      emoji: "🦢",
      href: "/games/black-swan",
    },
    {
      title: "애니멀 스피릿",
      description: "경제 개념과 이론을 심화 학습하며 전문 지식을 쌓아보세요.",
      duration: "8-12분",
      difficulty: "고급" as const,
      isPro: true,
      emoji: "🧠",
      href: "/games/animal-spirit",
    },
    {
      title: "죄수의 딜레마",
      description: "경제 이슈의 찬반 논리를 분석하고 균형잡힌 시각을 기르세요.",
      duration: "12-18분",
      difficulty: "고급" as const,
      isPro: true,
      emoji: "⚖️",
      href: "/games/prisoners-dilemma",
    },
  ]

  const benefits = [
    {
      icon: Brain,
      title: "AI가 분석한 경제 게임으로 10분 만에 시사 감각 업",
      description: "인공지능이 큐레이션한 최신 경제 이슈로 짧은 시간 투자만으로도 효과적인 학습이 가능합니다.",
    },
    {
      icon: Cpu,
      title: "경제·시사·논리를 동시에 학습합니다",
      description: "복합적 사고력을 기르며 언론고시에 필요한 핵심 역량을 체계적으로 개발하세요.",
    },
    {
      icon: Lightbulb,
      title: "디지털 네이티브를 위한 미래형 학습",
      description: "게임화된 학습 경험으로 자연스럽게 경제 전문 지식과 용어를 습득할 수 있습니다.",
    },
  ]

  const testimonials = [
    {
      quote: "게임 하듯 재미있게 경제 뉴스를 접하니까 자연스럽게 습관이 되었어요. 언론고시 준비에 정말 도움이 됩니다.",
      author: "김서연",
      role: "언론고시 준비생",
    },
    {
      quote: "복잡한 경제 개념들을 게임으로 배우니 훨씬 이해하기 쉬워요. 특히 Pro 게임들이 정말 유용합니다.",
      author: "박준호",
      role: "경제학과 학생",
    },
  ]

  const crossPromotionServices = [
    {
      icon: Sparkles,
      title: "AI PRISM",
      description: "맞춤형 뉴스 큐레이션으로 더 스마트한 정보 소비를 경험하세요.",
      link: "/ai-prism",
    },
    {
      icon: TrendingUp,
      title: "경제용",
      description: "경제 전문 콘텐츠와 심화 분석으로 전문성을 키워보세요.",
      link: "/economic",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative py-24 hero-gradient overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 ai-grid opacity-30"></div>

          <div className="absolute inset-0 scanline-overlay"></div>

          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 particle-small bg-white glow-particle"></div>
            <div className="absolute top-3/4 right-1/3 particle-medium bg-white glow-particle"></div>
            <div className="absolute bottom-1/4 left-1/2 particle-large bg-white glow-particle"></div>
            <div className="absolute top-1/2 right-1/4 particle-small bg-white glow-particle"></div>
            <div className="absolute bottom-1/3 left-1/3 particle-medium bg-white glow-particle"></div>
            <div className="absolute top-1/6 right-1/2 particle-small bg-white glow-particle"></div>
            <div className="absolute top-2/3 left-1/5 particle-medium bg-white glow-particle"></div>
            <div className="absolute bottom-1/5 right-2/3 particle-large bg-white glow-particle"></div>
          </div>

          <div className="absolute top-0 left-0 w-full h-full opacity-15">
            <svg className="absolute top-1/4 left-1/4 w-32 h-32 text-white animate-pulse" viewBox="0 0 100 100">
              <path d="M20,50 Q40,20 60,50 T100,50" stroke="currentColor" strokeWidth="0.5" fill="none" />
              <path d="M20,60 Q40,30 60,60 T100,60" stroke="currentColor" strokeWidth="0.3" fill="none" />
            </svg>
            <svg
              className="absolute bottom-1/3 right-1/4 w-24 h-24 text-white animate-pulse delay-2000"
              viewBox="0 0 100 100"
            >
              <circle cx="50" cy="50" r="20" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.6" />
              <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="0.3" fill="none" opacity="0.4" />
            </svg>
          </div>

          {/* Glassmorphism overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 backdrop-blur-[0.5px]"></div>
        </div>

        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <Badge
            variant="secondary"
            className="mb-8 bg-white/20 text-white border-white/30 backdrop-blur-sm neon-border"
          >
            <Cpu className="w-4 h-4 mr-2" />
            AI-Powered Economic Learning Platform
          </Badge>

          <h1
            className="text-h1 text-balance mb-8 text-white font-bold tracking-tight"
            style={{
              background: "linear-gradient(135deg, #ffffff 0%, #f0f8ff 50%, #ffffff 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              textShadow: "0 0 24px rgba(240, 248, 255, 0.3)",
            }}
          >
            AI 프리즘으로 경제가 더 재미있어지는 게임즈
          </h1>

          <p className="text-body text-white/90 text-balance mb-10 max-w-3xl mx-auto leading-relaxed">
            인공지능이 분석한 경제 뉴스로 10분 만에 시사 감각을 업그레이드하고, 언론고시 대비 학습효과를 극대화하세요
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button
              size="lg"
              className="text-lg px-10 py-4 bg-white text-primary hover:bg-white/90 focus-ring hover:scale-105 active:scale-98 transition-all duration-150 shadow-lg hover:shadow-glow"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              지금 플레이하기
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="text-lg px-10 py-4 border-white/50 text-white hover:bg-white/10 focus-ring bg-white/5 backdrop-blur-sm hover:scale-105 active:scale-98 transition-all duration-150 neon-border"
            >
              <Brain className="w-5 h-5 mr-2" />
              Pro 살펴보기
            </Button>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-background section-fade-up relative">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/30 via-transparent to-purple-50/20"></div>

        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <Badge variant="outline" className="mb-6 border-primary/20 text-primary bg-primary/5">
              <Lightbulb className="w-4 h-4 mr-2" />
              AI 기반 학습 시스템
            </Badge>
            <h2 className="text-h2 text-balance mb-8 text-foreground font-bold">왜 AI 프리즘 게임즈인가요?</h2>
            <p className="text-body text-muted-foreground text-balance max-w-2xl mx-auto leading-relaxed">
              인공지능 기술과 게임화 학습을 결합하여 경제 뉴스 소비를 혁신적으로 변화시킵니다.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {benefits.map((benefit, index) => (
              <Card
                key={index}
                className="text-center border border-border/50 shadow-enhanced card-hover bg-card/80 backdrop-blur-sm hover:bg-card transition-all duration-300 hover:scale-105"
              >
                <CardHeader className="pb-6">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 text-primary mx-auto mb-8 shadow-soft">
                    <benefit.icon className="w-10 h-10" />
                  </div>
                  <CardTitle className="text-xl font-bold text-balance text-card-foreground leading-tight">
                    {benefit.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base text-muted-foreground text-pretty leading-relaxed">
                    {benefit.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <StatsSection />

      {/* Games Section */}
      <section className="py-24 bg-background relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-50/10 to-transparent"></div>

        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <Badge variant="outline" className="mb-6 border-primary/20 text-primary bg-primary/5">
              <Target className="w-4 h-4 mr-2" />
              게임화 학습 콘텐츠
            </Badge>
            <h2 className="text-h2 text-balance mb-8 text-foreground font-bold">AI가 큐레이션한 경제 게임</h2>
            <p className="text-body text-muted-foreground text-balance max-w-2xl mx-auto leading-relaxed">
              다양한 난이도의 게임을 통해 경제 상식을 체계적으로 학습하고 언론고시를 효과적으로 준비하세요.
            </p>
          </div>

          <Tabs defaultValue="free" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-16 bg-muted/80 backdrop-blur-sm shadow-soft">
              <TabsTrigger value="free" className="text-base focus-ring font-medium">
                <Sparkles className="w-4 h-4 mr-2" />
                Free Arcade
              </TabsTrigger>
              <TabsTrigger value="pro" className="text-base focus-ring font-medium">
                <Brain className="w-4 h-4 mr-2" />
                Pro Academy
              </TabsTrigger>
            </TabsList>

            <TabsContent value="free" className="space-y-8">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {freeGames.map((game, index) => (
                  <GameCard key={index} {...game} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="pro" className="space-y-8">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {proGames.map((game, index) => (
                  <GameCard key={index} {...game} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-muted/50 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 via-transparent to-purple-50/20"></div>

        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <Badge variant="outline" className="mb-6 border-primary/20 text-primary bg-primary/5">
              <Quote className="w-4 h-4 mr-2" />
              사용자 후기
            </Badge>
            <h2 className="text-h2 text-balance mb-8 text-foreground font-bold">AI 프리즘 게임즈 사용자들의 이야기</h2>
            <p className="text-body text-muted-foreground text-balance">
              매일 AI 프리즘과 함께하는 독자들의 생생한 학습 경험
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="border border-border/50 shadow-enhanced card-hover bg-background/80 backdrop-blur-sm hover:scale-105 transition-all duration-300"
              >
                <CardContent className="pt-10">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mb-8">
                    <Quote className="w-6 h-6 text-primary" />
                  </div>
                  <blockquote className="text-xl text-pretty leading-relaxed mb-8 text-foreground font-medium">
                   &quot;{testimonial.quote}&quot;
                  </blockquote>
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center shadow-soft">
                      <span className="text-base font-bold text-primary">{testimonial.author[0]}</span>
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">{testimonial.author}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Cross-Promotion Section */}
      <section className="py-24 bg-[#F5FAFF] relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-indigo-50/30"></div>

        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <Badge variant="outline" className="mb-6 border-primary/20 text-primary bg-primary/5">
              <ExternalLink className="w-4 h-4 mr-2" />
              서울경제 디지털 생태계
            </Badge>
            <h2 className="text-h2 text-balance mb-8 text-foreground font-bold">
              AI PRISM·경제용과 함께하는 통합 학습 경험
            </h2>
            <p className="text-body text-muted-foreground text-balance max-w-2xl mx-auto leading-relaxed">
              맞춤형 AI 큐레이션과 심화 학습 콘텐츠로 경제 전문성을 한 단계 더 발전시켜보세요.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
            {crossPromotionServices.map((service, index) => (
              <Card
                key={index}
                className="bg-white/90 backdrop-blur-sm border-[#E6EEF7]/80 rounded-3xl shadow-enhanced hover:shadow-neon transition-all duration-300 ease-out hover:-translate-y-1 card-hover group"
              >
                <CardHeader className="pb-6">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 text-primary mb-8 shadow-soft group-hover:shadow-glow transition-all duration-300">
                    <service.icon className="w-10 h-10" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-balance text-card-foreground">
                    {service.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <CardDescription className="text-base text-muted-foreground text-pretty leading-relaxed">
                    {service.description}
                  </CardDescription>
                  <Button
                    variant="ghost"
                    className="p-0 h-auto text-primary hover:text-primary/80 focus-ring font-semibold group-hover:scale-105 transition-all duration-200"
                    asChild
                  >
                    <a href={service.link} className="inline-flex items-center">
                      자세히 보기 <ExternalLink className="w-4 h-4 ml-2" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 bg-foreground text-background relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-background rounded-full animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-background rounded-full animate-pulse delay-2000"></div>
          <div className="absolute top-1/2 left-3/4 w-1 h-1 bg-background rounded-full animate-pulse delay-4000"></div>
        </div>

        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="text-3xl font-bold mb-6 flex items-center justify-center">
            <Brain className="w-8 h-8 mr-3" />
            서울경제신문
          </div>
          <p className="text-base text-muted opacity-80 leading-relaxed">
            © 2025 서울경제신문. All rights reserved. | AI로 만드는 더 나은 경제 정보
          </p>
        </div>
      </footer>
    </div>
  )
}
