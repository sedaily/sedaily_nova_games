/**
 * Quiz API Client
 * Next.js API Route를 통해 퀴즈 데이터를 가져오는 유틸리티
 */

import type { Question } from "./games-data"

// Next.js API Route (내부 프록시)
const API_ENDPOINT = "/api/quiz"

export interface QuizDataStructure {
  BlackSwan?: Record<string, Question[]>
  PrisonersDilemma?: Record<string, Question[]>
  SignalDecoding?: Record<string, Question[]>
}

let cachedQuizData: QuizDataStructure | null = null
let cacheTimestamp: number | null = null
const CACHE_DURATION = 5 * 60 * 1000 // 5분 캐시

/**
 * Next.js API Route를 통해 퀴즈 데이터 가져오기
 * 5분간 캐시 유지
 */
export async function fetchQuizData(): Promise<QuizDataStructure> {
  // 캐시 체크
  if (cachedQuizData && cacheTimestamp && Date.now() - cacheTimestamp < CACHE_DURATION) {
    console.log("[v0] Using cached quiz data")
    return cachedQuizData
  }

  try {
    console.log("[v0] Fetching quiz data from Next.js API Route...")
    const response = await fetch(API_ENDPOINT, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }

    const quizData: QuizDataStructure = await response.json()

    // 캐시 업데이트
    cachedQuizData = quizData
    cacheTimestamp = Date.now()

    console.log("[v0] Quiz data fetched successfully from API")
    return quizData
  } catch (error) {
    console.error("[v0] Error fetching quiz data from API:", error)
    
    // 캐시된 데이터가 있으면 사용
    if (cachedQuizData) {
      console.log("[v0] Using stale cached data due to API error")
      return cachedQuizData
    }
    
    // fallback: 빈 구조 반환
    console.warn("[v0] Returning empty quiz data structure")
    return {
      BlackSwan: {},
      PrisonersDilemma: {},
      SignalDecoding: {},
    }
  }
}

/**
 * 캐시 초기화 (필요 시 사용)
 */
export function clearQuizDataCache(): void {
  cachedQuizData = null
  cacheTimestamp = null
  console.log("[v0] Quiz data cache cleared")
}
