"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ArrowLeft, HelpCircle, Target, Trophy, RotateCcw, Sparkles } from "lucide-react"
import Link from "next/link"
import { GameCountdown } from "@/components/game-countdown"

interface BingoIssue {
  id: number
  text: string
  correct: boolean
}

interface BingoCellProps {
  issue: BingoIssue
  isSelected: boolean
  state: "default" | "selected" | "success" | "failed" | "free"
  onClick: () => void
  isFree?: boolean
}

function BingoCell({ issue, isSelected, state, onClick, isFree = false }: BingoCellProps) {
  void isSelected
  const getStateClasses = () => {
    switch (state) {
      case "selected":
        return "bg-primary text-primary-foreground border-primary shadow-md"
      case "success":
        return "bg-green-500 text-white border-green-500 shadow-md"
      case "failed":
        return "bg-red-500 text-white border-red-500 shadow-md"
      case "free":
        return "bg-teal-500 text-white border-teal-500 shadow-md"
      default:
        return "bg-white text-foreground border-gray-200 hover:border-primary/50 hover:shadow-sm"
    }
  }

  return (
    <button
      onClick={onClick}
      disabled={isFree}
      className={`
        aspect-square p-2 rounded-lg border-2 transition-all duration-200 text-xs font-medium
        flex items-center justify-center text-center leading-tight
        ${getStateClasses()}
        ${!isFree ? "hover:scale-105 active:scale-95 cursor-pointer" : "cursor-default"}
        focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2
      `}
    >
      {isFree ? "★ FREE ★" : issue.text}
    </button>
  )
}

interface BingoBoardProps {
  issues: BingoIssue[]
  selectedIds: number[]
  gameState: "playing" | "results"
  onCellClick: (id: number) => void
}

function BingoBoard({ issues, selectedIds, gameState, onCellClick }: BingoBoardProps) {
  const getCellState = (issue: BingoIssue): "default" | "selected" | "success" | "failed" | "free" => {
    if (issue.text === "FREE") return "free"
    if (gameState === "results" && selectedIds.includes(issue.id)) {
      return issue.correct ? "success" : "failed"
    }
    if (selectedIds.includes(issue.id)) return "selected"
    return "default"
  }

  const safeIssues = (issues ?? []).filter((i): i is BingoIssue => Boolean(i && typeof (i as BingoIssue).id === 'number'))
  if (safeIssues.length < 25) {
    return (
      <div className="grid grid-cols-5 gap-2 max-w-md mx-auto">
        <div className="col-span-5 text-center text-muted-foreground py-8">게임 데이터를 불러오는 중...</div>
      </div>
    )
  }

  return (
    <div id="bingo-board-root" className="grid grid-cols-5 gap-2 max-w-md mx-auto" tabIndex={-1}>
      {safeIssues.map((issue, idx) => (
        <BingoCell
          key={issue?.id ?? `cell-${idx}`}
          issue={issue}
          isSelected={selectedIds.includes(issue.id)}
          state={getCellState(issue)}
          onClick={() => onCellClick(issue.id)}
          isFree={issue.text === "FREE"}
        />
      ))}
    </div>
  )
}

interface ResultPanelProps {
  selectedIds: number[]
  issues: BingoIssue[]
  bingoLines: number
}

function ResultPanel({ selectedIds, issues, bingoLines }: ResultPanelProps) {
  const correctPredictions = selectedIds.filter((id) => {
    const issue = issues.find((i) => i.id === id)
    return issue?.correct
  }).length

  return (
    <Card className="mt-8 bg-gradient-to-br from-blue-50 to-indigo-50 border-primary/20">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          예측 결과
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="bg-white/80 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-600">{correctPredictions}/9</div>
            <div className="text-sm text-muted-foreground">맞힌 예측</div>
          </div>
          <div className="bg-white/80 rounded-lg p-4">
            <div className="text-2xl font-bold text-primary">{bingoLines}</div>
            <div className="text-sm text-muted-foreground">빙고 라인</div>
          </div>
        </div>

        {bingoLines > 0 && (
          <div className="text-center p-4 bg-yellow-100 rounded-lg">
            <div className="text-lg font-bold text-yellow-800">🎉 빙고 달성!</div>
            <div className="text-sm text-yellow-700">{bingoLines}개 라인을 완성했습니다!</div>
          </div>
        )}

        <div className="text-center text-sm text-muted-foreground">
          <p>전체 참여자 평균: 6.2/9개 적중</p>
          <p>오늘 가장 많이 선택된 이슈: &quot;코스피 2600선 돌파&quot;</p>
        </div>
      </CardContent>
    </Card>
  )
}

export default function NewsBingoGame() {
  const [gamePhase, setGamePhase] = useState<"start" | "playing" | "results">("start")
  const [showCountdown, setShowCountdown] = useState(false)
  const [issues, setIssues] = useState<BingoIssue[]>([])
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [gameState, setGameState] = useState<"playing" | "results">("playing")
  const [bingoLines, setBingoLines] = useState(0)

  useEffect(() => {
    fetch("/news-bingo-data.json")
      .then((res) => res.json())
      .then((data) => {
        // Filter out FREE from pool and ensure we have enough items
        const pool = data.issues.filter((issue: BingoIssue) => issue.text !== "FREE")

        // Shuffle the pool
        for (let i = pool.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1))
          ;[pool[i], pool[j]] = [pool[j], pool[i]]
        }

        // Find or create FREE cell
        const freeCell = data.issues.find((issue: BingoIssue) => issue.text === "FREE") ?? {
          id: 13,
          text: "FREE",
          correct: true,
        }

        // Arrange: 12 items + FREE + 12 items = 25 total
        const arranged = [...pool.slice(0, 12), freeCell, ...pool.slice(12, 24)]

        // Ensure exactly 25 cells and filter out any undefined values
        const safeIssues = arranged.slice(0, 25).filter(Boolean)
        if (safeIssues.length === 25) {
          setIssues(safeIssues)
        } else {
          throw new Error("Insufficient data for 25-cell grid")
        }
      })
      .catch((err) => {
        console.error("Failed to load bingo data:", err)
        const fallbackPool = [
          { id: 1, text: "코스피 2600선 돌파", correct: true },
          { id: 2, text: "원달러 환율 1350원 하회", correct: false },
          { id: 3, text: "국채 금리 상승", correct: true },
          { id: 4, text: "기업부채 증가", correct: false },
          { id: 5, text: "소비자 신뢰 회복", correct: true },
          { id: 6, text: "외국인 투자 감소", correct: false },
          { id: 7, text: "산업 혁신 가속화", correct: true },
          { id: 8, text: "고용률 하락", correct: false },
          { id: 9, text: "소비자 물가 상승", correct: true },
          { id: 10, text: "정부 재정 개선", correct: false },
          { id: 11, text: "기술 혁신 지원", correct: true },
          { id: 12, text: "금융 시장 안정화", correct: false },
          { id: 14, text: "해외 경제 전망 개선", correct: true },
          { id: 15, text: "국내 경제 성장", correct: false },
          { id: 16, text: "기업 이자율 감소", correct: true },
          { id: 17, text: "소비자 소비 늘어남", correct: false },
          { id: 18, text: "국제 경제 협력 강화", correct: true },
          { id: 19, text: "산업 생산성 향상", correct: false },
          { id: 20, text: "국내 투자 환경 개선", correct: true },
          { id: 21, text: "소비자 신용 점수 상승", correct: false },
          { id: 22, text: "기술 기업 성장", correct: true },
          { id: 23, text: "국제 경제 위기 해소", correct: false },
          { id: 24, text: "소비자 소비력 강화", correct: true },
          { id: 25, text: "디지털 경제 확산", correct: true },
        ]

        const freeCell = { id: 13, text: "FREE", correct: true }
        const arranged = [...fallbackPool.slice(0, 12), freeCell, ...fallbackPool.slice(12, 24)]

        setIssues(arranged)
      })
  }, [])

  const handleStartGame = () => {
    setShowCountdown(true)
  }

  const handleCellClick = (id: number) => {
    if (gameState === "results") return

    const issue = issues.find((i) => i.id === id)
    if (!issue || issue.text === "FREE") return

    if (selectedIds.includes(id)) {
      setSelectedIds((prev) => prev.filter((selectedId) => selectedId !== id))
    } else if (selectedIds.length < 9) {
      setSelectedIds((prev) => [...prev, id])
    } else {
      // TODO: Add proper toast notification system
      console.log("최대 9개까지만 선택할 수 있습니다.")
    }
  }

  const checkBingoLines = (selectedIds: number[]): number => {
  const grid: boolean[][] = Array.from({ length: 5 }, () => Array(5).fill(false))

    selectedIds.forEach((id) => {
      const index = issues.findIndex((issue) => issue.id === id)
      if (index !== -1) {
        const row = Math.floor(index / 5)
        const col = index % 5
        const issue = issues[index]
        if (issue && (issue.correct || issue.text === 'FREE')) {
          grid[row]![col] = true
        }
      }
    })

    grid[2]![2] = true

    let lines = 0

    for (let row = 0; row < 5; row++) {
      if (grid[row] && grid[row]!.every((cell) => cell)) lines++
    }

    for (let col = 0; col < 5; col++) {
      if (grid.every((row) => row && row![col])) lines++
    }

  if (grid[0]![0] && grid[1]![1] && grid[2]![2] && grid[3]![3] && grid[4]![4]) lines++
  if (grid[0]![4] && grid[1]![3] && grid[2]![2] && grid[3]![1] && grid[4]![0]) lines++

    return lines
  }

  const handleSubmitPredictions = () => {
    setGameState("results")
    const lines = checkBingoLines(selectedIds)
    setBingoLines(lines)
  }

  const handleRestart = () => {
    setGamePhase("start")
    setSelectedIds([])
    setGameState("playing")
    setBingoLines(0)
    setShowCountdown(false)
  }

  if (gamePhase === "start") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5"></div>

        <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm shadow-2xl border-0">
          <CardHeader className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Target className="w-8 h-8 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900">경제 뉴스 빙고</CardTitle>
              <Badge variant="secondary" className="mt-2">
                인기
              </Badge>
            </div>
            <CardDescription className="text-base leading-relaxed">
              💡 오늘 발생할 것 같은 경제 이슈 9개를 선택해주세요! 오후에 결과가 공개됩니다.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="flex items-center justify-center text-sm text-muted-foreground">
              <span>⏱️ 3-4분</span>
            </div>

            <div className="space-y-3">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full bg-transparent">
                    <HelpCircle className="w-4 h-4 mr-2" />
                    도움말
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>게임 규칙</DialogTitle>
                    <div className="text-muted-foreground text-sm space-y-3 text-left">
                      <div>1. 5×5 빙고판에서 오늘 일어날 것 같은 경제 이슈 9개를 선택하세요.</div>
                      <div>2. 중앙의 FREE 칸은 항상 맞은 것으로 처리됩니다.</div>
                      <div>3. 예측을 제출하면 실제 결과와 비교하여 정답을 확인합니다.</div>
                      <div>4. 가로, 세로, 대각선으로 5개가 연결되면 빙고 달성!</div>
                    </div>
                  </DialogHeader>
                </DialogContent>
              </Dialog>

              <Button
                onClick={handleStartGame}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                게임 시작
              </Button>
            </div>
          </CardContent>
        </Card>

        <Link href="/" className="absolute top-4 left-4">
          <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
            <ArrowLeft className="w-4 h-4 mr-2" />
            홈으로
          </Button>
        </Link>

        {/* Countdown Overlay */}
        <GameCountdown
          isActive={showCountdown}
          onComplete={() => {
            setShowCountdown(false)
            setGamePhase("playing")
          }}
          autoFocusTargetId="bingo-board-root"
        />
      </div>
    )
  }

  if (gamePhase === "playing") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 p-4">
        <div className="container mx-auto max-w-2xl">
          <div className="flex items-center justify-between mb-6">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                <ArrowLeft className="w-4 h-4 mr-2" />
                홈으로
              </Button>
            </Link>

            <div className="text-center">
              <h1 className="text-2xl font-bold text-white">경제 뉴스 빙고</h1>
              {gameState === "playing" && (
                <div className="text-white/90 text-sm mt-1">선택 {selectedIds.length}/9개</div>
              )}
            </div>

            <Button variant="ghost" size="sm" onClick={handleRestart} className="text-white hover:bg-white/20">
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>

          <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-0">
            <CardContent className="p-6">
              {gameState === "playing" && (
                <div className="mb-6 p-4 bg-blue-50 rounded-lg text-center">
                  <p className="text-sm text-blue-800">💡 오늘 발생할 것 같은 경제 이슈 9개를 선택해주세요!</p>
                </div>
              )}

              <BingoBoard
                issues={issues}
                selectedIds={selectedIds}
                gameState={gameState}
                onCellClick={handleCellClick}
              />

              {gameState === "playing" && (
                <div className="mt-6 text-center">
                  <Button
                    onClick={handleSubmitPredictions}
                    disabled={selectedIds.length !== 9}
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50"
                  >
                    예측 제출 ({selectedIds.length}/9)
                  </Button>
                </div>
              )}

              {gameState === "results" && (
                <ResultPanel selectedIds={selectedIds} issues={issues} bingoLines={bingoLines} />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }
}
