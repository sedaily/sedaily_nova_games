"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight, Copy, Trash2, Plus, AlertCircle } from "lucide-react"
import type { QuizQuestion, GameTheme } from "@/types/quiz"

type QuizEditorProps = {
  question: QuizQuestion
  questionIndex: number
  totalQuestions: number
  validationErrors: string[]
  onUpdate: (updates: Partial<QuizQuestion>) => void
  onPrevious: () => void
  onNext: () => void
  onDuplicate: () => void
  onDelete: () => void
}

export function QuizEditor({
  question,
  questionIndex,
  totalQuestions,
  validationErrors,
  onUpdate,
  onPrevious,
  onNext,
  onDuplicate,
  onDelete,
}: QuizEditorProps) {
  const addChoice = () => {
    if (question.choices.length < 6) {
      onUpdate({ choices: [...question.choices, ""] })
    }
  }

  const removeChoice = (index: number) => {
    if (question.choices.length > 2) {
      const newChoices = question.choices.filter((_, i) => i !== index)
      onUpdate({
        choices: newChoices,
        correct_index: question.correct_index === index ? null : question.correct_index,
      })
    }
  }

  const updateChoice = (index: number, value: string) => {
    const newChoices = [...question.choices]
    newChoices[index] = value
    onUpdate({ choices: newChoices })
  }

  return (
    <div className="bg-card rounded-lg border p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">문제 {questionIndex + 1} 편집</h2>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={onPrevious} disabled={questionIndex === 0}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline" onClick={onNext} disabled={questionIndex === totalQuestions - 1}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline" onClick={onDuplicate}>
            <Copy className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="destructive" onClick={onDelete} disabled={totalQuestions === 1}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {validationErrors.length > 0 && (
        <div className="mb-4 p-4 bg-destructive/10 border border-destructive rounded-md">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-destructive mb-1">저장할 수 없습니다</p>
              <ul className="text-sm text-destructive space-y-1">
                {validationErrors.map((err, i) => (
                  <li key={i}>• {err}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        <div className="space-y-2">
          <Label>테마 *</Label>
          <Select value={question.theme} onValueChange={(value: GameTheme) => onUpdate({ theme: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="BlackSwan">블랙 스완</SelectItem>
              <SelectItem value="SignalDecoding">시그널 디코딩</SelectItem>
              <SelectItem value="PrisonersDilemma">죄수의 딜레마</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="creator">제작자 *</Label>
          <Input
            id="creator"
            value={question.creator}
            onChange={(e) => onUpdate({ creator: e.target.value })}
            placeholder="제작자 이름"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="question">질문 내용 *</Label>
          <Textarea
            id="question"
            value={question.question_text}
            onChange={(e) => onUpdate({ question_text: e.target.value })}
            placeholder="질문을 입력하세요"
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>선택지 * (2~6개)</Label>
            <Button size="sm" variant="outline" onClick={addChoice} disabled={question.choices.length >= 6}>
              <Plus className="h-4 w-4 mr-1" />
              선택지 추가
            </Button>
          </div>
          <div className="space-y-2">
            {question.choices.map((choice, index) => (
              <div key={index} className="flex gap-2">
                <Button
                  size="sm"
                  variant={question.correct_index === index ? "default" : "outline"}
                  onClick={() => onUpdate({ correct_index: index })}
                  className="shrink-0"
                >
                  {String.fromCharCode(65 + index)}
                </Button>
                <Input
                  value={choice}
                  onChange={(e) => updateChoice(index, e.target.value)}
                  placeholder={`선택지 ${index + 1}`}
                />
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => removeChoice(index)}
                  disabled={question.choices.length <= 2}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground">정답 선택지를 클릭하여 정답을 지정하세요</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="explanation">해설</Label>
          <Textarea
            id="explanation"
            value={question.explanation || ""}
            onChange={(e) => onUpdate({ explanation: e.target.value })}
            placeholder="정답 해설을 입력하세요"
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label>관련 기사</Label>
          <Input
            value={question.related_article?.title || ""}
            onChange={(e) =>
              onUpdate({
                related_article: {
                  ...question.related_article,
                  title: e.target.value,
                  snippet: question.related_article?.snippet || "",
                  url: question.related_article?.url || "",
                },
              })
            }
            placeholder="기사 제목"
            className="mb-2"
          />
          <Input
            value={question.related_article?.url || ""}
            onChange={(e) =>
              onUpdate({
                related_article: {
                  ...question.related_article,
                  title: question.related_article?.title || "",
                  snippet: question.related_article?.snippet || "",
                  url: e.target.value,
                },
              })
            }
            placeholder="기사 URL"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tags">태그</Label>
          <Input
            id="tags"
            value={question.tags || ""}
            onChange={(e) => onUpdate({ tags: e.target.value })}
            placeholder="태그 (예: 증권, 부동산)"
          />
        </div>
      </div>
    </div>
  )
}
