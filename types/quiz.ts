export type GameTheme = "BlackSwan" | "SignalDecoding" | "PrisonersDilemma"

export type QuizQuestion = {
  id: string
  date: string
  theme: GameTheme
  card_type?: "question" | "answer"
  title?: string
  question_text: string
  choices: string[]
  correct_index: number | null
  explanation?: string
  hints?: string[]
  related_article?: {
    title: string
    snippet: string
    url: string
  }
  image?: string
  creator: string
  tags?: string
}
