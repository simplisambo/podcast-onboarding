"use client"

import { useState, useEffect } from "react"

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
  letterDelay = 50, // Reduced to 50ms for overlapping effect
  className = "",
  onComplete,
}: FadeTypewriterProps) {
  const [displayedText, setDisplayedText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(
        () => {
          setDisplayedText((prev) => prev + text[currentIndex])
          setCurrentIndex((prev) => prev + 1)
        },
        currentIndex === 0 ? delay : letterDelay,
      )

      return () => clearTimeout(timer)
    } else if (currentIndex === text.length && onComplete) {
      onComplete()
    }
  }, [currentIndex, text, delay, letterDelay, onComplete])

  return (
    <span className={className}>
      {displayedText.split("").map((char, index) => (
        <span
          key={index}
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
