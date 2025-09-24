import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Fira_Code } from "next/font/google"
import { Suspense } from "react"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
})

const firaCode = Fira_Code({
  subsets: ["latin"],
  variable: "--font-fira-code",
  display: "swap",
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "언론고시 AI 퀴즈",
  description: "언론고시생을 위한 AI 기반 시사 퀴즈 플랫폼",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko" className="dark">
      <body className={`font-sans ${inter.variable} ${firaCode.variable} antialiased`}>
        {/* <a href="#main-content" className="skip-to-content korean-text">
          메인 콘텐츠로 건너뛰기
        </a> */}
        <main id="main-content">
          <Suspense fallback={null}>{children}</Suspense>
        </main>
   
      </body>
    </html>
  )
}
