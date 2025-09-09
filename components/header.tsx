import { Button } from "@/components/ui/button"
import Link from "next/link"

export function Header() {
  return (
    <header
      className="sticky top-0 z-50 w-full border-b border-[#E6EEF7] shadow-[0_4px_12px_rgba(0,0,0,0.04)] backdrop-blur-md bg-opacity-96"
      style={{ background: "linear-gradient(180deg, #F4F9FF 0%, #EDF5FF 100%)" }}
    >
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          <div className="flex items-center">
            <span className="text-xl font-bold text-foreground">서울경제 </span>
            <span className="text-xl font-normal text-muted-foreground">Digital</span>
          </div>

          <div className="flex items-center space-x-6">
            <Link
              href="/"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-150 focus-ring rounded-md px-2 py-1"
            >
              홈
            </Link>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-sm hover:bg-primary/5 hover:text-primary transition-all duration-150 focus-ring hover:scale-105 active:scale-98"
              >
                무료 회원가입
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-sm hover:bg-primary/5 hover:text-primary transition-all duration-150 focus-ring hover:scale-105 active:scale-98"
              >
                로그인
              </Button>
              <Button
                size="sm"
                className="text-sm rounded-full px-4 focus-ring hover:scale-105 active:scale-98 transition-all duration-150 shadow-soft hover:shadow-glow"
              >
                뉴스레터 구독
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
