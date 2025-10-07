"use client"

import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"

interface Section {
  id: string
  label: string
}

interface TableOfContentsProps {
  isVideoPlaying: boolean
  sections: Section[]
}

export function TableOfContents({ isVideoPlaying, sections }: TableOfContentsProps) {
  const [activeSection, setActiveSection] = useState("intro")

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight
      const scrollPosition = window.scrollY + windowHeight / 2 // Middle of the screen

      // Use the sections passed as props in the correct order
      const sectionIds = sections.map(section => section.id)

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const element = document.getElementById(sectionIds[i])
        if (element) {
          const elementTop = element.offsetTop
          const elementBottom = elementTop + element.offsetHeight
          
          // Check if the middle of the screen is within this section
          if (scrollPosition >= elementTop && scrollPosition <= elementBottom) {
            setActiveSection(sectionIds[i])
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [sections])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

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