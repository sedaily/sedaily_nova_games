export type GameMeta = {
  id: string
  slug: string
  title: string
  subtitle?: string
  description?: string
  color: string
  bgColor: string
  icon: string
  status: "active" | "coming-soon"
  component?: string
  image?: string
  solidBgColor?: string
  isNew?: boolean
  playUrl?: string // Added optional playUrl to override default routing
}

export const GAMES: GameMeta[] = [
  {
    id: "g1",
    slug: "/games/g1",
    title: "블랙 스완",
    subtitle: "",
    description: "",
    color: "#2A50FF",
    bgColor: "from-blue-600 to-blue-700",
    icon: "🦢",
    status: "active",
    image: "/images/g1-woodcut.webp",
    solidBgColor: "#6CAEFF",
    isNew: true,
    playUrl: "/games/g1/play", // Custom play URL for Black Swan
  },
  {
    id: "g2",
    slug: "/games/g2",
    title: "죄수의 딜레마",
    subtitle: "",
    description: "",
    color: "#E7D9C3",
    bgColor: "from-stone-300 to-stone-400",
    icon: "⛓️",
    status: "active",
    image: "/images/g2-woodcut.webp",
    solidBgColor: "#E7D9C3",
    isNew: true,
    playUrl: "/games/g2/play", // Custom play URL for Prisoners Dilemma
  },
  {
    id: "g3",
    slug: "/games/g3",
    title: "시그널 디코딩",
    subtitle: "",
    description: "",
    color: "#E56F5E",
    bgColor: "from-orange-400 to-orange-500",
    icon: "🔍",
    status: "active",
    image: "/images/g3-woodcut.webp",
    solidBgColor: "#E56F5E",
    isNew: true,
    playUrl: "/games/g3/play", // Custom play URL for Signal Decoding
  },
]

export function getGameById(id: string): GameMeta | undefined {
  return GAMES.find((game) => game.id === id)
}

export type QuestionType = "객관식" | "주관식"

export type Question = {
  id: string
  questionType: QuestionType
  question: string
  options?: string[] // For multiple choice
  hint?: string | string[] // For short answer
  answer: string
  explanation: string
  newsLink: string
}

export type GameType = "BlackSwan" | "PrisonersDilemma" | "SignalDecoding"

export type GameDataStructure = {
  [key in GameType]: {
    [date: string]: Question[]
  }
}

// Map game IDs to game types
export const GAME_TYPE_MAP: Record<string, GameType> = {
  g1: "BlackSwan",
  g2: "PrisonersDilemma",
  g3: "SignalDecoding",
}

// Map game types to game IDs - Currently unused
// export const GAME_ID_MAP: Record<GameType, string> = {
//   BlackSwan: "g1",
//   PrisonersDilemma: "g2",
//   SignalDecoding: "g3",
// }

import answerData from "@/data/answer.json"

/**
 * Get questions for a specific game and date
 */
export function getQuestionsForDate(gameType: GameType, date: string): Question[] {
  try {
    const data = answerData as unknown as GameDataStructure
    return data[gameType]?.[date] || []
  } catch (error) {
    console.error(`[v0] Error loading questions for ${gameType} on ${date}:`, error)
    return []
  }
}

/**
 * Get all available dates for a specific game type
 */
export function getAvailableDates(gameType: GameType): string[] {
  try {
    const data = answerData as unknown as GameDataStructure
    const dates = Object.keys(data[gameType] || {})
    // Sort dates in descending order (newest first)
    return dates.sort((a, b) => b.localeCompare(a))
  } catch (error) {
    console.error(`[v0] Error loading dates for ${gameType}:`, error)
    return []
  }
}

/**
 * Get archive structure for a specific game type
 * Returns { year, months: [ { month, dates: [...] } ] }
 */
export function getArchiveStructure(gameType: GameType): {
  years: Array<{
    year: number
    months: Array<{
      month: number
      dates: string[]
    }>
  }>
} {
  const dates = getAvailableDates(gameType)

  // Group dates by year and month
  const yearMap = new Map<number, Map<number, string[]>>()

  for (const dateStr of dates) {
    const [year, month] = dateStr.split("-").map(Number)

    if (!yearMap.has(year)) {
      yearMap.set(year, new Map())
    }

    const monthMap = yearMap.get(year)!
    if (!monthMap.has(month)) {
      monthMap.set(month, [])
    }

    monthMap.get(month)!.push(dateStr)
  }

  // Convert to array structure
  const years = Array.from(yearMap.entries())
    .map(([year, monthMap]) => ({
      year,
      months: Array.from(monthMap.entries())
        .map(([month, dates]) => ({
          month,
          dates: dates.sort((a, b) => b.localeCompare(a)), // Sort dates descending
        }))
        .sort((a, b) => b.month - a.month), // Sort months descending
    }))
    .sort((a, b) => b.year - a.year) // Sort years descending

  return { years }
}

/**
 * Check if a date has questions available for a game type
 */
export function hasQuestionsForDate(gameType: GameType, date: string): boolean {
  const questions = getQuestionsForDate(gameType, date)
  return questions.length > 0
}

/**
 * Get the most recent date with questions for a game type
 */
export function getMostRecentDate(gameType: GameType): string | null {
  const dates = getAvailableDates(gameType)
  return dates.length > 0 ? dates[0] : null
}
