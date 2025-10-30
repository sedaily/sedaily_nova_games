import { UniversalQuizPlayer } from "@/components/games/UniversalQuizPlayer"
import type { Question } from "@/lib/games-data"

export default function TestPage() {
  // Sample questions with relatedArticle data
  const sampleQuestions: Question[] = [
    {
      id: "test-1",
      questionType: "객관식",
      question: "2024년 한국은행이 기준금리를 인하한 주된 이유는 무엇인가요?",
      options: [
        "물가 상승률이 목표치를 크게 상회했기 때문",
        "경기 둔화와 내수 부진을 완화하기 위해",
        "환율 안정을 위한 선제적 조치",
        "미국 연준의 금리 인상에 대응하기 위해",
      ],
      answer: "경기 둔화와 내수 부진을 완화하기 위해",
      explanation:
        "한국은행은 2024년 하반기 경기 둔화와 내수 부진이 지속되자, 경제 활력을 회복하기 위해 기준금리를 인하했습니다. 물가는 안정세를 보이고 있어 금리 인하 여력이 있다고 판단했습니다.",
      newsLink: "https://www.sedaily.com/NewsView/example1",
      tags: "경제·금융",
      relatedArticle: {
        title: "한은, 기준금리 3.25%로 0.25%p 인하...",
        excerpt:
          '한국은행 금융통화위원회가 11일 기준금리를 연 3.25%로 0.25%포인트 인하했다. 이창용 한은 총재는 "경기 둔화 우려가 커지고 물가 안정세가 이어지면서 금리 인하를 결정했다"고 밝혔다.',
      },
    },
    {
      id: "test-2",
      questionType: "객관식",
      question: "최근 반도체 업계에서 가장 주목받고 있는 기술 트렌드는?",
      options: ["3나노 공정 기술", "AI 반도체 개발", "양자컴퓨팅 칩", "메모리 반도체 고용량화"],
      answer: "AI 반도체 개발",
      explanation:
        "ChatGPT 등 생성형 AI의 폭발적 성장으로 AI 반도체 수요가 급증하고 있습니다. 엔비디아, AMD 등 글로벌 기업들이 AI 가속기 시장을 선점하기 위해 경쟁하고 있으며, 삼성전자와 SK하이닉스도 HBM(고대역폭 메모리) 등 AI 반도체 관련 제품 개발에 집중하고 있습니다.",
      newsLink: "https://www.sedaily.com/NewsView/example2",
      tags: "산업",
      relatedArticle: {
        title: "삼성전자, AI 반도체 시장 공략 본격화...HBM3E 양산 돌입",
        excerpt:
          "삼성전자가 차세대 고대역폭 메모리(HBM) 'HBM3E' 양산에 돌입했다. AI 서버용 핵심 부품인 HBM 시장에서 SK하이닉스를 추격하기 위한 전략이다. 업계는 올해 HBM 시장 규모가 전년 대비 2배 이상 성장할 것으로 전망하고 있다.",
      },
    },
    {
      id: "test-3",
      questionType: "주관식",
      question: "2024년 노벨 경제학상을 수상한 학자의 이름을 쓰시오.",
      answer: "대런 애쓰모글루",
      hint: "MIT 교수이며, 제도 경제학 연구로 유명합니다.",
      explanation:
        "2024년 노벨 경제학상은 대런 애쓰모글루(Daron Acemoglu), 사이먼 존슨(Simon Johnson), 제임스 로빈슨(James Robinson)에게 공동 수여되었습니다. 이들은 국가 간 번영의 차이를 설명하는 제도의 역할에 대한 연구로 수상했습니다.",
      newsLink: "https://www.sedaily.com/NewsView/example3",
      tags: "국제",
      relatedArticle: {
        title: "2024 노벨 경제학상, 제도 경제학 연구한 애쓰모글루 등 3인 공동 수상",
        excerpt:
          '스웨덴 왕립과학원은 14일(현지시간) 2024년 노벨 경제학상 수상자로 대런 애쓰모글루 MIT 교수, 사이먼 존슨 MIT 교수, 제임스 로빈슨 시카고대 교수를 선정했다고 발표했다. 이들은 "국가 간 번영 격차를 만드는 제도의 역할"을 규명한 공로를 인정받았다.',
      },
    },
  ]

  return (
    <div className="min-h-screen bg-[#FAFAF9] py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-[#0F2233] mb-2">신문 헤더 테스트 페이지</h1>
          <p className="text-lg text-[#0F2233]/70">UniversalQuizPlayer with NewsHeaderBlock - 서울경제 로고 포함</p>
        </div>

        <UniversalQuizPlayer
          questions={sampleQuestions}
          date="2024-10-30"
          gameType="BlackSwan"
          themeColor="#244961"
          disableSaveProgress={true}
        />
      </div>
    </div>
  )
}
