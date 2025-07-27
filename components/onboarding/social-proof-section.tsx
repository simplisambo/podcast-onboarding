"use client"

import React from "react"
import { motion } from "framer-motion"

interface SocialProofSectionProps {
  isPlaying: boolean
}

export function SocialProofSection({ isPlaying }: SocialProofSectionProps) {
  const messages = [

    {
      text: "I have really been enjoying it ... trying to diligently strengthen my relationship with God, and it has had a lot of things I needed to hear.",
      name: "Chynah"
    },
    {
      text: "Phenomenal topics covered, phenomenal featured guests with loads of wisdom, and phenomenal hosts who actively set the bar high for this generation.",
      name: "Cooper"
    },
    {
      text: "Really good pod, that guy [David Benham, a guest] has a lot of substance. Really humbling to listen to such an impressive guy.",
      name: "Ike"
    },
    /*{
      text: " A very thought-provoking podcast! I appreciated the thoughtful discussion on a neglected topic. The practicality was helpful too.",
      name: "Reagan"
    }*/
  ]

  return (
    <motion.div
      className="mt-12 max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isPlaying ? 0.5 : 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Mobile: 2 messages */}
      <div className="grid grid-cols-2 md:hidden gap-4 items-center">
        {messages.slice(0, 2).map((message, index) => (
          <motion.div
            key={index}
            className="flex justify-start"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
          >
            <div className="w-full">
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

      {/* Desktop: 3 messages */}
      <div className="hidden md:grid md:grid-cols-3 gap-4 items-center">
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