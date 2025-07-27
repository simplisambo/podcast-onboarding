"use client"

import React from "react"
import { motion } from "framer-motion"
import { Mic, Loader2 } from "lucide-react"
import { useGuestData } from "@/hooks/use-guest-data"

// Function to remove markdown headers from Notion content
function removeMarkdownHeaders(content: string): string {
  return content.replace(/^#+\s*/gm, '')
}

interface ConversationSectionProps {
  isPlaying: boolean
  guestName: string
  lastName: string
}

export function ConversationSection({ isPlaying, guestName, lastName }: ConversationSectionProps) {
  // Fetch guest data from Notion
  const { guestData, loading: guestLoading, error: guestError } = useGuestData(lastName)

  return (
    <motion.div animate={{ opacity: isPlaying ? 0.5 : 1 }} transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}>
      <section className="py-8">
        <div className="flex items-center mb-8">
          <div className="w-12 h-12 bg-[#2B6951] rounded-full flex items-center justify-center mr-4">
            <Mic className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-3xl font-bold text-gray-900" style={{ fontFamily: "var(--font-amaranth)" }}>
            Content & Conversation
          </h3>
        </div>

        <div className="space-y-6 text-base text-gray-700 leading-relaxed">
          {guestLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-[#2B6951] mr-2" />
              <span>Loading guest information...</span>
            </div>
          ) : null}
          
          <p>
            <strong className="text-[#2B6951]">{guestName}, you're the expert!</strong> We'll have some
            questions prepared, but feel free to take the conversation wherever you feel most led.
          </p>
          
          <p>
            Let us know if there's a topic you'd really love to cover. The best episodes are when guests are
            sharing what excites them most.
          </p>
          
          <p>
            We especially love hearing <strong className="text-[#2B6951]">stories from your own life</strong>{" "}
            that contain wisdom or practical takeaways.
          </p>
          
          {guestData?.pageContent && (
            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg mt-6">
              <h4 className="font-semibold text-[#2B6951] mb-4">Planned Questions:</h4>
              <div className="prose prose-sm max-w-none text-gray-700">
                <pre className="whitespace-pre-wrap font-sans">{removeMarkdownHeaders(guestData.pageContent)}</pre>
              </div>
            </div>
          )}
          
          {guestError && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-6">
              <p className="text-gray-600 text-center">
                Questions are under construction!
              </p>
            </div>
          )}
        </div>
      </section>
    </motion.div>
  )
} 