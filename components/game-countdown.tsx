"use client"

import { useState, useEffect } from "react"

export type GameCountdownProps = {
  isActive: boolean
  onComplete: () => void
  seconds?: number
  label?: string
  autoFocusTargetId?: string
}

export function GameCountdown({
  isActive,
  onComplete,
  seconds = 3,
  label = "곧 시작합니다",
  autoFocusTargetId,
}: GameCountdownProps) {
  const [countdown, setCountdown] = useState(seconds)

  useEffect(() => {
    if (!isActive) return

    setCountdown(seconds)

    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur()
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isActive, seconds])

  useEffect(() => {
    if (isActive && countdown === 0) {
      onComplete()

      if (autoFocusTargetId) {
        setTimeout(() => {
          const targetElement = document.getElementById(autoFocusTargetId)
          if (targetElement) {
            targetElement.focus()
          }
        }, 100)
      }
    }
  }, [countdown, isActive, onComplete, autoFocusTargetId])

  if (!isActive) return null

  return (
    <div
      className="fixed inset-0 bg-black/50 flex flex-col items-center justify-center z-50"
      style={{ pointerEvents: "all" }}
    >
      {label && <div className="text-xl text-white/80 mb-8 font-medium">{label}</div>}

      <div
        className="text-8xl md:text-9xl font-bold text-white select-none"
        role="status"
        aria-live="polite"
        aria-label={countdown > 0 ? `${countdown}초 남음` : "게임 시작"}
        style={{
          animation: countdown > 0 ? "scale-fade 0.8s ease-out" : "fade-out 0.3s ease-out",
          transform: countdown === 0 ? "scale(0)" : "scale(1)",
        }}
      >
        {countdown > 0 ? countdown : "시작!"}
      </div>

      <style jsx>{`
        @keyframes scale-fade {
          0% { 
            transform: scale(0.5); 
            opacity: 0; 
          }
          50% { 
            transform: scale(1.2); 
            opacity: 1; 
          }
          100% { 
            transform: scale(1); 
            opacity: 1; 
          }
        }
        
        @keyframes fade-out {
          0% { 
            transform: scale(1); 
            opacity: 1; 
          }
          100% { 
            transform: scale(0.8); 
            opacity: 0; 
          }
        }
        
        @media (prefers-reduced-motion: reduce) {
          [style*="animation"] {
            animation: none !important;
          }
          
          .text-8xl, .text-9xl {
            transition: opacity 0.2s ease-out;
          }
        }
      `}</style>
    </div>
  )
}
