import { NextResponse } from "next/server"

const API_ENDPOINT = "https://zetqmdpbc1.execute-api.us-east-1.amazonaws.com/prod/quizzes/all"

// API 응답 타입
type APIQuizItem = {
  gameType: string
  quizDate: string
  data: {
    questions: Array<{
      id: string
      questionType: string
      question: string
      options?: string[]
      hint?: string | string[]
      answer: string
      explanation: string
      newsLink: string
      tags?: string
    }>
  }
}

type Question = {
  id: string
  questionType: string
  question: string
  options?: string[]
  hint?: string | string[]
  answer: string
  explanation: string
  newsLink: string
  tags?: string
}

type GameDataStructure = {
  BlackSwan: Record<string, Question[]>
  PrisonersDilemma: Record<string, Question[]>
  SignalDecoding: Record<string, Question[]>
}

/**
 * API 응답을 로컬 JSON 구조로 변환
 */
function transformAPIResponse(apiData: APIQuizItem[]): GameDataStructure {
  const result: GameDataStructure = {
    BlackSwan: {},
    PrisonersDilemma: {},
    SignalDecoding: {},
  }

  for (const item of apiData) {
    const { gameType, quizDate, data } = item
    
    if (gameType in result) {
      result[gameType as keyof GameDataStructure][quizDate] = data.questions
    }
  }

  return result
}

export async function GET() {
  try {
    console.log("[API Route] Fetching quiz data from API Gateway...")
    
    const response = await fetch(API_ENDPOINT, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // 5분 캐싱
      next: { revalidate: 300 },
    })

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }

    const data = await response.json()
    
    // API Gateway 응답의 body가 JSON 문자열인 경우 파싱
    let rawData: APIQuizItem[]
    if (typeof data.body === "string") {
      rawData = JSON.parse(data.body)
    } else if (data.body) {
      rawData = data.body
    } else {
      rawData = data
    }

    // API 응답을 로컬 JSON 구조로 변환
    const quizData = transformAPIResponse(rawData)

    console.log("[API Route] Quiz data fetched successfully")
    
    return NextResponse.json(quizData, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    })
  } catch (error) {
    console.error("[API Route] Error fetching quiz data:", error)
    
    // 에러 시 빈 구조 반환
    return NextResponse.json(
      {
        BlackSwan: {},
        PrisonersDilemma: {},
        SignalDecoding: {},
      },
      {
        status: 200, // 빈 데이터라도 200 반환
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
        },
      }
    )
  }
}
