"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Check, X } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { useState, useRef } from "react"
import { ParticleBurst } from "./particle-burst"

type OptionState = "default" | "correct" | "wrong" | "disabled"

interface EnhancedOptionButtonProps {
  label: string
  selected: boolean
  state: OptionState
  onClick: () => void
  disabled?: boolean
  index: number
}

export function EnhancedOptionButton({
  label,
  selected,
  state,
  onClick,
  disabled = false,
  index,
}: EnhancedOptionButtonProps) {
  const [showParticles, setShowParticles] = useState(false)
  const [particlePosition, setParticlePosition] = useState({ x: 0, y: 0 })
  const buttonRef = useRef<HTMLButtonElement>(null)

  const getStateStyles = () => {
    switch (state) {
      case "correct":
        return "bg-success/20 border-success text-success-foreground ring-success/30 shadow-success/20"
      case "wrong":
        return "bg-destructive/20 border-destructive text-destructive-foreground ring-destructive/30 shadow-destructive/20"
      case "disabled":
        return "opacity-50 cursor-not-allowed"
      default:
        return selected
          ? "bg-primary/20 border-primary text-primary-foreground ring-primary/30 shadow-primary/20"
          : "bg-card/80 border-border hover:bg-muted/50 hover:border-muted-foreground/20 hover:shadow-lg"
    }
  }

  const getIcon = () => {
    if (state === "correct") return <Check className="w-5 h-5" />
    if (state === "wrong") return <X className="w-5 h-5" />
    return null
  }

  const handleClick = (event: React.MouseEvent) => {
    if (disabled) return

    const rect = buttonRef.current?.getBoundingClientRect()
    if (rect) {
      setParticlePosition({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      })
      setShowParticles(true)
      setTimeout(() => setShowParticles(false), 100)
    }

    onClick()
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{
          delay: index * 0.1,
          duration: 0.5,
          ease: "easeOut",
        }}
        whileHover={!disabled ? { scale: 1.02, y: -2 } : {}}
        whileTap={!disabled ? { scale: 0.98 } : {}}
      >
        <Button
          ref={buttonRef}
          variant="outline"
          size="lg"
          onClick={handleClick}
          disabled={disabled}
          className={cn(
            "w-full justify-between text-left h-auto p-6 korean-text",
            "transition-all duration-300 ease-out",
            "ring-1 ring-transparent focus:ring-2",
            "min-h-[56px] shadow-md backdrop-blur-sm",
            "border-2 rounded-xl",
            getStateStyles(),
          )}
          role="radio"
          aria-checked={selected}
          aria-describedby={state !== "default" ? `option-feedback-${label}` : undefined}
        >
          <span className="text-base leading-relaxed flex-1 pr-3 font-medium">{label}</span>
          {getIcon() && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                duration: 0.3,
                ease: "easeOut",
                type: "spring",
                stiffness: 200,
              }}
            >
              {getIcon()}
            </motion.div>
          )}
        </Button>
        {state !== "default" && (
          <div id={`option-feedback-${label}`} className="sr-only">
            {state === "correct" ? "정답입니다" : "오답입니다"}
          </div>
        )}
      </motion.div>

      <ParticleBurst
        trigger={showParticles}
        x={particlePosition.x}
        y={particlePosition.y}
        color={state === "correct" ? "#22C55E" : state === "wrong" ? "#EF4444" : "#5B7CFF"}
      />
    </>
  )
}
