"use client"

import React from "react"
import { motion } from "framer-motion"
import { Video, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

interface TechSectionProps {
  isPlaying: boolean
}

export function TechSection({ isPlaying }: TechSectionProps) {
  return (
    <motion.div animate={{ opacity: isPlaying ? 0.5 : 1 }} transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}>
      <section className="py-8">
        <div className="flex items-center mb-8">
          <div className="w-12 h-12 bg-[#2B6951] rounded-full flex items-center justify-center mr-4">
            <Video className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-3xl font-bold text-gray-900" style={{ fontFamily: "var(--font-amaranth)" }}>
            Tech Setup
          </h3>
        </div>

        <div className="space-y-8">
          <div className="bg-green-50 p-6 rounded-lg">
            <h4
              className="text-xl font-semibold text-[#2B6951] mb-3"
              style={{ fontFamily: "var(--font-amaranth)" }}
            >
              Recording Platform
            </h4>
            <p className="text-base text-gray-700 mb-4">
              We'll be recording on <strong>Riverside</strong>, a video podcast recording site sort of like
              Zoom. No special software needed.
            </p>
            <Button asChild className="bg-[#2B6951] hover:bg-[#1e4a3a] text-white">
              <a
                href="https://riverside.fm/studio/walking-with-the-wise-RG9lo?t=8007373b3bef44669da6&gw=on"
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Test Your Setup Here
              </a>
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4
                className="text-xl font-semibold text-[#2B6951] mb-3"
                style={{ fontFamily: "var(--font-amaranth)" }}
              >
                Audio
              </h4>
              <ul className="space-y-2 text-base text-gray-700">
                <li>• External mic is great if you have one</li>
                <li>• If not, no worries!</li>
                <li>• Avoid AirPods, please (poor sound quality)</li>
              </ul>
            </div>
            <div>
              <h4
                className="text-xl font-semibold text-[#2B6951] mb-3"
                style={{ fontFamily: "var(--font-amaranth)" }}
              >
                Environment preferences
              </h4>
              <ul className="space-y-2 text-base text-gray-700">
                <li>• A pleasant background, like a living room or studio</li>
                <li>• Natural light or ring light is ideal</li>
                <li>• Whatever you have is fine, though!</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  )
} 