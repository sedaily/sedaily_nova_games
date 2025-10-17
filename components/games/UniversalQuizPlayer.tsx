"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, XCircle, Lightbulb, ExternalLink } from "lucide-react"
import type { Question } from "@/lib/games-data"

type QuizPlayerProps = {
  questions: Question[]
  date: string
  gameType: "BlackSwan" | "PrisonersDilemma" | "SignalDecoding"
  themeColor: string
  disableSaveProgress?: boolean // play 폴더에서는 상태 저장하지 않음
}

type QuestionState = {
  selectedAnswer: string | null
  userAnswer: string
  isAnswered: boolean
  isCorrect: boolean
  showHint: boolean
}

export function UniversalQuizPlayer({ questions, date, gameType, themeColor, disableSaveProgress = false }: QuizPlayerProps) {
  const router = useRouter()
  const [questionStates, setQuestionStates] = useState<QuestionState[]>([])
  const [isComplete, setIsComplete] = useState(false)
  const [score, setScore] = useState(0)

  useEffect(() => {
    if (questions.length > 0 && questionStates.length === 0) {
      const initialStates = questions.map(() => ({
        selectedAnswer: null,
        userAnswer: "",
        isAnswered: false,
        isCorrect: false,
        showHint: false,
      }))
      setQuestionStates(initialStates)
    }
  }, [questions, questionStates.length])

  const answeredCount = questionStates.filter((state) => state.isAnswered).length
  const progress = questionStates.length > 0 ? (answeredCount / questions.length) * 100 : 0
  const showProgress = questions.length > 1

  const getThemeStyles = () => {
    switch (gameType) {
      case "BlackSwan":
        return {
          cardBg: "bg-white/95 backdrop-blur-sm",
          cardBorder: "border-[#3B82F6]/20",
          accentColor: "text-[#3B82F6]",
          badgeBg: "bg-blue-100 text-blue-700 border-blue-300",
          buttonBg: "bg-[#0A2540] hover:bg-[#1E3A8A]",
          buttonText: "text-white",
          progressBg: "bg-[#3B82F6]",
        }
      case "PrisonersDilemma":
        return {
          cardBg: "bg-[#FAFAF9]/95 backdrop-blur-sm",
          cardBorder: "border-[#8B5E3C]/20",
          accentColor: "text-[#8B5E3C]",
          badgeBg: "bg-amber-100 text-amber-700 border-amber-300",
          buttonBg: "bg-[#8B5E3C] hover:bg-[#78716C]",
          buttonText: "text-white",
          progressBg: "bg-[#8B5E3C]",
        }
      case "SignalDecoding":
        return {
          cardBg: "bg-white/95 backdrop-blur-sm",
          cardBorder: "border-[#184E77]/20",
          accentColor: "text-[#184E77]",
          badgeBg: "bg-teal-100 text-teal-700 border-teal-300",
          buttonBg: "bg-[#184E77] hover:bg-[#266D7E]",
          buttonText: "text-white",
          progressBg: "bg-[#184E77]",
        }
    }
  }

  const themeStyles = getThemeStyles()

  useEffect(() => {
    if (questionStates.length === 0 || disableSaveProgress) return

    const savedKey = `quiz-progress-${gameType}-${date}`
    const saved = localStorage.getItem(savedKey)
    if (saved) {
      try {
        const data = JSON.parse(saved)
        if (data.questionStates && data.questionStates.length === questions.length) {
          setQuestionStates(data.questionStates)
          setScore(data.score || 0)
          if (data.isComplete) {
            setIsComplete(true)
          }
        }
      } catch (error) {
        console.error("[v0] Error loading saved progress:", error)
      }
    }
  }, [gameType, date, questions.length, questionStates.length, disableSaveProgress])

  const saveProgress = (states: QuestionState[], currentScore: number, complete: boolean) => {
    if (disableSaveProgress) return // play 폴더에서는 상태 저장하지 않음
    
    const savedKey = `quiz-progress-${gameType}-${date}`
    localStorage.setItem(
      savedKey,
      JSON.stringify({
        questionStates: states,
        score: currentScore,
        isComplete: complete,
        timestamp: Date.now(),
      }),
    )
  }

  const handleMultipleChoiceAnswer = (questionIndex: number, option: string) => {
    if (!questionStates[questionIndex]) return

    const currentState = questionStates[questionIndex]
    if (currentState.isAnswered) return

    const question = questions[questionIndex]
    const isCorrect = option === question.answer
    const newStates = [...questionStates]
    newStates[questionIndex] = {
      ...currentState,
      selectedAnswer: option,
      isAnswered: true,
      isCorrect,
    }

    const newScore = isCorrect ? score + 1 : score
    setQuestionStates(newStates)
    setScore(newScore)
    saveProgress(newStates, newScore, false)

    if (newStates.every((state) => state.isAnswered)) {
      setIsComplete(true)
      saveProgress(newStates, newScore, true)
    }
  }

  const handleShortAnswerSubmit = (questionIndex: number) => {
    if (!questionStates[questionIndex]) return

    const currentState = questionStates[questionIndex]
    if (currentState.isAnswered || !currentState.userAnswer.trim()) return

    const question = questions[questionIndex]
    const userAnswerNormalized = currentState.userAnswer.trim().toLowerCase()
    const correctAnswerNormalized = question.answer.toLowerCase()
    const isCorrect = userAnswerNormalized === correctAnswerNormalized

    const newStates = [...questionStates]
    newStates[questionIndex] = {
      ...currentState,
      isAnswered: true,
      isCorrect,
    }

    const newScore = isCorrect ? score + 1 : score
    setQuestionStates(newStates)
    setScore(newScore)
    saveProgress(newStates, newScore, false)

    if (newStates.every((state) => state.isAnswered)) {
      setIsComplete(true)
      saveProgress(newStates, newScore, true)
    }
  }

  const handleToggleHint = (questionIndex: number) => {
    if (!questionStates[questionIndex]) return

    const newStates = [...questionStates]
    newStates[questionIndex] = {
      ...questionStates[questionIndex],
      showHint: !questionStates[questionIndex].showHint,
    }
    setQuestionStates(newStates)
  }

  const handleInputChange = (questionIndex: number, value: string) => {
    if (!questionStates[questionIndex]) return

    const newStates = [...questionStates]
    newStates[questionIndex] = {
      ...questionStates[questionIndex],
      userAnswer: value,
    }
    setQuestionStates(newStates)
  }

  const handleRestart = () => {
    const resetStates = questions.map(() => ({
      selectedAnswer: null,
      userAnswer: "",
      isAnswered: false,
      isCorrect: false,
      showHint: false,
    }))
    setQuestionStates(resetStates)
    setScore(0)
    setIsComplete(false)
    saveProgress(resetStates, 0, false)
  }

  if (questionStates.length === 0) {
    return (
      <div className="max-w-3xl mx-auto">
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">퀴즈를 불러오는 중...</p>
        </Card>
      </div>
    )
  }

  if (isComplete) {
    const percentage = Math.round((score / questions.length) * 100)

    return (
      <div className="max-w-2xl mx-auto">
        <Card
          className={`${themeStyles.cardBg} ${themeStyles.cardBorder} border-2 rounded-2xl p-8 text-center space-y-6 shadow-xl`}
        >
          <div className="text-6xl mb-4">
            {percentage >= 80 ? "🎉" : percentage >= 60 ? "👏" : percentage >= 40 ? "💪" : "📚"}
          </div>
          <h2 className="text-3xl font-bold">퀴즈 완료!</h2>
          <div className="space-y-2">
            <p className={`text-5xl font-bold ${themeStyles.accentColor}`}>
              {score} / {questions.length}
            </p>
            <p className="text-xl text-muted-foreground">{percentage}% 정답률</p>
          </div>

          <div className="pt-6 flex flex-col gap-3">
            <Button
              onClick={handleRestart}
              size="lg"
              className={`w-full ${themeStyles.buttonBg} ${themeStyles.buttonText}`}
            >
              다시 도전하기
            </Button>
            <Button variant="outline" size="lg" className="w-full bg-transparent" onClick={() => router.back()}>
              돌아가기
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {showProgress && <Progress value={progress} className={themeStyles.progressBg} />}

      <div className="space-y-6">
        {questions.map((question, questionIndex) => {
          const state = questionStates[questionIndex]
          if (!state) return null

          return (
            <Card
              key={questionIndex}
              className={`${themeStyles.cardBg} ${themeStyles.cardBorder} border-2 rounded-2xl p-6 md:p-8 space-y-6 shadow-xl`}
            >
              <div className="flex items-center justify-between">
                <Badge className={`${themeStyles.badgeBg} border px-3 py-1 rounded-full text-sm font-medium`}>
                  {question.questionType}
                </Badge>
                {question.newsLink && (
                  <a
                    href={question.newsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors opacity-80 hover:opacity-100"
                  >
                    <ExternalLink className="h-3 w-3" />
                    <span>관련 뉴스</span>
                  </a>
                )}
              </div>

              <div>
                <h3 className="text-xl md:text-2xl font-semibold leading-relaxed" style={{ lineHeight: "1.5" }}>
                  {questionIndex + 1}. {question.question}
                </h3>
              </div>

              {question.questionType === "객관식" && question.options && (
                <div className="space-y-3">
                  {question.options.map((option, idx) => {
                    const isSelected = state.selectedAnswer === option
                    const isCorrectOption = option === question.answer
                    const showResult = state.isAnswered

                    return (
                      <button
                        key={idx}
                        onClick={() => handleMultipleChoiceAnswer(questionIndex, option)}
                        disabled={state.isAnswered}
                        className={`w-full p-4 text-left rounded-xl border-2 transition-all ${
                          showResult && isCorrectOption
                            ? "border-green-500 bg-green-50"
                            : showResult && isSelected && !isCorrectOption
                              ? "border-red-500 bg-red-50/50"
                              : isSelected
                                ? "border-blue-500 bg-blue-50"
                                : "border-border hover:border-blue-500/50 hover:bg-muted/50"
                        } ${state.isAnswered ? "cursor-default" : "cursor-pointer"}`}
                      >
                        <div className="flex items-start gap-3">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-semibold">
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span className="flex-1">{option}</span>
                          {showResult && isCorrectOption && (
                            <CheckCircle2 className="flex-shrink-0 h-5 w-5 text-green-600" />
                          )}
                          {showResult && isSelected && !isCorrectOption && <XCircle className="h-5 w-5 text-red-600" />}
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}

              {question.questionType === "주관식" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Input
                      type="text"
                      placeholder="답을 입력하세요"
                      value={state.userAnswer}
                      onChange={(e) => handleInputChange(questionIndex, e.target.value)}
                      disabled={state.isAnswered}
                      className="text-lg p-4"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !state.isAnswered) {
                          handleShortAnswerSubmit(questionIndex)
                        }
                      }}
                    />
                    {!state.isAnswered && (
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleShortAnswerSubmit(questionIndex)}
                          disabled={!state.userAnswer.trim()}
                          className="flex-1"
                        >
                          제출하기
                        </Button>
                        {question.hint && (
                          <Button
                            onClick={() => handleToggleHint(questionIndex)}
                            variant="outline"
                            className="gap-2 bg-transparent"
                          >
                            <Lightbulb className="h-4 w-4" />
                            힌트
                          </Button>
                        )}
                      </div>
                    )}
                  </div>

                  {state.showHint && question.hint && !state.isAnswered && (
                    <Card className="p-4 bg-yellow-50 border-yellow-200">
                      <div className="flex gap-2">
                        <Lightbulb className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-yellow-900 mb-1">힌트</p>
                          <p className="text-yellow-800">{question.hint}</p>
                        </div>
                      </div>
                    </Card>
                  )}

                  {state.isAnswered && (
                    <Card
                      className={`p-4 ${state.isCorrect ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}
                    >
                      <div className="flex gap-2">
                        {state.isCorrect ? (
                          <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1">
                          <p className={`font-semibold mb-1 ${state.isCorrect ? "text-green-900" : "text-red-900"}`}>
                            {state.isCorrect ? "정답입니다!" : "오답입니다"}
                          </p>
                          {!state.isCorrect && (
                            <p className="text-sm text-muted-foreground">
                              정답: <span className="font-semibold">{question.answer}</span>
                            </p>
                          )}
                        </div>
                      </div>
                    </Card>
                  )}
                </div>
              )}

              {state.isAnswered && (
                <Card className="p-4 bg-blue-50 border-blue-200 rounded-xl">
                  <div className="space-y-2">
                    <p className="font-semibold text-blue-900">해설</p>
                    <p className="text-blue-800 leading-relaxed" style={{ lineHeight: "1.6" }}>
                      {question.explanation}
                    </p>
                  </div>
                </Card>
              )}
            </Card>
          )
        })}
      </div>

      {answeredCount === questions.length && (
        <Card
          className={`${themeStyles.cardBg} ${themeStyles.cardBorder} border-2 rounded-2xl p-6 text-center space-y-4 shadow-xl`}
        >
          <div className="space-y-2">
            <p className="text-lg font-semibold">모든 문제를 완료했습니다!</p>
            <p className={`text-3xl font-bold ${themeStyles.accentColor}`}>
              {score} / {questions.length}
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <Button
              onClick={handleRestart}
              size="lg"
              className={`w-full ${themeStyles.buttonBg} ${themeStyles.buttonText}`}
            >
              다시 도전하기
            </Button>
            <Button variant="outline" size="lg" className="w-full bg-transparent" onClick={() => router.back()}>
              돌아가기
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}
