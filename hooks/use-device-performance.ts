"use client"

import { useState, useEffect } from "react"

interface DevicePerformance {
  isMobile: boolean
  isLowEnd: boolean
  motionLevel: "none" | "reduced" | "full"
}

interface NavigatorConnection {
  effectiveType?: string
  addEventListener?: (type: string, listener: EventListenerOrEventListenerObject) => void
  removeEventListener?: (type: string, listener: EventListenerOrEventListenerObject) => void
}

interface ExtendedNavigator extends Navigator {
  deviceMemory?: number
  connection?: NavigatorConnection
}

export function useDevicePerformance(): DevicePerformance {
  const [performance, setPerformance] = useState<DevicePerformance>({
    isMobile: false,
    isLowEnd: false,
    motionLevel: "full",
  })

  useEffect(() => {
    const checkDevicePerformance = () => {
      const extNavigator = navigator as ExtendedNavigator

      // Check if mobile device
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

      // Check for low-end device indicators
      const isLowEnd =
        // Low memory
        (extNavigator.deviceMemory !== undefined && extNavigator.deviceMemory < 4) ||
        // Slow connection
        (extNavigator.connection?.effectiveType === "slow-2g") ||
        (extNavigator.connection?.effectiveType === "2g") ||
        // Reduced CPU cores
        navigator.hardwareConcurrency < 4

      // Check motion preferences
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

      let motionLevel: "none" | "reduced" | "full" = "full"

      if (prefersReducedMotion) {
        motionLevel = "none"
      } else if (isLowEnd || isMobile) {
        motionLevel = "reduced"
      }

      setPerformance({
        isMobile,
        isLowEnd,
        motionLevel,
      })
    }

    checkDevicePerformance()

    // Listen for connection changes
    const extNavigator = navigator as ExtendedNavigator
    if (extNavigator.connection && typeof extNavigator.connection.addEventListener === "function") {
      extNavigator.connection.addEventListener("change", checkDevicePerformance)
    }

    // Listen for motion preference changes
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    mediaQuery.addEventListener("change", checkDevicePerformance)

    return () => {
      if (extNavigator.connection && typeof extNavigator.connection.removeEventListener === "function") {
        extNavigator.connection.removeEventListener("change", checkDevicePerformance)
      }
      mediaQuery.removeEventListener("change", checkDevicePerformance)
    }
  }, [])

  return performance
}
