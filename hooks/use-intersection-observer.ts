"use client"

import { useState, useEffect, useRef } from "react"

interface UseIntersectionObserverOptions {
  threshold?: number
  rootMargin?: string
  triggerOnce?: boolean
}

export function useIntersectionObserver(options: UseIntersectionObserverOptions = {}) {
  const { threshold = 0.5, rootMargin = "0px", triggerOnce = false } = options
  const [isIntersecting, setIsIntersecting] = useState(false)
  const [hasTriggered, setHasTriggered] = useState(false)
  const elementRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isVisible = entry.isIntersecting
        setIsIntersecting(isVisible)

        if (isVisible && triggerOnce && !hasTriggered) {
          setHasTriggered(true)
        }
      },
      { threshold, rootMargin },
    )

    observer.observe(element)

    return () => {
      observer.unobserve(element)
    }
  }, [threshold, rootMargin, triggerOnce, hasTriggered])

  return { elementRef, isIntersecting, hasTriggered }
}
