"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, HelpCircle, User, Bot, Clock, Trophy, RotateCcw, Lightbulb } from "lucide-react"
import Link from "next/link"
import { GameCountdown } from "@/components/game-countdown"

type GameState = "start" | "playing" | "gameOver"
type Turn = "player" | "ai"

interface WordEntry {
  word: string
  player: "player" | "ai"
  timestamp: number
}

interface GameData {
  startWord: string
  terms: string[]
  definitions: Record<string, string>
}

const FALLBACK_DATA: GameData = {
  startWord: "국채",
  terms: [
    "국채",
    "채권",
    "권리",
    "리스크",
    "크레딧",
    "트랜치",
    "ETF",
    "펀드",
    "드라이브",
    "브랜드",
    "드론",
    "론칭",
    "칭찬",
    "찬스",
    "스타트업",
    "업계",
    "계약",
    "약정",
    "정부",
    "부채",
    "채무",
    "무역",
    "역할",
    "할인",
    "인플레이션",
    "션",
    "온라인",
    "인터넷",
    "넷플릭스",
    "스트리밍",
    "밍크",
    "크립토",
    "토큰",
    "큰손",
    "손실",
    "실업",
    "업종",
    "종목",
    "목표",
    "표준",
    "준비",
    "비용",
    "용도",
    "도매",
    "매출",
    "출자",
    "자본",
    "본사",
    "사업",
    "업무",
    "무료",
    "료금",
    "금리",
    "리더",
    "더미",
    "미래",
    "래퍼",
    "퍼센트",
    "트렌드",
    "드림",
    "림잡",
    "잡코리아",
    "아시아",
    "시아버지",
    "지분",
    "분석",
    "석유",
    "유가",
    "가격",
    "격차",
    "차익",
    "익스포트",
    "트레이딩",
    "딩동",
    "동향",
    "향후",
    "후보",
    "보험",
    "험난",
    "난관",
    "관세",
    "세금",
    "금융",
    "융자",
    "자금",
    "금고",
    "고객",
    "객단가",
    "가치",
    "치솟다",
    "다운",
    "운영",
    "영업",
    "업체",
    "체크",
    "크기",
    "기업",
    "업계",
    "계획",
    "획득",
    "득점",
    "점유",
    "유통",
    "통계",
    "계산",
    "산업",
    "업종",
    "종합",
    "합병",
    "병원",
    "원가",
    "가공",
    "공급",
    "급여",
    "여유",
    "유동",
    "동결",
    "결제",
    "제품",
    "품질",
    "질문",
    "문제",
    "제조",
    "조달",
    "달러",
    "러시아",
    "아웃",
    "웃돈",
    "돈세탁",
    "탁월",
    "월급",
    "급락",
    "낙관",
    "관리",
    "리베이트",
    "트럭",
    "럭셔리",
    "리스",
    "스케일",
    "일자리",
    "리더십",
    "십억",
    "억대",
    "대출",
    "출시",
    "시장",
    "장기",
    "기간",
    "간접",
    "접촉",
    "촉진",
    "진출",
    "출구",
    "구매",
    "매니저",
    "저축",
    "축소",
    "소비",
    "비즈니스",
    "스마트",
    "트위터",
    "터미널",
    "널리",
    "리포트",
    "트레이더",
    "더블",
    "블록",
    "록펠러",
    "러닝",
    "닝겐",
    "겐지",
    "지출",
    "출장",
    "장점",
    "점검",
    "검토",
    "토론",
    "론칭",
    "칭찬",
    "찬성",
    "성장",
    "장래",
    "래퍼",
    "퍼블릭",
    "릭스",
    "스톡",
    "톡톡",
    "톡방",
    "방문",
    "문화",
    "화폐",
    "폐지",
    "지급",
    "급상승",
    "승인",
    "인수",
    "수익",
    "익명",
    "명목",
    "목적",
    "적자",
    "자산",
    "산출",
    "출자",
    "자회사",
    "사장",
    "장부",
    "부동산",
    "산업",
    "업무",
    "무역",
    "역량",
    "량산",
    "산정",
    "정가",
    "가맹",
    "맹세",
    "세무",
    "무신사",
    "사모",
    "모금",
    "금고",
    "고용",
    "용역",
    "역사",
    "사업",
    "업종",
    "종료",
    "료금",
    "금리",
    "리더",
    "더미",
    "미국",
    "국가",
    "가계",
    "계좌",
    "좌석",
    "석유",
    "유가",
    "가격",
    "격차",
    "차트",
    "트럭",
    "럭셔리",
    "리스크",
  ],
  definitions: {
    국채: "정부가 발행하는 채무 증서",
    채권: "고정 이자 지급을 약속하는 유가증권",
    권리: "법적으로 보장된 이익이나 자격",
    리스크: "투자나 사업에서 발생할 수 있는 위험",
    크레딧: "신용이나 신용도를 의미하는 금융 용어",
    트랜치: "구조화 금융상품의 위험도별 분할 단위",
    ETF: "상장지수펀드, 지수를 추종하는 펀드",
    펀드: "다수 투자자의 자금을 모아 운용하는 금융상품",
  },
}

export default function TermRelayGame() {
  const [gameState, setGameState] = useState<GameState>("start")
  const [currentTurn, setCurrentTurn] = useState<Turn>("player")
  const [wordChain, setWordChain] = useState<WordEntry[]>([])
  const [currentInput, setCurrentInput] = useState("")
  const [gameData, setGameData] = useState<GameData | null>(null)
  const [usedWords, setUsedWords] = useState<Set<string>>(new Set())
  const [errorMessage, setErrorMessage] = useState("")
  const [isAiThinking, setIsAiThinking] = useState(false)
  const [gameResult, setGameResult] = useState<"win" | "lose" | null>(null)
  const [showHelp, setShowHelp] = useState(false)
  const [timeLeft, setTimeLeft] = useState(30)
  const [isComposing, setIsComposing] = useState(false)
  const [showDefinition, setShowDefinition] = useState<string | null>(null)
  const [showCountdown, setShowCountdown] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch("/term-relay-data.json")
        if (!res.ok) throw new Error("not ok")
        const data: GameData = await res.json()
        setGameData(data)
        setUsedWords(new Set([data.startWord]))
    } catch {
        // Fallback to ensure game can always start
        setGameData(FALLBACK_DATA)
        setUsedWords(new Set([FALLBACK_DATA.startWord]))
      }
  })()
  }, [])

  useEffect(() => {
    if (gameState === "playing" && currentTurn === "player" && timeLeft > 0) {
      timerRef.current = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => {
        if (timerRef.current) clearTimeout(timerRef.current)
      }
    } else if (timeLeft === 0 && currentTurn === "player") {
  handleGameOver("lose")
    }
  }, [gameState, currentTurn, timeLeft])

  const handleCountdownComplete = () => {
    setShowCountdown(false)
    setGameState("playing")
    setTimeLeft(30)
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  const handleStartGame = () => {
    setShowCountdown(true)
  }

  const getLastCharacter = (word: string): string => {
    return word.charAt(word.length - 1)
  }

  const getFirstCharacter = (word: string): string => {
    return word.charAt(0)
  }

  const getCurrentLastChar = (): string => {
    if (wordChain.length === 0) {
      return gameData ? getLastCharacter(gameData.startWord) : ""
    }
    const lastEntry = wordChain[wordChain.length - 1]
    return lastEntry ? getLastCharacter(lastEntry.word) : ""
  }

  const validateWord = (word: string): { valid: boolean; message: string } => {
    if (!gameData) return { valid: false, message: "게임 데이터를 불러오는 중입니다." }

    const trimmedWord = word.trim()
    if (!trimmedWord) return { valid: false, message: "단어를 입력해주세요." }

    if (usedWords.has(trimmedWord)) {
      return { valid: false, message: "이미 사용된 단어입니다." }
    }

    if (!gameData.terms.includes(trimmedWord)) {
      return { valid: false, message: "경제 용어 사전에 없는 단어입니다." }
    }

    const expectedFirstChar = getCurrentLastChar()
    if (getFirstCharacter(trimmedWord) !== expectedFirstChar) {
      return { valid: false, message: `'${expectedFirstChar}'로 시작하는 단어를 입력해주세요.` }
    }

    return { valid: true, message: "" }
  }

  const handlePlayerSubmit = () => {
    if (isComposing || currentTurn !== "player") return

    const validation = validateWord(currentInput)
    if (!validation.valid) {
      setErrorMessage(validation.message)
      setTimeout(() => setErrorMessage(""), 3000)
      return
    }

    const newEntry: WordEntry = {
      word: currentInput.trim(),
      player: "player",
      timestamp: Date.now(),
    }

    setWordChain((prev) => [...prev, newEntry])
    setUsedWords((prev) => new Set([...prev, currentInput.trim()]))
    setCurrentInput("")
    setErrorMessage("")
    setCurrentTurn("ai")
    setTimeLeft(30)

    setTimeout(() => {
      handleAiTurn(newEntry.word)
    }, 500)
  }

  const handleAiTurn = (lastWord: string) => {
    if (!gameData) return

    setIsAiThinking(true)

    setTimeout(
      () => {
        const lastChar = getLastCharacter(lastWord)
        // Local correction for usedWords to ensure latest state
        const used = new Set(usedWords)
        used.add(lastWord)
        const availableWords = gameData.terms.filter((term) => getFirstCharacter(term) === lastChar && !used.has(term))

        if (availableWords.length === 0) {
          handleGameOver("win")
          return
        }

        const aiWord = availableWords[Math.floor(Math.random() * availableWords.length)]
        if (!aiWord) {
          handleGameOver("win")
          return
        }

        const aiEntry: WordEntry = {
          word: aiWord,
          player: "ai",
          timestamp: Date.now(),
        }

        setWordChain((prev) => [...prev, aiEntry])
        setUsedWords((prev) => new Set<string>([...Array.from(prev), aiWord]))
        setIsAiThinking(false)
        setCurrentTurn("player")
        setTimeLeft(30)

        if (inputRef.current) {
          inputRef.current.focus()
        }
      },
      1500 + Math.random() * 1000,
    )
  }

  const handleGameOver = (result: "win" | "lose") => {
    setGameResult(result)
    setGameState("gameOver")
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }
  }

  const resetGame = () => {
    setGameState("start")
    setCurrentTurn("player")
    setWordChain([])
    setCurrentInput("")
    setUsedWords(gameData ? new Set([gameData.startWord]) : new Set())
    setErrorMessage("")
    setIsAiThinking(false)
    setGameResult(null)
    setTimeLeft(30)
    setShowCountdown(false)
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isComposing) {
      e.preventDefault()
      handlePlayerSubmit()
    }
  }

  const handleCompositionStart = () => {
    setIsComposing(true)
  }

  const handleCompositionEnd = () => {
    setIsComposing(false)
  }

  if (!gameData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p>게임 데이터를 불러오는 중...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <Link href="/">
            <Button variant="ghost" size="sm" className="focus-ring">
              <ArrowLeft className="w-4 h-4 mr-2" />
              홈으로
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-center flex-1">경제 용어 릴레이</h1>
          <Button variant="ghost" size="sm" onClick={() => setShowHelp(true)} className="focus-ring">
            <HelpCircle className="w-4 h-4 mr-2" />
            도움말
          </Button>
        </div>

        {gameState === "start" && (
          <Card className="w-full max-w-2xl mx-auto shadow-lg">
            <CardHeader className="text-center pb-6">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                <span className="text-3xl">🔄</span>
              </div>
              <CardTitle className="text-3xl font-bold mb-4">경제 용어 릴레이</CardTitle>
              <CardDescription className="text-lg">
                AI와 함께 경제 용어 끝말잇기를 하며 어휘력을 늘려보세요.
                <br />
                시작 단어: <span className="font-bold text-primary">{gameData.startWord}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={() => setShowHelp(true)} variant="outline" size="lg" className="focus-ring">
                  <HelpCircle className="w-5 h-5 mr-2" />
                  게임 방법
                </Button>
                <Button onClick={handleStartGame} size="lg" className="focus-ring">
                  게임 시작
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {gameState === "playing" && (
          <div className="space-y-6">
            <Card className="shadow-lg">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`flex items-center space-x-3 p-3 rounded-lg transition-all ${
                      currentTurn === "player" ? "bg-blue-100 ring-2 ring-blue-500" : "bg-gray-100"
                    }`}
                  >
                    <User className="w-6 h-6" />
                    <span className="font-semibold">플레이어</span>
                  </div>

                  <div className="text-center">
                    <div className="text-sm text-muted-foreground mb-1">현재 턴</div>
                    <Badge variant={currentTurn === "player" ? "default" : "secondary"} className="text-sm">
                      {currentTurn === "player" ? "플레이어" : "AI"} 턴
                    </Badge>
                  </div>

                  <div
                    className={`flex items-center space-x-3 p-3 rounded-lg transition-all ${
                      currentTurn === "ai" ? "bg-green-100 ring-2 ring-green-500" : "bg-gray-100"
                    }`}
                  >
                    <Bot className="w-6 h-6" />
                    <span className="font-semibold">AI</span>
                  </div>
                </div>

                {currentTurn === "player" && (
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-2 mb-2" role="status" aria-live="polite">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm font-medium">남은 시간: {timeLeft}초</span>
                    </div>
                    <Progress value={(timeLeft / 30) * 100} className="h-2" />
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-sm text-muted-foreground mb-2">시작 단어</div>
                  <div className="text-2xl font-bold text-primary mb-2">{gameData.startWord}</div>
                  <div className="text-sm text-muted-foreground">
                    다음 단어는 &apos;<span className="font-bold text-primary">{getCurrentLastChar()}</span>&apos;로 시작해야
                    합니다
                  </div>
                </div>
              </CardContent>
            </Card>

            {wordChain.length > 0 && (
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">단어 릴레이 ({wordChain.length}개)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {wordChain.map((entry, index) => (
                      <div
                        key={index}
                        className={`flex items-center space-x-3 p-3 rounded-lg ${
                          entry.player === "player"
                            ? "bg-blue-50 border-l-4 border-blue-500"
                            : "bg-green-50 border-l-4 border-green-500"
                        } ${index === wordChain.length - 1 ? "ring-2 ring-yellow-300 bg-yellow-50" : ""}`}
                      >
                        {entry.player === "player" ? (
                          <User className="w-5 h-5 text-blue-600" />
                        ) : (
                          <Bot className="w-5 h-5 text-green-600" />
                        )}
                        <span className="font-semibold text-lg">{entry.word}</span>
                        {gameData.definitions[entry.word] && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowDefinition(entry.word)}
                            className="ml-auto"
                          >
                            <Lightbulb className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {currentTurn === "player" && !isAiThinking && (
              <Card className="shadow-lg">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex space-x-3">
                      <Input
                        id="term-input"
                        ref={inputRef}
                        value={currentInput}
                        onChange={(e) => setCurrentInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onCompositionStart={handleCompositionStart}
                        onCompositionEnd={handleCompositionEnd}
                        placeholder={`'${getCurrentLastChar()}'로 시작하는 경제 용어를 입력하세요...`}
                        className="text-lg focus-ring"
                        disabled={gameState !== "playing" || currentTurn !== "player"}
                      />
                      <Button
                        onClick={handlePlayerSubmit}
                        disabled={!currentInput.trim() || isComposing}
                        className="focus-ring"
                      >
                        제출
                      </Button>
                    </div>
                    {errorMessage && (
                      <div className="text-red-600 text-sm font-medium bg-red-50 p-3 rounded-lg" role="status">
                        {errorMessage}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {isAiThinking && (
              <Card className="shadow-lg">
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <Bot className="w-12 h-12 mx-auto mb-4 text-green-600 animate-pulse" />
                    <div className="text-lg font-semibold mb-2">AI 생각 중...</div>
                    <div className="flex justify-center space-x-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce delay-100"></div>
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce delay-200"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {gameState === "gameOver" && gameResult && (
          <Card className="w-full max-w-2xl mx-auto shadow-lg">
            <CardHeader className="text-center pb-6">
              <div
                className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center ${
                  gameResult === "win" ? "bg-green-100" : "bg-red-100"
                }`}
              >
                {gameResult === "win" ? (
                  <Trophy className="w-10 h-10 text-green-600" />
                ) : (
                  <Bot className="w-10 h-10 text-red-600" />
                )}
              </div>
              <CardTitle
                className={`text-3xl font-bold mb-4 ${gameResult === "win" ? "text-green-600" : "text-red-600"}`}
              >
                {gameResult === "win" ? "승리!" : "패배!"}
              </CardTitle>
              <CardDescription className="text-lg">
                {gameResult === "win" ? "축하합니다! AI를 이겼습니다!" : "AI가 승리했습니다. 다시 도전해보세요!"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-muted p-4 rounded-lg">
                <div className="text-center space-y-2">
                  <div className="text-sm text-muted-foreground">게임 결과</div>
                  <div className="text-2xl font-bold">{wordChain.length}개 단어 연결</div>
                  <div className="text-sm text-muted-foreground">
                    학습한 경제 용어: {new Set(wordChain.map((w) => w.word)).size}개
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={resetGame} size="lg" className="focus-ring">
                  <RotateCcw className="w-5 h-5 mr-2" />
                  다시 플레이
                </Button>
                <Link href="/">
                  <Button variant="outline" size="lg" className="focus-ring w-full sm:w-auto bg-transparent">
                    홈으로 돌아가기
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        <AlertDialog open={showHelp} onOpenChange={setShowHelp}>
          <AlertDialogContent className="max-w-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle>게임 방법</AlertDialogTitle>
              <AlertDialogDescription asChild>
                <div className="space-y-4 text-sm">
                  <div>
                    <h4 className="font-semibold mb-2">🎯 게임 목표</h4>
                    <p>AI와 번갈아가며 경제 용어 끝말잇기를 하여 더 오래 버티는 것이 목표입니다.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">📝 게임 규칙</h4>
                    <ul className="list-disc list-inside space-y-1">
                      <li>이전 단어의 마지막 글자로 시작하는 경제 용어를 입력하세요</li>
                      <li>이미 사용된 단어는 다시 사용할 수 없습니다</li>
                      <li>경제 용어 사전에 있는 단어만 인정됩니다</li>
                      <li>각 턴마다 30초의 제한 시간이 있습니다</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">🏆 승리 조건</h4>
                    <ul className="list-disc list-inside space-y-1">
                      <li>AI가 단어를 찾지 못하면 승리</li>
                      <li>시간 초과 또는 잘못된 단어 입력 시 패배</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">💡 팁</h4>
                    <p>단어 옆의 전구 아이콘을 클릭하면 용어의 뜻을 확인할 수 있습니다.</p>
                  </div>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction>확인</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog open={!!showDefinition} onOpenChange={() => setShowDefinition(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{showDefinition}</AlertDialogTitle>
              <AlertDialogDescription>{showDefinition && gameData.definitions[showDefinition]}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction>확인</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <GameCountdown isActive={showCountdown} onComplete={handleCountdownComplete} autoFocusTargetId="term-input" />
      </div>
    </div>
  )
}
