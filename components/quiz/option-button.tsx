"use client"

import { Button } from "@/components/ui/button"
import { Check, X } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

type OptionState = "default" | "correct" | "wrong" | "disabled"

interface OptionButtonProps {
  label: string
  selected: boolean
  state: OptionState
  onClick: () => void
  disabled?: boolean
}

export function OptionButton({ label, selected, state, onClick, disabled = false }: OptionButtonProps) {
  const getStateStyles = () => {
    switch (state) {
      case "correct":
        return "bg-success/20 border-success text-success-foreground ring-success/30"
      case "wrong":
        return "bg-destructive/20 border-destructive text-destructive-foreground ring-destructive/30"
      case "disabled":
        return "opacity-50 cursor-not-allowed"
      default:
        return selected
          ? "bg-primary/20 border-primary text-primary-foreground ring-primary/30"
          : "bg-card border-border hover:bg-muted/50 hover:border-muted-foreground/20"
    }
  }

  const getIcon = () => {
    if (state === "correct") return <Check className="w-5 h-5" />
    if (state === "wrong") return <X className="w-5 h-5" />
    return null
  }

  return (
    <motion.div
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      transition={{ duration: 0.12 }}
    >
      <Button
        variant="outline"
        size="lg"
        onClick={onClick}
        disabled={disabled}
        className={cn(
          "w-full justify-between text-left h-auto p-4 korean-text",
          "transition-all duration-200 ease-out",
          "ring-1 ring-transparent focus:ring-2",
          "min-h-[44px]", // Accessibility: minimum tap target
          getStateStyles(),
        )}
        role="radio"
        aria-checked={selected}
        aria-describedby={state !== "default" ? `option-feedback-${label}` : undefined}
      >
        <span className="text-base leading-relaxed flex-1 pr-2">{label}</span>
        {getIcon() && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.16, ease: "easeOut" }}>
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
  )
}
