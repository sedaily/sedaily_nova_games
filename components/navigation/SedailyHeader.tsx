"use client"

import Link from "next/link"

export function SedailyHeader() {
  return (
    <header role="banner" className="sticky top-0 z-50 w-full bg-white border-b border-border">
      <div className="max-w-screen-xl mx-auto h-14 sm:h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div className="flex items-center gap-4 sm:gap-6">
          <Link
            href="https://sedaily.ai/"
            className="text-[#3B82F6] font-extrabold text-xl korean-heading hover:text-[#306fef] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B82F6] focus-visible:rounded"
            aria-label="서울경제 홈으로 이동"
          >
            서울경제
          </Link>

          <nav className="hidden sm:flex items-center gap-4 text-sm korean-text">
            <Link
              href="https://sedaily.ai/ai-prism"
              className="text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B82F6] focus-visible:rounded"
              aria-label="AI 프리즘 페이지로 이동"
            >
              AI 프리즘
            </Link>

            <Link
              href="https://sedaily.ai/economic-dragon"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B82F6] focus-visible:rounded"
              aria-label="경제용 페이지로 이동 (새 탭)"
            >
              경제용
            </Link>

            <Link
              href="/games"
              className="text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B82F6] focus-visible:rounded"
              aria-label="게임즈 페이지로 이동"
            >
              게임즈
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">{/* Avatar */}</div>
      </div>
    </header>
  )
}
