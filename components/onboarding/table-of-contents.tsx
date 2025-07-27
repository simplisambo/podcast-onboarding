"use client"

import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"

interface TableOfContentsProps {
  isVideoPlaying: boolean
}

export function TableOfContents({ isVideoPlaying }: TableOfContentsProps) {
  const [activeSection, setActiveSection] = useState("intro")

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["intro", "audience", "conversation", "tech", "about"]
      const windowHeight = window.innerHeight
      const scrollPosition = window.scrollY + windowHeight / 2 // Middle of the screen

      for (let i = sections.length - 1; i >= 0; i--) {
        const element = document.getElementById(sections[i])
        if (element) {
          const elementTop = element.offsetTop
          const elementBottom = elementTop + element.offsetHeight
          
          // Check if the middle of the screen is within this section
          if (scrollPosition >= elementTop && scrollPosition <= elementBottom) {
            setActiveSection(sections[i])
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  const sections = [
    { id: "intro", label: "Intro" },
    { id: "audience", label: "About our Audience" },
    { id: "conversation", label: "Content & Conversation" },
    { id: "tech", label: "Tech Setup" },
    { id: "about", label: "About Nate & Sam" },
    { id: "latest-episode", label: "Latest Episode" },
  ]

  return (
    <motion.div
      className="hidden xl:block fixed left-8 top-1/2 transform -translate-y-1/2 z-10"
      animate={{ opacity: isVideoPlaying ? 0 : 1 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
    >
      <nav className="space-y-4">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => scrollToSection(section.id)}
            className={`block text-sm transition-all duration-300 ease-out hover:text-black ${
              activeSection === section.id 
                ? "text-black font-medium text-base scale-110" 
                : "text-gray-600 scale-100"
            }`}
          >
            {section.label}
          </button>
        ))}
      </nav>
    </motion.div>
  )
} 