"use client"

import type React from "react"

import { motion, type MotionProps } from "framer-motion"
import { useDevicePerformance } from "@/hooks/use-device-performance"

interface AccessibleMotionWrapperProps extends MotionProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  reducedMotionVariant?: MotionProps
}

export function AccessibleMotionWrapper({
  children,
  fallback,
  reducedMotionVariant,
  ...motionProps
}: AccessibleMotionWrapperProps) {
  const { motionLevel } = useDevicePerformance()

  // No motion - return static content
  if (motionLevel === "none") {
    return <div>{fallback || children}</div>
  }

  // Reduced motion - use simplified animations
  if (motionLevel === "reduced" && reducedMotionVariant) {
    return <motion.div {...reducedMotionVariant}>{children}</motion.div>
  }

  // Full motion - use all animations
  return <motion.div {...motionProps}>{children}</motion.div>
}
