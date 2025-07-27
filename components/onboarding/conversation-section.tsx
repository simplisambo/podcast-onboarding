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
            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg mt-6" style={{ fontSize: "1rem" }}>
              <h4 className="font-semibold text-[#2B6951] mb-6 text-center">Structure</h4>
              <div className="space-y-6">
                <div className="space-y-3">
                  <p className="font-medium text-[#2B6951] mb-2" style={{ fontSize: "1rem", lineHeight: "1.5" }}>Questions</p>
                  {/* Original content from Notion, ending before "close" */}
                  <div className="prose prose-sm max-w-none text-gray-700">
                    <div className="whitespace-pre-wrap" style={{ fontFamily: "serif" }}>
                      {(() => {
                        const originalContent = guestData.pageContent
                        const lines = originalContent.split('\n')
                        let endIndex = originalContent.length
                        
                        for (let i = 0; i < lines.length; i++) {
                          const line = lines[i].trim()
                          if (line.startsWith('#') && line.toLowerCase().includes('close')) {
                            // Find the position of this line in the original content
                            const lineIndex = originalContent.indexOf(lines[i])
                            if (lineIndex !== -1) {
                              endIndex = lineIndex
                              break
                            }
                          }
                        }
                        
                        // Get the content up to the close line, then remove headers
                        const contentBeforeClose = originalContent.substring(0, endIndex)
                        return removeMarkdownHeaders(contentBeforeClose).trim()
                      })()}
                    </div>
                  </div>
                </div>
                
                {/* Additional structure content */}
                <div className="pt-6" style={{ fontFamily: "serif" }}>
                  <div className="space-y-3 mb-6">
                    <p className="font-medium text-[#2B6951] mb-2" style={{ fontSize: "1rem", lineHeight: "1.5" }}>Consistent three rapid-fire questions:</p>
                    <ul className="list-disc list-inside ml-0">
                      <li>What's your favorite Bible verse and why?</li>
                      <li>What one book has most changed your life?</li>
                      <li>What one action would you most challenge our listeners to take?</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-3">
                    <p className="font-medium text-[#2B6951] mb-2" style={{ fontSize: "1rem", lineHeight: "1.5" }}>Close</p>
                    <ul className="list-disc list-inside ml-0">
                      <li>What can listeners find out more?</li>
                      <li>A host prays to close</li>
                    </ul>
                  </div>
                  
                  <p className="mt-6 font-medium text-[#2B6951]">
                    Please stay on until Riverside marks the video as uploaded :)
                  </p>
                </div>
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