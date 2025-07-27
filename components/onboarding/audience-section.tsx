"use client"

import React from "react"
import { motion } from "framer-motion"
import { Users } from "lucide-react"

interface AudienceSectionProps {
  isPlaying: boolean
}

export function AudienceSection({ isPlaying }: AudienceSectionProps) {
  return (
    <motion.div animate={{ opacity: isPlaying ? 0.5 : 1 }} transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}>
      <section className="py-8">
        <div className="flex items-center mb-8">
          <div className="w-12 h-12 bg-[#2B6951] rounded-full flex items-center justify-center mr-4">
            <Users className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-3xl font-bold text-gray-900" style={{ fontFamily: "var(--font-amaranth)" }}>
            About our Audience
          </h3>
        </div>

        <div className="prose prose-lg max-w-none">
          <p className="text-base text-gray-700 leading-relaxed mb-6">
            We try to keep in mind this audience demographic:
          </p>

          <div className="grid md:grid-cols-3 gap-8 mt-8">
            <div className="text-center p-6 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-[#2B6951] mb-2">82%</div>
              <div className="text-sm text-gray-700">Ages 18-27</div>
            </div>
            <div className="text-center p-6 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-[#2B6951] mb-2">50/50</div>
              <div className="text-sm text-gray-700">Male/Female</div>
            </div>
            <div className="text-center p-6 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-[#2B6951] mb-2">Mostly Christian</div>
              <div className="text-sm text-gray-700">or seeking</div>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  )
} 