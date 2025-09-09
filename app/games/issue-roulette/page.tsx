"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, HelpCircle, RotateCcw, Trophy, Timer, CheckCircle, XCircle } from "lucide-react"
import Link from "next/link"
import { GameCountdown } from "@/components/game-countdown"

interface Sector {
  id: number
  name: string
  color: string
  question: string
  options: string[]
  answer: number
  explanation: string
}

interface RouletteData {
  sectors: Sector[]
}

interface BadgeProgress {
  [sectorName: string]: {
    correct: number
    total: number
  }
}

type GameState = "intro" | "spinning" | "quiz" | "result"

export default function IssueRoulettePage() {
  const [gameState, setGameState] = useState<GameState>("intro")
  const [showCountdown, setShowCountdown] = useState(false)
  const [rouletteData, setRouletteData] = useState<RouletteData | null>(null)
  const [selectedSector, setSelectedSector] = useState<Sector | null>(null)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [timeLeft, setTimeLeft] = useState(15)
  const [badgeProgress, setBadgeProgress] = useState<BadgeProgress>({})
  const [rotation, setRotation] = useState(0)
  const [isSpinning, setIsSpinning] = useState(false)
  const [showBadgeModal, setShowBadgeModal] = useState(false)
  const [highlightIndex, setHighlightIndex] = useState<number | null>(null)
  const [spinDuration, setSpinDuration] = useState(4800)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Load roulette data
  useEffect(() => {
    fetch("/issue-roulette-data.json")
      .then((res) => res.json())
      .then((data: RouletteData) => {
        setRouletteData(data)
        // Initialize badge progress
        const initialProgress: BadgeProgress = {}
        data.sectors.forEach((sector) => {
          initialProgress[sector.name] = { correct: 0, total: 0 }
        })
        setBadgeProgress(initialProgress)
      })
      .catch((err) => {
        console.error("Failed to load roulette data:", err)
        const fallbackData: RouletteData = {
          sectors: [
            {
              id: 1,
              name: "금융",
              color: "#3B82F6",
              question: "중앙은행의 기준금리 인상이 경제에 미치는 주요 효과는?",
              options: ["인플레이션 억제", "경기 부양", "환율 하락", "수출 증가"],
              answer: 0,
              explanation: "기준금리 인상은 시중 유동성을 줄여 인플레이션을 억제하는 효과가 있습니다.",
            },
            {
              id: 2,
              name: "부동산",
              color: "#10B981",
              question: "부동산 가격 상승의 주요 원인이 아닌 것은?",
              options: ["공급 부족", "저금리 정책", "인구 증가", "고금리 정책"],
              answer: 3,
              explanation: "고금리 정책은 대출 비용을 증가시켜 부동산 수요를 억제하므로 가격 상승 요인이 아닙니다.",
            },
            {
              id: 3,
              name: "주식",
              color: "#F59E0B",
              question: "주식시장에서 'PER'이 의미하는 것은?",
              options: ["주가수익비율", "자기자본비율", "부채비율", "유동비율"],
              answer: 0,
              explanation: "PER(Price Earnings Ratio)은 주가를 주당순이익으로 나눈 주가수익비율입니다.",
            },
            {
              id: 4,
              name: "무역",
              color: "#EF4444",
              question: "무역수지 흑자가 지속될 때 나타나는 현상은?",
              options: ["환율 상승", "환율 하락", "수입 증가", "물가 상승"],
              answer: 1,
              explanation: "무역수지 흑자는 외화 유입을 증가시켜 자국 통화 가치 상승(환율 하락)을 유발합니다.",
            },
            {
              id: 5,
              name: "산업",
              color: "#8B5CF6",
              question: "4차 산업혁명의 핵심 기술이 아닌 것은?",
              options: ["인공지능", "사물인터넷", "블록체인", "증기기관"],
              answer: 3,
              explanation: "증기기관은 1차 산업혁명의 핵심 기술이며, 4차 산업혁명과는 관련이 없습니다.",
            },
            {
              id: 6,
              name: "정책",
              color: "#06B6D4",
              question: "확장적 재정정책의 대표적인 수단은?",
              options: ["세금 인상", "정부지출 증가", "통화량 감소", "금리 인상"],
              answer: 1,
              explanation: "확장적 재정정책은 정부지출을 늘리거나 세금을 줄여 경기를 부양하는 정책입니다.",
            },
            {
              id: 7,
              name: "국제",
              color: "#EC4899",
              question: "환율이 상승(원화 약세)할 때 나타나는 현상은?",
              options: ["수출 감소", "수입 증가", "수출 증가", "물가 하락"],
              answer: 2,
              explanation: "원화 약세는 우리나라 상품의 해외 가격 경쟁력을 높여 수출을 증가시킵니다.",
            },
            {
              id: 8,
              name: "기술",
              color: "#84CC16",
              question: "핀테크(FinTech)의 의미는?",
              options: ["금융기술", "정보기술", "생명기술", "나노기술"],
              answer: 0,
              explanation: "핀테크는 Finance(금융)와 Technology(기술)의 합성어로 금융기술을 의미합니다.",
            },
          ],
        }
        setRouletteData(fallbackData)
        const initialProgress: BadgeProgress = {}
        fallbackData.sectors.forEach((sector) => {
          initialProgress[sector.name] = { correct: 0, total: 0 }
        })
        setBadgeProgress(initialProgress)
      })
  }, [])

  const handleTimeUp = useCallback(() => {
    if (!selectedSector) return

    setSelectedAnswer(-1)
    setIsCorrect(false)

    const sectorName = selectedSector.name
    setBadgeProgress((prev) => ({
      ...prev,
      [sectorName]: {
        correct: prev[sectorName]?.correct ?? 0,
        total: (prev[sectorName]?.total ?? 0) + 1,
      },
    }))

    setGameState("result")
  }, [selectedSector])

  useEffect(() => {
    if (gameState === "quiz" && timeLeft > 0) {
      timerRef.current = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => {
        if (timerRef.current) clearTimeout(timerRef.current)
      }
    } else if (gameState === "quiz" && timeLeft === 0) {
      handleTimeUp()
    }
  }, [gameState, timeLeft, handleTimeUp])

  const handleCountdownComplete = () => {
    setShowCountdown(false)
    setGameState("spinning")
  }

  const startGame = () => {
    setShowCountdown(true)
  }

  const spinRoulette = () => {
    if (!rouletteData || isSpinning) return

    setIsSpinning(true)
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const spinMs = prefersReducedMotion ? 800 : 4800 // 4.8s for better visibility
    const spins = prefersReducedMotion ? 1.5 : 2.5 + Math.random() * 1.0 // 2.5-3.5 rotations
    const finalAngle = Math.random() * 360
    const totalRotation = rotation + spins * 360 + finalAngle

    setSpinDuration(spinMs)
    setRotation(totalRotation)

    const liveRegion = document.getElementById("roulette-live")
    if (liveRegion) {
      liveRegion.textContent = "룰렛을 돌리는 중…"
    }

    setTimeout(() => {
      setIsSpinning(false)

      const normalizedAngle = ((totalRotation % 360) + 360) % 360
      const pointerAngle = (360 - normalizedAngle) % 360
      const sectorAngle = 360 / rouletteData.sectors.length
      const sectorIndex = Math.floor(pointerAngle / sectorAngle) % rouletteData.sectors.length
    const selected: Sector | null = rouletteData?.sectors?.[sectorIndex] ?? null

    setSelectedSector(selected)
      setSelectedAnswer(null)
      setIsCorrect(null)
      setTimeLeft(15)

      setHighlightIndex(sectorIndex)
      setTimeout(() => setHighlightIndex(null), 600)

      if (liveRegion) {
        liveRegion.textContent = selected ? `${selected.name} 섹터가 선택되었습니다.` : ""
      }

      setTimeout(() => {
        setGameState("quiz")
      }, 200)
    }, spinMs)
  }

  const handleAnswerSelect = (answerIndex: number) => {
    if (selectedAnswer !== null || !selectedSector) return

    setSelectedAnswer(answerIndex)
    const correct = answerIndex === selectedSector.answer
    setIsCorrect(correct)

    const sectorName = selectedSector.name
    setBadgeProgress((prev) => ({
      ...prev,
      [sectorName]: {
        correct: (prev[sectorName]?.correct ?? 0) + (correct ? 1 : 0),
        total: (prev[sectorName]?.total ?? 0) + 1,
      },
    }))

    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }

    setGameState("result")
  }

  // removed duplicate handleTimeUp; using the useCallback version defined above

  const resetGame = () => {
    setGameState("spinning")
    setSelectedSector(null)
    setSelectedAnswer(null)
    setIsCorrect(null)
    setTimeLeft(15)
  }

  const RouletteWheel = () => {
    if (!rouletteData) return null

    const sectorAngle = 360 / rouletteData.sectors.length

    return (
      <div className="relative w-80 h-80 md:w-96 md:h-96 mx-auto">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-3 z-10">
          <div className="w-0 h-0 border-l-6 border-r-6 border-b-10 border-l-transparent border-r-transparent border-b-white drop-shadow-xl"></div>
        </div>

        {highlightIndex !== null && (
          <div className="absolute -inset-1 rounded-full ring-4 ring-white/70 animate-pulse pointer-events-none" />
        )}

        <div
          className="w-full h-full rounded-full border-4 border-white shadow-2xl ring-1 ring-white/30"
          style={{
            transform: `rotate(${rotation}deg)`,
            transitionProperty: "transform",
            transitionDuration: `${isSpinning ? spinDuration : 500}ms`,
            transitionTimingFunction: "cubic-bezier(.08,.82,.17,1)",
            background: `conic-gradient(from -90deg, ${rouletteData.sectors
              .map((sector, index) => `${sector.color} ${index * sectorAngle}deg ${(index + 1) * sectorAngle}deg`)
              .join(", ")})`,
          }}
        >
          <div
            aria-hidden
            className="absolute inset-0 rounded-full pointer-events-none mix-blend-overlay"
            style={{
              background: `repeating-conic-gradient(from -90deg, #ffffff66 0deg 1deg, transparent 1deg ${sectorAngle}deg)`,
            }}
          />

          {rouletteData.sectors.map((sector, index) => {
            const angle = index * sectorAngle + sectorAngle / 2
            const radian = (angle * Math.PI) / 180
            const x = 50 + 35 * Math.cos(radian - Math.PI / 2)
            const y = 50 + 35 * Math.sin(radian - Math.PI / 2)

            return (
              <div
                key={sector.id}
                className="absolute text-white font-bold text-sm transform -translate-x-1/2 -translate-y-1/2 pointer-events-none drop-shadow-lg"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  transform: `translate(-50%, -50%) rotate(${angle}deg)`,
                }}
              >
                {sector.name}
              </div>
            )
          })}
        </div>

        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white rounded-full shadow-xl ring-2 ring-white/50 flex items-center justify-center">
          <div className="w-8 h-8 bg-primary rounded-full shadow-inner"></div>
        </div>
      </div>
    )
  }

  const QuizQuestion = () => {
    if (!selectedSector) return null

    return (
      <Card className="w-full max-w-2xl mx-auto mt-8">
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <Badge style={{ backgroundColor: selectedSector.color, color: "white" }}>{selectedSector.name}</Badge>
            {gameState === "quiz" && (
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Timer className="w-4 h-4" />
                <span>{timeLeft}초</span>
              </div>
            )}
          </div>
          <CardTitle className="text-xl text-balance">{selectedSector.question}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {selectedSector.options.map((option, index) => {
            let buttonClass = "w-full p-4 text-left border rounded-lg transition-all duration-200 hover:bg-muted/50"

            if (selectedAnswer !== null) {
              if (index === selectedSector.answer) {
                buttonClass += " bg-green-100 border-green-500 text-green-800"
              } else if (index === selectedAnswer && selectedAnswer !== selectedSector.answer) {
                buttonClass += " bg-red-100 border-red-500 text-red-800"
              } else {
                buttonClass += " opacity-50"
              }
            }

            return (
              <Button
                key={index}
                variant="outline"
                className={buttonClass}
                onClick={() => handleAnswerSelect(index)}
                disabled={selectedAnswer !== null || gameState !== "quiz"}
              >
                <span className="font-semibold mr-3">{String.fromCharCode(65 + index)})</span>
                {option}
              </Button>
            )
          })}

          {gameState === "result" && (
            <div className="mt-6 p-4 rounded-lg bg-muted/50">
              <div className="flex items-center space-x-2 mb-2">
                {isCorrect ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
                <span className="font-semibold">
                  {selectedAnswer === -1 ? "⏰ 시간 초과!" : isCorrect ? "✅ 정답입니다!" : "❌ 오답입니다."}
                </span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{selectedSector.explanation}</p>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  const BadgeModal = () => {
    const totalBadges = Object.keys(badgeProgress).length
    const earnedBadges = Object.values(badgeProgress).filter((progress) => progress.correct > 0).length

    return (
      <Dialog open={showBadgeModal} onOpenChange={setShowBadgeModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <span>뱃지 현황</span>
            </DialogTitle>
            <DialogDescription>각 분야별 학습 진척도를 확인하세요</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-primary">
                {earnedBadges}/{totalBadges}
              </div>
              <div className="text-sm text-muted-foreground">획득한 뱃지</div>
            </div>
            {Object.entries(badgeProgress).map(([sectorName, progress]) => (
              <div key={sectorName} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{sectorName}</span>
                  <span className="text-sm text-muted-foreground">
                    {progress.correct}/{progress.total}
                  </span>
                </div>
                <Progress value={progress.total > 0 ? (progress.correct / progress.total) * 100 : 0} className="h-2" />
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  if (!rouletteData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary via-primary/90 to-primary/80 flex items-center justify-center">
        <div className="text-white text-xl">게임을 불러오는 중...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary/90 to-primary/80">
      <div className="p-4 flex items-center justify-between text-white">
        <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
          <ArrowLeft className="w-5 h-5" />
          <span>홈으로</span>
        </Link>
        <div className="flex items-center space-x-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                <HelpCircle className="w-4 h-4 mr-2" />
                도움말
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>경제 이슈 룰렛 게임 방법</DialogTitle>
                <DialogDescription className="space-y-2 text-left">
                  <p>1. 룰렛을 돌려 경제 분야를 선택하세요</p>
                  <p>2. 선택된 분야의 퀴즈 문제를 풀어보세요</p>
                  <p>3. 15초 안에 정답을 선택해야 합니다</p>
                  <p>4. 정답을 맞히면 해당 분야 뱃지 진척도가 올라갑니다</p>
                  <p>5. 여러 번 플레이하여 모든 분야의 뱃지를 획득해보세요!</p>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/10"
            onClick={() => setShowBadgeModal(true)}
          >
            <Trophy className="w-4 h-4 mr-2" />
            뱃지
          </Button>
        </div>
      </div>

      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div aria-live="polite" className="sr-only" id="roulette-live">
          {isSpinning ? "룰렛을 돌리는 중…" : selectedSector ? `${selectedSector.name} 섹터가 선택되었습니다.` : ""}
        </div>

        {gameState === "intro" && (
          <Card className="max-w-md mx-auto text-center">
            <CardHeader>
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center">
                <span className="text-2xl">🎡</span>
              </div>
              <CardTitle className="text-2xl">경제 이슈 룰렛</CardTitle>
              <CardDescription>룰렛을 돌려 나온 주제로 퀴즈를 풀어보세요. 매번 다른 재미!</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                <Timer className="w-4 h-4" />
                <span>2-3분</span>
              </div>
              <Button onClick={startGame} className="w-full" size="lg">
                게임 시작
              </Button>
            </CardContent>
          </Card>
        )}

        {(gameState === "spinning" || gameState === "quiz" || gameState === "result") && (
          <div className="space-y-8">
            <div className="text-center">
              <RouletteWheel />
              {gameState === "spinning" && (
                <div className="mt-8 space-y-4">
                  <Button
                    id="spin-button"
                    onClick={spinRoulette}
                    disabled={isSpinning}
                    className="bg-white text-primary hover:bg-white/90 min-h-[44px] min-w-[120px]"
                    size="lg"
                  >
                    {isSpinning ? "돌리는 중..." : "Spin!"}
                  </Button>
                  {selectedSector && highlightIndex !== null && (
                    <div className="animate-fade-in">
                      <Badge className="text-white px-4 py-2 text-lg" style={{ backgroundColor: selectedSector.color }}>
                        선택: {selectedSector.name}
                      </Badge>
                    </div>
                  )}
                </div>
              )}
            </div>

            {(gameState === "quiz" || gameState === "result") && selectedSector && <QuizQuestion />}

            {gameState === "result" && (
              <div className="text-center">
                <Button onClick={resetGame} className="bg-white text-primary hover:bg-white/90" size="lg">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  다시 돌리기
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      <BadgeModal />

      <GameCountdown isActive={showCountdown} onComplete={handleCountdownComplete} autoFocusTargetId="spin-button" />
    </div>
  )
}
