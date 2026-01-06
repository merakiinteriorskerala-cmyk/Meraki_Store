"use client"

import { useEffect, useState } from "react"
import { clx } from "@medusajs/ui"

export default function ProductGridItem({
  children,
  index,
}: {
  children: React.ReactNode
  index: number
}) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, index * 100) // 100ms stagger delay
    return () => clearTimeout(timer)
  }, [index])

  return (
    <li
      className={clx(
        "w-full h-full transition-all duration-1000 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]",
        isVisible
          ? "opacity-100 translate-y-0 blur-0"
          : "opacity-0 translate-y-12 blur-sm"
      )}
    >
      {children}
    </li>
  )
}