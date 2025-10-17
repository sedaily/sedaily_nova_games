import type { Metadata } from "next"
import { GameHubGrid } from "@/components/games/GameHubGrid"
import Image from "next/image"

export const metadata: Metadata = {
  title: "게임 허브 | 서울경제 게임",
  description: "모든 퍼즐을 무료로 플레이하세요. 오늘의 경제 퀴즈, 뉴스 성향 테스트, 뉴스 단어 맞추기",
  openGraph: {
    title: "게임 허브 | 서울경제 게임",
    description: "모든 퍼즐을 무료로 플레이하세요",
  },
}

export default function GamesPage() {
  return (
    <section className="container mx-auto px-4 md:px-6 lg:px-8 max-w-[1240px] py-10 md:py-14">
      <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 lg:gap-16 mb-16 md:mb-20 lg:mb-24">
        {/* Left: Illustration */}
        <div className="w-full md:w-auto flex justify-center md:justify-start shrink-0">
          <div className="relative w-[400px] md:w-[480px] lg:w-[560px] aspect-square rounded-2xl overflow-hidden">
            <Image
              src="/games/hero-main.png"
              alt="Seoul Economic News Games - Three interlocking gears representing Black Swan, Prisoner's Dilemma, and Signal Decoding"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Right: Text */}
        <div className="flex-1 text-center flex flex-col justify-center">
          <h1
            className="text-2xl md:text-3xl lg:text-4xl font-title tracking-[-0.01em] leading-tight mb-4 md:mb-5 uppercase"
            style={{ color: "#0D2239" }}
          >
            Seoul Economic News Games
          </h1>
          <p
            className="text-base md:text-lg lg:text-xl font-sans tracking-[-0.01em] leading-relaxed"
            style={{ color: "#0D2239" }}
          >
            <span className="font-bold">하루 5분</span>, 기사로 문해력과 판단력을 단련하고
            <br />
            지성을 다듬는 실전형 뉴스 퀴즈.
          </p>
        </div>
      </div>

      {/* Games grid - unchanged */}
      <GameHubGrid />
    </section>
  )
}
