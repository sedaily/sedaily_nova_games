"use client"

import type React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { toast } from "@/hooks/use-toast"
import {
  Target,
  HelpCircle,
  Lightbulb,
  Calendar,
  ArrowLeft,
  AlertCircle,
  ExternalLink,
  BookOpen,
  Share2,
} from "lucide-react"
import Link from "next/link"

// Game states
type GameState = "idle" | "startPanel" | "counting" | "typing" | "submitted" | "judged" | "win" | "lose"

// Cell states for Wordle-style feedback
type CellState = "empty" | "filled" | "correct" | "present" | "absent"

interface Cell {
  letter: string
  state: CellState
}

interface QuizData {
  id: string
  title: string
  prompt: string
  hint: string[]
  answer: string
  maxAttempts: number
  sources: Array<{ title: string; url: string }>
  meta: { avgClearRate: number; avgTries: number }
}

interface GameData {
  attempts: Cell[][]
  currentAttempt: number
  currentInput: string
  isComposing: boolean
  hintsUsed: number
}

export default function EconQuizPage() {
  const [gameState, setGameState] = useState<GameState>("startPanel")
  const [showHelp, setShowHelp] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [showSources, setShowSources] = useState(false)
  const [countdown, setCountdown] = useState(3)
  const [quizData, setQuizData] = useState<QuizData | null>(null)
  const [gameData, setGameData] = useState<GameData>({
    attempts: [],
    currentAttempt: 0,
    currentInput: "",
    isComposing: false,
    hintsUsed: 0,
  })

  const hiddenInputRef = useRef<HTMLInputElement>(null)
  const isComposingRef = useRef(false)

  useEffect(() => {
    const loadQuizData = async () => {
      try {
        const response = await fetch("/api/games/econ-quiz/today")
        if (response.ok) {
          const data = await response.json()
          setQuizData(data)
        } else {
          throw new Error("API not available")
        }
      } catch {
        try {
          const response = await fetch("/econ-quiz-today.json")
          const data = await response.json()
          setQuizData(data)
        } catch (error) {
          console.error("Failed to load quiz data:", error)
          toast({
            title: "데이터 로드 실패",
            description: "퀴즈 데이터를 불러올 수 없습니다.",
            variant: "destructive",
          })
        }
      }
    }
    loadQuizData()
  }, [])

  useEffect(() => {
    if (quizData) {
      const answerLength = quizData.answer.length
      const emptyGrid = Array(quizData.maxAttempts)
        .fill(null)
        .map(() =>
          Array(answerLength)
            .fill(null)
            .map(() => ({ letter: "", state: "empty" as CellState })),
        )
      setGameData((prev) => ({ ...prev, attempts: emptyGrid }))
    }
  }, [quizData])

  useEffect(() => {
    if (gameState === "typing" && hiddenInputRef.current) {
      hiddenInputRef.current.focus()
    }
  }, [gameState])

  const handleGridClick = useCallback(() => {
    if (gameState === "typing" && hiddenInputRef.current) {
      hiddenInputRef.current.focus()
    }
  }, [gameState])

  const startGame = useCallback(() => {
    setCountdown(3)
    setGameState("counting")
  }, [])

  const evaluateGuess = useCallback(
    (guess: string) => {
      if (!quizData) return []

      const answer = quizData.answer
      const answerChars = answer.split("")
      const guessChars = guess.split("")

      // Initialize result with default Cell objects to avoid undefined
      const result: Cell[] = guessChars.map((char) => ({
        letter: char ?? "",
        state: "empty",
      }))

      const used = new Array(answer.length).fill(false)
      for (let i = 0; i < guessChars.length; i++) {
        if (guessChars[i] === answerChars[i]) {
          result[i] = { letter: guessChars[i] ?? "", state: "correct" }
          used[i] = true
        } else {
          result[i] = { letter: guessChars[i] ?? "", state: "absent" }
        }
      }

      for (let i = 0; i < guessChars.length; i++) {
        if (result[i]?.state !== "absent") continue;
        for (let j = 0; j < answerChars.length; j++) {
          if (!used[j] && guessChars[i] === answerChars[j]) {
            result[i]!.state = "present"
            used[j] = true
            break
          }
        }
      }

      return result
    },
    [quizData],
  )

  const submitGuess = useCallback(() => {
    if (!quizData || gameData.isComposing || gameData.currentInput.length !== quizData.answer.length) {
      return
    }

    const evaluatedRow = evaluateGuess(gameData.currentInput)
    const newAttempts = [...gameData.attempts]
    newAttempts[gameData.currentAttempt] = evaluatedRow

    const isWin = evaluatedRow.every((cell) => cell.state === "correct")
    const isLose = gameData.currentAttempt >= quizData.maxAttempts - 1 && !isWin

    setGameData((prev) => ({
      ...prev,
      attempts: newAttempts,
      currentAttempt: prev.currentAttempt + 1,
      currentInput: "",
    }))

    setGameState("submitted")

    console.log("[v0] quiz_submit", { attempt: gameData.currentAttempt + 1, guess: gameData.currentInput })

    setTimeout(() => {
      if (isWin) {
        setGameState("win")
        console.log("[v0] quiz_win", { attempts: gameData.currentAttempt + 1 })
        toast({
          title: "축하합니다! 🎉",
          description: `정답을 맞히셨습니다: ${quizData.answer}`,
        })
      } else if (isLose) {
        setGameState("lose")
        console.log("[v0] quiz_lose", { attempts: gameData.currentAttempt + 1 })
        toast({
          title: "아쉽네요 😔",
          description: `정답은 "${quizData.answer}"였습니다.`,
        })
      } else {
        setGameState("typing")
      }
    }, 1500)
  }, [gameData, evaluateGuess, quizData])

  const handleInputChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      if (!quizData || gameState !== "typing" || isComposingRef.current) return
      const el = e.currentTarget as HTMLInputElement
      if (!el.value) return
      const add = sanitizeHangul(el.value)
      if (add) {
        setGameData((prev) => ({
          ...prev,
          currentInput: (prev.currentInput + add).slice(0, quizData.answer.length),
        }))
      }
      el.value = ""
    },
    [gameState, quizData],
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!quizData || gameState !== "typing") return

      if (e.key === "Enter" && !isComposingRef.current) {
        e.preventDefault()
        if (gameData.currentInput.length === quizData.answer.length) {
          submitGuess()
        }
      } else if (e.key === "Backspace" && !isComposingRef.current) {
        e.preventDefault()
        setGameData((prev) => ({ ...prev, currentInput: prev.currentInput.slice(0, -1) }))
      }
    },
    [gameState, gameData.currentInput.length, quizData, submitGuess],
  )

  const handleCompositionStart = useCallback(() => {
    isComposingRef.current = true
  }, [])

  const handleCompositionEnd = useCallback(
    (e: React.CompositionEvent<HTMLInputElement>) => {
      if (!quizData) return
      isComposingRef.current = false
      const commit = sanitizeHangul(e.data || "")
      if (!commit) return
      setGameData((prev) => ({
        ...prev,
        currentInput: (prev.currentInput + commit).slice(0, quizData.answer.length),
      }))
      if (hiddenInputRef.current) hiddenInputRef.current.value = ""
    },
    [quizData],
  )

  const handleBeforeInput = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      if (!quizData || gameState !== "typing" || isComposingRef.current) return
      const inputEvent = e.nativeEvent as InputEvent
      const it = inputEvent?.inputType
      if (it === "deleteContentBackward") {
        e.preventDefault?.()
        setGameData((prev) => ({ ...prev, currentInput: prev.currentInput.slice(0, -1) }))
      }
    },
    [quizData, gameState],
  )

  const openHint = useCallback(() => {
    if (!quizData || gameData.hintsUsed >= 3) return

    setShowHint(true)
    setGameData((prev) => ({ ...prev, hintsUsed: prev.hintsUsed + 1 }))
    console.log("[v0] hint_open", { step: gameData.hintsUsed + 1 })
  }, [gameData.hintsUsed, quizData])

  const shareResult = useCallback(() => {
    console.log("Share result functionality not implemented yet")
  }, [])

  const getCellClassName = (cell: Cell, isCurrentRow: boolean, colIndex: number) => {
    const baseClasses =
      "w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 border-2 rounded-lg flex items-center justify-center text-sm sm:text-base md:text-lg font-bold transition-all duration-350"

    if (cell.state === "correct") {
      return `${baseClasses} bg-[#005CE6] text-white border-[#005CE6] animate-flip`
    } else if (cell.state === "present") {
      return `${baseClasses} bg-[#F59E0B] text-white border-[#F59E0B] animate-flip`
    } else if (cell.state === "absent") {
      return `${baseClasses} bg-[#9CA3AF] text-white border-[#9CA3AF] animate-flip`
    } else if (cell.state === "filled") {
      return `${baseClasses} border-gray-400 bg-gray-50`
    } else if (isCurrentRow && colIndex < gameData.currentInput.length) {
      return `${baseClasses} border-[#005CE6] bg-[#005CE6]/5`
    } else {
      return `${baseClasses} border-gray-200 bg-white`
    }
  }

  const sanitizeHangul = (s: string) => s.replace(/[^\uAC00-\uD7A3]/g, "")

  useEffect(() => {
    if (gameState !== "counting") return
    setCountdown(3)
    const t = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(t)
          setGameState("typing")
          requestAnimationFrame(() => hiddenInputRef.current?.focus())
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(t)
  }, [gameState])

  if (!quizData) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#005CE6] mx-auto mb-4"></div>
          <p className="text-[#6B7280]">퀴즈를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
        <div className="container mx-auto max-w-4xl px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div className="flex items-center space-x-3">
                <Target className="w-6 h-6 text-[#005CE6]" />
                <div>
                  <h1 className="text-lg font-bold text-[#111827]">{quizData.title}</h1>
                  <div className="flex items-center text-sm text-[#6B7280]">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date().toLocaleDateString("ko-KR")}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSources(true)}
                className="focus-ring"
                aria-label="출처 보기"
              >
                <BookOpen className="w-5 h-5" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={openHint}
                disabled={gameData.hintsUsed >= 3 || gameState === "startPanel"}
                className="focus-ring"
                aria-label={`힌트 (${gameData.hintsUsed}/3)`}
              >
                <Lightbulb className="w-5 h-5" />
                <span className="ml-1 text-xs">{gameData.hintsUsed}/3</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowHelp(true)}
                className="focus-ring"
                aria-label="도움말"
              >
                <HelpCircle className="w-5 h-5" />
              </Button>
            </div>
          </div>

          <div className="mt-4 p-4 bg-gradient-to-r from-[#005CE6]/5 to-[#3B89FF]/5 rounded-lg border border-[#005CE6]/10">
            <p className="text-[#111827] font-medium text-center">{quizData.prompt}</p>
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-4xl px-4 py-8">
        {gameState === "startPanel" && (
          <div className="flex items-center justify-center min-h-[60vh]">
            <Card className="w-full max-w-md mx-auto shadow-lg">
              <CardHeader className="text-center pb-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#005CE6]/20 to-[#3B89FF]/10 flex items-center justify-center">
                  <Target className="w-8 h-8 text-[#005CE6]" />
                </div>
                <CardTitle className="text-2xl font-bold mb-2 text-[#111827]">{quizData.title}</CardTitle>
                <Badge variant="secondary" className="mb-4">
                  인기
                </Badge>

                <div className="p-4 bg-gradient-to-r from-[#005CE6]/5 to-[#3B89FF]/5 rounded-lg border border-[#005CE6]/10 mb-4">
                  <p className="text-[#111827] font-medium">{quizData.prompt}</p>
                </div>

                <CardDescription className="text-base leading-relaxed text-[#6B7280]">
                  Wordle 스타일로 경제 용어를 맞혀보세요. 힌트를 통해 단계별로 학습할 수 있습니다.
                </CardDescription>
                <div className="flex items-center justify-center text-sm text-[#6B7280] mt-4">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  3-5분
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-center space-x-4 mb-4">
                  <Button variant="ghost" size="sm" onClick={() => setShowSources(true)} className="focus-ring">
                    <BookOpen className="w-4 h-4 mr-1" />
                    출처
                  </Button>
                  <Button variant="ghost" size="sm" onClick={openHint} className="focus-ring">
                    <Lightbulb className="w-4 h-4 mr-1" />
                    힌트 열기
                  </Button>
                </div>

                <div className="text-sm text-[#6B7280] space-y-2">
                  <p>• 음절 단위로 채점됩니다</p>
                  <p>• 최대 {quizData.maxAttempts}회 시도 가능</p>
                  <p>• 힌트는 3회까지 사용 가능</p>
                </div>
                <div className="flex flex-col space-y-3">
                  <Button onClick={startGame} className="w-full focus-ring bg-[#005CE6] hover:bg-[#005CE6]/90">
                    바로 시작
                  </Button>
                  <Button variant="outline" onClick={() => setShowHelp(true)} className="w-full focus-ring">
                    도움말 보기
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {gameState === "counting" && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div
              className="text-8xl font-bold text-white animate-pulse"
              style={{
                animation: "scale-fade 0.8s ease-out",
                transform: countdown === 0 ? "scale(0)" : "scale(1)",
              }}
            >
              {countdown || "시작!"}
            </div>
          </div>
        )}

        {(gameState === "typing" || gameState === "submitted" || gameState === "win" || gameState === "lose") && (
          <div className="space-y-8">
            <div className="flex justify-center">
              <div
                className="grid gap-2 cursor-pointer"
                style={{ gridTemplateRows: `repeat(${quizData.maxAttempts}, 1fr)` }}
                onClick={handleGridClick}
              >
                {gameData.attempts.map((row, rowIndex) => (
                  <div
                    key={rowIndex}
                    className="flex gap-2"
                    style={{
                      animation:
                        gameState === "submitted" && rowIndex === gameData.currentAttempt - 1
                          ? "shake 0.3s ease-in-out"
                          : undefined,
                    }}
                  >
                    {row.map((cell, colIndex) => (
                      <div
                        key={colIndex}
                        className={getCellClassName(
                          cell,
                          rowIndex === gameData.currentAttempt && gameState === "typing",
                          colIndex,
                        )}
                      >
                        {cell.letter ||
                          (rowIndex === gameData.currentAttempt &&
                          gameState === "typing" &&
                          colIndex < gameData.currentInput.length
                            ? gameData.currentInput[colIndex]
                            : "")}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center">
              <div role="status" aria-live="polite" className="text-lg font-medium text-[#111827]">
                {gameState === "typing" && `${gameData.currentAttempt + 1}/${quizData.maxAttempts}번째 시도`}
                {gameState === "submitted" && "채점 중..."}
                {gameState === "win" && "🎉 정답입니다!"}
                {gameState === "lose" && `😔 정답: ${quizData.answer}`}
              </div>
            </div>

            {(gameState === "win" || gameState === "lose") && (
              <div className="flex justify-center space-x-4">
                <Button onClick={() => setShowSources(true)} className="focus-ring">
                  <BookOpen className="w-4 h-4 mr-2" />
                  출처 보기
                </Button>
                <Button onClick={() => setShowHint(true)} className="focus-ring">
                  <Lightbulb className="w-4 h-4 mr-2" />
                  힌트 열기
                </Button>
                <Button onClick={() => setShowHelp(true)} className="focus-ring">
                  <HelpCircle className="w-4 h-4 mr-2" />
                  도움말 보기
                </Button>
                <Button onClick={shareResult} className="focus-ring">
                  <Share2 className="w-4 h-4 mr-2" />
                  결과 공유
                </Button>
                <Button variant="outline" asChild className="focus-ring bg-transparent">
                  <Link href="/">홈으로</Link>
                </Button>
              </div>
            )}
          </div>
        )}

        <input
          ref={hiddenInputRef}
          type="text"
          defaultValue=""
          onInput={handleInputChange}
          onKeyDown={handleKeyDown}
          onBeforeInput={handleBeforeInput}
          onCompositionStart={handleCompositionStart}
          onCompositionEnd={handleCompositionEnd}
          aria-label="정답 입력"
          inputMode="text"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          className="fixed bottom-4 left-1/2 -translate-x-1/2 h-12 w-[280px] opacity-0"
          tabIndex={gameState === "typing" ? 0 : -1}
          onBlur={() => {
            if (gameState === "typing") requestAnimationFrame(() => hiddenInputRef.current?.focus())
          }}
        />
      </main>

      <Dialog open={showHelp} onOpenChange={setShowHelp}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <HelpCircle className="w-5 h-5 mr-2" />
              게임 방법
            </DialogTitle>
            <DialogDescription>Wordle 스타일의 경제 용어 맞히기 게임입니다.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">규칙</h4>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>• 경제 용어를 음절 단위로 입력하세요</li>
                <li>• 최대 {quizData.maxAttempts}번까지 시도할 수 있습니다</li>
                <li>• 각 시도 후 색상으로 힌트를 제공합니다</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">색상 의미</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-[#005CE6] rounded border"></div>
                  <span className="text-sm">정확한 위치의 올바른 글자</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-[#F59E0B] rounded border"></div>
                  <span className="text-sm">다른 위치에 있는 올바른 글자</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-[#9CA3AF] rounded border"></div>
                  <span className="text-sm">정답에 없는 글자</span>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Sheet open={showHint} onOpenChange={setShowHint}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle className="flex items-center">
              <Lightbulb className="w-5 h-5 mr-2" />
              힌트 ({gameData.hintsUsed}/3)
            </SheetTitle>
            <SheetDescription>단계별 힌트로 정답에 가까워지세요.</SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            {gameData.hintsUsed >= 1 && (
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">힌트 1</h4>
                <p className="text-blue-800">{quizData.hint[0]}</p>
              </div>
            )}
            {gameData.hintsUsed >= 2 && (
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-2">힌트 2</h4>
                <p className="text-green-800">{quizData.hint[1]}</p>
              </div>
            )}
            {gameData.hintsUsed >= 3 && (
              <div className="p-4 bg-purple-50 rounded-lg">
                <h4 className="font-semibold text-purple-900 mb-2">힌트 3</h4>
                <p className="text-purple-800">{quizData.hint[2]}</p>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>

      <Sheet open={showSources} onOpenChange={setShowSources}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle className="flex items-center">
              <BookOpen className="w-5 h-5 mr-2" />
              관련 기사
            </SheetTitle>
            <SheetDescription>이 문제와 관련된 서울경제 기사들입니다.</SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            {quizData.sources.map((source, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-[#111827] mb-2">{source.title}</h4>
                    <Button variant="outline" size="sm" asChild className="focus-ring bg-transparent">
                      <a href={source.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4 mr-1" />
                        기사 읽기
                      </a>
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </SheetContent>
      </Sheet>

      <style jsx>{`
        @keyframes flip {
          0% { transform: rotateX(0); }
          50% { transform: rotateX(-90deg); }
          100% { transform: rotateX(0); }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        @keyframes scale-fade {
          0% { transform: scale(0.5); opacity: 0; }
          50% { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        
        .animate-flip {
          animation: flip 0.35s ease-in-out;
        }
        
        @media (prefers-reduced-motion: reduce) {
          .animate-flip {
            animation: none;
          }
          
          [style*="animation"] {
            animation-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  )
}
