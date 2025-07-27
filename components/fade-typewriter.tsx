"use client"

import { useState, useEffect, useMemo } from "react"

interface FadeTypewriterProps {
  text: string
  delay?: number
  letterDelay?: number
  className?: string
  onComplete?: () => void
}

export function FadeTypewriter({
  text,
  delay = 0,
  letterDelay = 50,
  className = "",
  onComplete,
}: FadeTypewriterProps) {
  // Track how many characters should currently be visible
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(
        () => setCurrentIndex((prev) => prev + 1),
        currentIndex === 0 ? delay : letterDelay,
      )

      return () => clearTimeout(timer)
    }

    if (currentIndex === text.length && onComplete) {
      onComplete()
    }
  }, [currentIndex, text.length, delay, letterDelay, onComplete])

  // Memoize the substring to avoid unnecessary splits on every render
  const visibleText = useMemo(() => text.slice(0, currentIndex), [text, currentIndex])

  return (
    <span className={className}>
      {visibleText.split("").map((char, index) => (
        <span
          key={`char-${index}`}
          className="inline-block animate-fade-in"
          style={{
            animationDelay: `${(delay + index * letterDelay) / 1000}s`,
            animationFillMode: "both",
          }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </span>
  )
}
