export type QuizItem = {
  id: number
  question: string
  passage?: string | null
  options: string[]
  answer: string
  explanation?: string
  newsLink?: string
}

export type AnswerMap = Record<number, { selected: string; correct: boolean }>

export type QuizState = "idle" | "answering" | "answered" | "completed"
