"use client"

import React from "react"
import { motion } from "framer-motion"
import { VideoPlayer } from "./video-player"
import { SocialProofSection } from "./social-proof-section"

interface HeroSectionProps {
  isPlaying: boolean
  setIsPlaying: (playing: boolean) => void
  hasPlayedOnce: boolean
  setHasPlayedOnce: (played: boolean) => void
  progress: number
  setProgress: (progress: number) => void
  isDragging: boolean
  setIsDragging: (dragging: boolean) => void
}

export function HeroSection({
  isPlaying,
  setIsPlaying,
  hasPlayedOnce,
  setHasPlayedOnce,
  progress,
  setProgress,
  isDragging,
  setIsDragging,
}: HeroSectionProps) {
  return (
    <section className="text-center">
      <motion.h2
        className="text-xl sm:text-3xl md:text-4xl lg:text-5xl mb-4"
        style={{ fontFamily: "var(--font-amaranth)" }}
        animate={{ opacity: isPlaying ? 0.5 : 1 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      >
        Welcome to <span className="text-[#2B6951] font-bold">Walking With The Wise!</span>
      </motion.h2>
      {/* Add extra space below the heading */}
      <div className="mb-16" />
      {/* Modern Video Player with Custom Controls */}
      <VideoPlayer
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        hasPlayedOnce={hasPlayedOnce}
        setHasPlayedOnce={setHasPlayedOnce}
        progress={progress}
        setProgress={setProgress}
        isDragging={isDragging}
        setIsDragging={setIsDragging}
      />
      {/* Social Proof Section */}
      <SocialProofSection isPlaying={isPlaying} />
    </section>
  )
} 