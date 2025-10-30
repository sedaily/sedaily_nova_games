import { type NextRequest, NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"

type GameTheme = "BlackSwan" | "SignalDecoding" | "PrisonersDilemma"

type QuizQuestion = {
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

type Question = {
  id: string
  questionType: "객관식" | "주관식"
  question: string
  options?: string[]
  hint?: string | string[]
  answer: string
  explanation: string
  newsLink: string
  tags?: string
}

type GameDataStructure = {
  [key in GameTheme]: {
    [date: string]: Question[]
  }
}

// Convert admin QuizQuestion to storage Question format
function convertToStorageFormat(quizQuestion: QuizQuestion): Question {
  return {
    id: quizQuestion.id,
    questionType: "객관식",
    question: quizQuestion.question_text,
    options: quizQuestion.choices,
    answer: quizQuestion.correct_index !== null ? quizQuestion.choices[quizQuestion.correct_index] : "",
    explanation: quizQuestion.explanation || "",
    newsLink: quizQuestion.related_article?.url || "",
    tags: quizQuestion.tags,
  }
}

// GET: Load questions for a specific date
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get("date")

    if (!date) {
      return NextResponse.json({ error: "Date parameter is required" }, { status: 400 })
    }

    const dataPath = path.join(process.cwd(), "data", "quizData_combined.json")
    const fileContent = await fs.readFile(dataPath, "utf-8")
    const data: GameDataStructure = JSON.parse(fileContent)

    // Collect all questions for this date across all themes
    const questions: QuizQuestion[] = []

    for (const theme of ["BlackSwan", "SignalDecoding", "PrisonersDilemma"] as GameTheme[]) {
      const themeQuestions = data[theme]?.[date] || []

      for (const q of themeQuestions) {
        // Convert storage format back to admin format
        const correctIndex = q.options?.indexOf(q.answer) ?? null

        questions.push({
          id: q.id,
          date,
          theme,
          question_text: q.question,
          choices: q.options || [],
          correct_index: correctIndex,
          explanation: q.explanation,
          related_article: q.newsLink
            ? {
                title: "",
                snippet: "",
                url: q.newsLink,
              }
            : undefined,
          creator: "", // Not stored in current format
          tags: q.tags,
        })
      }
    }

    return NextResponse.json({ questions })
  } catch (error) {
    console.error("[v0] Error loading quiz data:", error)
    return NextResponse.json({ error: "Failed to load quiz data" }, { status: 500 })
  }
}

// POST: Save questions for a specific date
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { date, questions } = body as { date: string; questions: QuizQuestion[] }

    if (!date || !questions) {
      return NextResponse.json({ error: "Date and questions are required" }, { status: 400 })
    }

    // Validate password
    const authHeader = request.headers.get("authorization")
    const password = authHeader?.replace("Bearer ", "")
    const correctPassword = process.env.ADMIN_PASSWORD || "sedaily2024!"

    if (password !== correctPassword) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const dataPath = path.join(process.cwd(), "data", "quizData_combined.json")

    // Read existing data
    let data: GameDataStructure
    try {
      const fileContent = await fs.readFile(dataPath, "utf-8")
      data = JSON.parse(fileContent)
    } catch {
      // Initialize empty structure if file doesn't exist
      data = {
        BlackSwan: {},
        SignalDecoding: {},
        PrisonersDilemma: {},
      }
    }

    // Group questions by theme
    const questionsByTheme: Record<GameTheme, QuizQuestion[]> = {
      BlackSwan: [],
      SignalDecoding: [],
      PrisonersDilemma: [],
    }

    for (const q of questions) {
      questionsByTheme[q.theme].push(q)
    }

    // Update data for each theme
    for (const theme of ["BlackSwan", "SignalDecoding", "PrisonersDilemma"] as GameTheme[]) {
      if (!data[theme]) {
        data[theme] = {}
      }

      if (questionsByTheme[theme].length > 0) {
        data[theme][date] = questionsByTheme[theme].map(convertToStorageFormat)
      } else {
        // Remove date if no questions for this theme
        delete data[theme][date]
      }
    }

    // Write back to file
    await fs.writeFile(dataPath, JSON.stringify(data, null, 2), "utf-8")

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error saving quiz data:", error)
    return NextResponse.json({ error: "Failed to save quiz data" }, { status: 500 })
  }
}

// DELETE: Delete questions for a specific date
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get("date")

    if (!date) {
      return NextResponse.json({ error: "Date parameter is required" }, { status: 400 })
    }

    // Validate password
    const authHeader = request.headers.get("authorization")
    const password = authHeader?.replace("Bearer ", "")
    const correctPassword = process.env.ADMIN_PASSWORD || "sedaily2024!"

    if (password !== correctPassword) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const dataPath = path.join(process.cwd(), "data", "quizData_combined.json")
    const fileContent = await fs.readFile(dataPath, "utf-8")
    const data: GameDataStructure = JSON.parse(fileContent)

    // Remove date from all themes
    for (const theme of ["BlackSwan", "SignalDecoding", "PrisonersDilemma"] as GameTheme[]) {
      if (data[theme]?.[date]) {
        delete data[theme][date]
      }
    }

    // Write back to file
    await fs.writeFile(dataPath, JSON.stringify(data, null, 2), "utf-8")

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error deleting quiz data:", error)
    return NextResponse.json({ error: "Failed to delete quiz data" }, { status: 500 })
  }
}
