"use client"

import React from "react"
import { motion } from "framer-motion"

interface FooterSectionProps {
  isPlaying: boolean
  guestName: string
}

export function FooterSection({ isPlaying, guestName }: FooterSectionProps) {
  return (
    <motion.div animate={{ opacity: isPlaying ? 0.5 : 1 }} transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}>
      <footer className="text-center py-12 border-t border-gray-100">
        <p className="text-2xl font-semibold text-[#2B6951] mb-2">Thanks again for joining us, {guestName}!</p>
        <p className="text-lg text-gray-600 mb-4">
          We can't wait to walk with you.
        </p>
      </footer>
    </motion.div>
  )
} 