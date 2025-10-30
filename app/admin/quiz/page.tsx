"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Save } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { PasswordModal } from "@/components/admin/PasswordModal"
import { DateSetList } from "@/components/admin/DateSetList"
import { QuizEditor } from "@/components/admin/QuizEditor"
import { ReviewList } from "@/components/admin/ReviewList"
import type { QuizQuestion } from "@/types/quiz"

export default function AdminQuizPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showPasswordDialog, setShowPasswordDialog] = useState(true)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle")
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const [reviewFilter, setReviewFilter] = useState<"all" | "ok" | "missing">("all")
  const [themeFilter, setThemeFilter] = useState<"BlackSwan" | "SignalDecoding" | "PrisonersDilemma" | "all">("all")

  useEffect(() => {
    const auth = sessionStorage.getItem("admin_authenticated")
    if (auth === "true") {
      setIsAuthenticated(true)
      setShowPasswordDialog(false)
    }
  }, [])

  const loadQuestionsForDate = useCallback(async (date: string) => {
    try {
      const response = await fetch(`/api/admin/quiz?date=${date}`)
      if (response.ok) {
        const data = await response.json()
        if (data.questions && data.questions.length > 0) {
          setQuestions(data.questions)
          setCurrentQuestionIndex(0)
        } else {
          setQuestions([])
          setCurrentQuestionIndex(0)
        }
      }
    } catch (err) {
      console.error("[v0] Failed to load questions:", err)
      setQuestions([])
      setCurrentQuestionIndex(0)
    }
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      loadQuestionsForDate(format(selectedDate, "yyyy-MM-dd"))
    }
  }, [selectedDate, isAuthenticated, loadQuestionsForDate])

  const addNewQuestion = useCallback(() => {
    const newQuestion: QuizQuestion = {
      id: `q-${Date.now()}`,
      date: format(selectedDate, "yyyy-MM-dd"),
      theme: "BlackSwan",
      question_text: "",
      choices: ["", ""],
      correct_index: null,
      creator: "",
    }
    setQuestions((prev) => [...prev, newQuestion])
    setCurrentQuestionIndex((prev) => prev + 1)
  }, [selectedDate])

  useEffect(() => {
    if (questions.length === 0 && isAuthenticated) {
      addNewQuestion()
    }
  }, [isAuthenticated, addNewQuestion, questions.length])

  const deleteQuestion = (index: number) => {
    const newQuestions = questions.filter((_, i) => i !== index)
    setQuestions(newQuestions)
    if (currentQuestionIndex >= newQuestions.length) {
      setCurrentQuestionIndex(Math.max(0, newQuestions.length - 1))
    }
  }

  const duplicateQuestion = (index: number) => {
    const questionToDuplicate = questions[index]
    const duplicated: QuizQuestion = {
      ...questionToDuplicate,
      id: `q-${Date.now()}`,
    }
    const newQuestions = [...questions]
    newQuestions.splice(index + 1, 0, duplicated)
    setQuestions(newQuestions)
    setCurrentQuestionIndex(index + 1)
  }

  const updateCurrentQuestion = (updates: Partial<QuizQuestion>) => {
    const newQuestions = [...questions]
    newQuestions[currentQuestionIndex] = {
      ...newQuestions[currentQuestionIndex],
      ...updates,
    }
    setQuestions(newQuestions)
    setSaveStatus("idle")
  }

  const validateQuestion = (question: QuizQuestion): { status: "ok" | "missing"; issues: string[] } => {
    const errors: string[] = []

    if (!question.question_text.trim()) {
      errors.push("질문 내용이 비어있습니다")
    }

    if (question.choices.length < 2 || question.choices.length > 6) {
      errors.push("선택지는 2~6개여야 합니다")
    }

    if (question.correct_index === null) {
      errors.push("정답을 선택해주세요")
    }

    if (!question.creator.trim()) {
      errors.push("제작자 이름을 입력해주세요")
    }

    if (question.related_article?.url && !isValidUrl(question.related_article.url)) {
      errors.push("관련 기사 URL이 유효하지 않습니다")
    }

    return {
      status: errors.length === 0 ? "ok" : "missing",
      issues: errors,
    }
  }

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const handleSave = async () => {
    const allErrors: string[] = []
    for (let i = 0; i < questions.length; i++) {
      const result = validateQuestion(questions[i])
      if (result.status === "missing") {
        allErrors.push(`문제 ${i + 1}: ${result.issues.join(", ")}`)
      }
    }

    if (allErrors.length > 0) {
      setValidationErrors(allErrors)
      setSaveStatus("error")
      return
    }

    setSaveStatus("saving")
    setValidationErrors([])

    try {
      const adminPassword = sessionStorage.getItem("admin_password") || "sedaily2024!"

      const response = await fetch("/api/admin/quiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminPassword}`,
        },
        body: JSON.stringify({
          date: format(selectedDate, "yyyy-MM-dd"),
          questions,
        }),
      })

      if (response.ok) {
        setSaveStatus("saved")
        setTimeout(() => setSaveStatus("idle"), 2000)
      } else {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to save")
      }
    } catch (err) {
      setSaveStatus("error")
      const message = err instanceof Error ? err.message : String(err) || "저장 중 오류가 발생했습니다"
      setValidationErrors([message])
    }
  }

  if (!isAuthenticated) {
    return <PasswordModal isOpen={showPasswordDialog} onAuthenticated={() => setIsAuthenticated(true)} />
  }

  const currentQuestion = questions[currentQuestionIndex]

  if (!currentQuestion) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold">퀴즈 관리</h1>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn("justify-start text-left font-normal")}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(selectedDate, "yyyy-MM-dd")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={selectedDate} onSelect={(date) => date && setSelectedDate(date)} />
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex items-center gap-2">
            {saveStatus === "saved" && <span className="text-sm text-success">저장됨</span>}
            {saveStatus === "error" && <span className="text-sm text-destructive">저장 실패</span>}
            <Button onClick={handleSave} disabled={saveStatus === "saving"}>
              <Save className="mr-2 h-4 w-4" />
              {saveStatus === "saving" ? "저장 중..." : "저장"}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-3 space-y-4">
            <DateSetList
              questions={questions}
              currentQuestionIndex={currentQuestionIndex}
              onSelectQuestion={setCurrentQuestionIndex}
              onAddQuestion={addNewQuestion}
            />
          </div>

          <div className="col-span-6 space-y-4">
            <QuizEditor
              question={currentQuestion}
              questionIndex={currentQuestionIndex}
              totalQuestions={questions.length}
              validationErrors={validationErrors}
              onUpdate={updateCurrentQuestion}
              onPrevious={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
              onNext={() => setCurrentQuestionIndex(Math.min(questions.length - 1, currentQuestionIndex + 1))}
              onDuplicate={() => duplicateQuestion(currentQuestionIndex)}
              onDelete={() => deleteQuestion(currentQuestionIndex)}
            />
          </div>

          <div className="col-span-3">
            <ReviewList
              questions={questions}
              currentQuestionIndex={currentQuestionIndex}
              reviewFilter={reviewFilter}
              themeFilter={themeFilter}
              onSelectQuestion={setCurrentQuestionIndex}
              onReviewFilterChange={setReviewFilter}
              onThemeFilterChange={setThemeFilter}
              validateQuestion={validateQuestion}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
