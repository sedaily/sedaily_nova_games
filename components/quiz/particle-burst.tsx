"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface Particle {
  id: number
  x: number
  y: number
  color: string
  size: number
  velocity: { x: number; y: number }
}

interface ParticleBurstProps {
  trigger: boolean
  x: number
  y: number
  color?: string
  particleCount?: number
}

export function ParticleBurst({ trigger, x, y, color = "#5B7CFF", particleCount = 15 }: ParticleBurstProps) {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    if (trigger) {
      const newParticles: Particle[] = Array.from({ length: particleCount }, (_, i) => ({
        id: i,
        x: 0,
        y: 0,
        color: i % 3 === 0 ? color : i % 3 === 1 ? "#9B8CFF" : "#22C55E",
        size: Math.random() * 6 + 3,
        velocity: {
          x: (Math.random() - 0.5) * 400,
          y: (Math.random() - 0.5) * 400,
        },
      }))
      setParticles(newParticles)

      // Clear particles after animation
      setTimeout(() => setParticles([]), 1000)
    }
  }, [trigger, color, particleCount])

  return (
    <div className="fixed inset-0 pointer-events-none z-50" style={{ left: x, top: y }}>
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              width: particle.size,
              height: particle.size,
              backgroundColor: particle.color,
              boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
            }}
            initial={{
              x: 0,
              y: 0,
              scale: 0,
              opacity: 1,
            }}
            animate={{
              x: particle.velocity.x,
              y: particle.velocity.y,
              scale: [0, 1, 0],
              opacity: [1, 0.8, 0],
            }}
            exit={{
              opacity: 0,
              scale: 0,
            }}
            transition={{
              duration: 0.8,
              ease: "easeOut",
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}
