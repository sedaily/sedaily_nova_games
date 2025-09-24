import type { QuizItem, AnswerMap } from "@/types/quiz"

export const sampleQuizData: QuizItem[] = [
  {
    id: 1,
    question:
      "한국 정부가 내년 첨단전략산업기금채 15조 원과 적자국채 110조 원을 동시 발행할 때 글로벌 채권시장에 미치는 가장 직접적인 영향은?",
    passage: "",
    options: [
      "한국 국채 금리 상승으로 기업 자금조달 비용 증가",
      "아시아 신흥국 통화 약세 압력 확산",
      "글로벌 달러 유동성 한국 집중 → 원화 강세",
      "미국 국채 수익률 하락 → 안전자산 선호 심화",
    ],
    answer: "한국 국채 금리 상승으로 기업 자금조달 비용 증가",
    explanation:
      "대량의 정부채권 발행은 채권 공급 증가로 이어져 국채 금리 상승 압력을 만들고, 이는 기업들의 자금조달 비용 증가로 직결됩니다.",
    newsLink: "https://www.sedaily.com/NewsView/2GY0HXFLP9",
  },
  {
    id: 2,
    question:
      "정부가 내년 132조원 규모의 적자국채와 보증채 발행을 계획한 것이 국내 채권시장에 미치는 가장 직접적인 영향은?",
    passage: "",
    options: [
      "대량 공급 → 장기 채권금리 상승 압력 증가",
      "회사채 발행 기업들의 자금조달 비용 부담 가중",
      "채권형 펀드 투자자들의 수익률 변동성 확대",
      "정부 재정건전성 우려로 국가신용등급 하향 검토",
    ],
    answer: "대량 공급 → 장기 채권금리 상승 압력 증가",
    explanation:
      "132조원 규모의 대량 채권 발행은 채권시장에 공급 과잉을 야기하여 장기 채권금리 상승 압력을 직접적으로 증가시킵니다.",
    newsLink: "https://www.sedaily.com/NewsView/2GY0IG6RYE",
  },
  {
    id: 3,
    question: "MSCI 한국 지수의 편입 종목 감소가 글로벌 자금 유입에 미치는 직접적 영향은?",
    passage: "",
    options: [
      "한국 증시 패시브 자금 유입 규모 축소",
      "개별 종목 주가 변동성 일시 감소",
      "국내 기관투자자 매수 비중 확대",
      "외국인 단기 차익 실현 거래 증가",
    ],
    answer: "한국 증시 패시브 자금 유입 규모 축소",
    explanation:
      "MSCI 지수 편입 종목이 감소하면 해당 지수를 추종하는 패시브 펀드들의 한국 증시 투자 비중이 줄어들어 자금 유입 규모가 축소됩니다.",
    newsLink: "https://www.sedaily.com/NewsView/2GY00KXAMA",
  },
  {
    id: 4,
    question:
      "코스피 지수가 사상 최고치를 경신했지만 PER·PBR이 전고점보다 낮게 나타난 현상이 주식시장에 미치는 가장 직접적인 영향은?",
    passage: "",
    options: [
      "기업 실적 개선이 주가 상승을 뒷받침 → 추가 상승 동력 확보",
      "외국인 매도세 확산으로 지수 조정 압력 증가",
      "개인투자자 차익실현 매물 출회 → 거래량 급증",
      "중앙은행 금리 인상 우려로 유동성 위축 가능성",
    ],
    answer: "기업 실적 개선이 주가 상승을 뒷받침 → 추가 상승 동력 확보",
    explanation:
      "지수 최고치 경신에도 밸류에이션 지표가 낮다는 것은 기업 실적 개선이 주가 상승을 뒷받침하고 있음을 의미하여 추가 상승 동력을 제공합니다.",
    newsLink: "https://www.sedaily.com/NewsView/2GXZ4ADMSF",
  },
  {
    id: 5,
    question: "미 연준의 기준금리 0.25%p 인하가 글로벌 자본시장에 미치는 가장 직접적인 영향은?",
    passage: "",
    options: [
      "신흥국 통화 강세·자본 재유입",
      "달러 약세 → 원자재 가격 상승",
      "글로벌 채권 수익률 하락 압력",
      "미국 기업 해외 차입 비용 증가",
    ],
    answer: "글로벌 채권 수익률 하락 압력",
    explanation:
      "연준의 기준금리 인하는 미국 채권 수익률 하락을 직접적으로 유발하며, 이는 글로벌 채권시장 전반의 수익률 하락 압력으로 확산됩니다.",
    newsLink: "https://www.sedaily.com/NewsView/2GXYNP1UI7",
  },
]

export function grade(selected: string, answer: string): boolean {
  return selected.trim() === answer.trim()
}

export function getQuizProgress(): AnswerMap {
  if (typeof window === "undefined") return {}

  try {
    const stored = localStorage.getItem("quiz-progress-v1")
    return stored ? JSON.parse(stored) : {}
  } catch {
    return {}
  }
}

export function saveQuizProgress(progress: AnswerMap): void {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem("quiz-progress-v1", JSON.stringify(progress))
  } catch (error) {
    console.error("Failed to save quiz progress:", error)
  }
}
