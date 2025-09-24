"use client"

import { useState, useEffect } from "react"

export function useScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const updateScrollProgress = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
      setScrollProgress(Math.min(100, Math.max(0, progress)))
    }

    window.addEventListener("scroll", updateScrollProgress, { passive: true })
    updateScrollProgress() // Initial calculation

    return () => window.removeEventListener("scroll", updateScrollProgress)
  }, [])

  return scrollProgress
}
