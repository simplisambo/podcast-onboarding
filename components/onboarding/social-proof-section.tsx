"use client"

import React from "react"
import { motion } from "framer-motion"

interface SocialProofSectionProps {
  isPlaying: boolean
}

export function SocialProofSection({ isPlaying }: SocialProofSectionProps) {
  const messages = [
    {
      text: "This podcast has completely changed how I think about wisdom and leadership. The guests are incredible!",
      name: "Nate"
    },
    {
      text: "Just finished listening to the latest episode. Nate and Sam ask such thoughtful questions. Really appreciate the depth.",
      name: "Chynah"
    },
    {
      text: "The way they break down complex ideas into practical wisdom is amazing. My go-to podcast now.",
      name: "Ike"
    }
  ]

  return (
    <motion.div
      className="mt-12 max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isPlaying ? 0.5 : 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {messages.map((message, index) => (
          <motion.div
            key={index}
            className="flex justify-start"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
          >
            <div className="max-w-xs">
              <div className="bg-gray-200 rounded-2xl rounded-bl-md px-4 py-2 shadow-sm">
                <p className="text-sm text-gray-800 leading-relaxed text-left" style={{ fontFamily: "var(--font-inter)" }}>
                  {message.text}
                </p>
              </div>
              <div className="mt-1">
                <span className="text-xs text-gray-500 font-medium" style={{ fontFamily: "var(--font-inter)" }}>{message.name}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
} 