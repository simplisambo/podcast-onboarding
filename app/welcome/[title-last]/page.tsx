"use client"

import React from "react"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"

import { FadeTypewriter } from "@/components/fade-typewriter"
import { useGuestData } from "@/hooks/use-guest-data"
import { formatRecordingDate } from "@/lib/utils"
import {
  ScrollSection,
  TableOfContents,
  HeroSection,
  AudienceSection,
  ConversationSection,
  TechSection,
  AboutSection,
  FooterSection,
  LatestEpisodeSection,
} from "@/components/onboarding"

// Function to get time-based greeting
const getTimeBasedGreeting = () => {
  const hour = new Date().getHours()
  if (hour < 12) return "Good morning,"
  if (hour < 17) return "Good afternoon,"
  return "Good evening,"
}

export default function OnboardingPage() {
  const params = useParams()
  const [guestName, setGuestName] = useState("")
  const [lastName, setLastName] = useState("")
  const [showContent, setShowContent] = useState(false)
  const [showThankYou, setShowThankYou] = useState(false)
  const [showRestOfPage, setShowRestOfPage] = useState(false)
  const [fadeOut, setFadeOut] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progressBarWidth, setProgressBarWidth] = useState(0)
  const [hasPlayedOnce, setHasPlayedOnce] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isDragging, setIsDragging] = useState(false)

  // Fetch guest data
  const { guestData } = useGuestData(lastName)

  useEffect(() => {
    if (params["title-last"]) {
      const nameSlug = params["title-last"] as string
      const nameParts = nameSlug.split("-")
      
      // List of common titles
      const titles = ["prof", "dr", "mr", "ms", "mrs", "miss", "rev"]
      
      const firstWord = nameParts[0].toLowerCase()
      
      let formattedName = ""
      let extractedLastName = ""
      
      if (titles.includes(firstWord)) {
        // If first word is a title, format as "Title. Lastname"
        const title = nameParts[0].charAt(0).toUpperCase() + nameParts[0].slice(1)
        const lastName = nameParts.slice(1).map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(" ")
        formattedName = `${title}. ${lastName}`
        extractedLastName = nameParts[nameParts.length - 1] // Get the last part as last name
      } else {
        // If first word is not a title, assume it's a first name
        const firstName = nameParts[0].charAt(0).toUpperCase() + nameParts[0].slice(1)
        formattedName = firstName
        extractedLastName = nameParts[nameParts.length - 1] // Get the last part as last name
      }

      setGuestName(formattedName)
      setLastName(extractedLastName)

      // Check if guest name is "dev" - if so, skip all animations and go straight to main content
      if (formattedName.toLowerCase() === "dev") {
        setShowThankYou(true)
        setShowRestOfPage(true)
        return
      }

      // Start fade out after 3 seconds
      const fadeTimer = setTimeout(() => setFadeOut(true), 3000)

      // Show thank you message 2 seconds after fade out starts (total 5 seconds)
      const thankYouTimer = setTimeout(() => setShowThankYou(true), 5000)

      // Start progress bar animation when thank you message shows
      const progressStartTimer = setTimeout(() => {
        const startTime = Date.now()
        const duration = 8000 // 8 seconds
        
        const updateProgress = () => {
          const elapsed = Date.now() - startTime
          const progress = Math.min(elapsed / duration, 1)
          setProgressBarWidth(progress * 100)
          
          if (progress < 1) {
            requestAnimationFrame(updateProgress)
          }
        }
        
        updateProgress()
      }, 5000)

      // Show rest of page 8 seconds after thank you starts (total 13 seconds)
      const restOfPageTimer = setTimeout(() => setShowRestOfPage(true), 13000)

      return () => {
        clearTimeout(fadeTimer)
        clearTimeout(thankYouTimer)
        clearTimeout(progressStartTimer)
        clearTimeout(restOfPageTimer)
      }
    }
  }, [params])

  // Generate the intro text with recording date if available
  const getIntroText = () => {
    const baseText = (
      <>
        <strong className="text-[#2B6951]">{guestName}</strong>, thank you so much for being willing to record an interview with us! Seriously, we know you are very busy and have a ton of responsibility, so it means a lot to us that you're willing to invest 50 minutes into us and our listeners.
      </>
    )
    
    if (guestData?.recordingDate) {
      const formattedDate = formatRecordingDate(guestData.recordingDate)
      return (
        <>
          <strong className="text-[#2B6951]">{guestName}</strong>, thank you so much for being willing to record an interview with us! Seriously, we know you are very busy and have a ton of responsibility, so it means a lot to us that you're willing to invest 50 minutes into us and our listeners {formattedDate}.
        </>
      )
    }
    
    return baseText
  }

  if (!showThankYou) {
    return (
      <motion.div
        className="min-h-screen bg-white flex items-center justify-center"
        initial={{ opacity: 1 }}
        animate={{ opacity: fadeOut ? 0 : 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <div className="text-center px-4">
          <div className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight" style={{ fontFamily: "var(--font-amaranth)" }}>
            <FadeTypewriter 
              text={`${getTimeBasedGreeting()} ${guestName}`} 
              letterDelay={50} 
              className="text-gray-600 font-normal"
            />
          </div>
        </div>
      </motion.div>
    )
  }

  if (!showRestOfPage) {
    return (
      <motion.div
        className="min-h-screen bg-white flex items-center justify-center relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <div className="text-center px-4 max-w-4xl">
          <motion.p
            className="text-lg text-gray-700 mb-8 leading-relaxed max-w-3xl text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            {getIntroText()}
          </motion.p>
          <motion.p
            className="text-lg text-gray-700 leading-relaxed max-w-3xl text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
          >
            <strong className="text-[#2B6951]">Pro Rege,</strong><br />
            Nate and Sam
          </motion.p>
        </div>
        
        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-gray-200">
          <motion.div
            className="h-full bg-[#2B6951]"
            initial={{ width: "0%" }}
            animate={{ width: `${progressBarWidth}%` }}
            transition={{ duration: 0.1, ease: "linear" }}
          />
        </div>
      </motion.div>
    )
  }

  return (
    <>
      {/* Logo in top left corner */}
      <motion.div
        className="fixed top-8 left-8 z-30"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <img
          src="/logowwtw.png"
          alt="Walking With The Wise Logo"
          className="h-32 w-auto object-contain rounded-lg"
          style={{ maxWidth: '400px' }}
        />
      </motion.div>

      <TableOfContents isVideoPlaying={isPlaying} />

      {/* White overlay that appears when video is playing */}
      <motion.div
        className="fixed inset-0 bg-white pointer-events-none z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: isPlaying ? 0.5 : 0 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="min-h-screen bg-white relative"
        style={{ fontFamily: "var(--font-merriweather)" }}
      >
        <main className="max-w-4xl mx-auto px-6 py-16 space-y-20">
          {/* Hero Section */}
          <ScrollSection id="intro">
            <HeroSection
              isPlaying={isPlaying}
              setIsPlaying={setIsPlaying}
              hasPlayedOnce={hasPlayedOnce}
              setHasPlayedOnce={setHasPlayedOnce}
              progress={progress}
              setProgress={setProgress}
              isDragging={isDragging}
              setIsDragging={setIsDragging}
            />
          </ScrollSection>

          {/* About the Podcast */}
          <ScrollSection delay={0.1} id="audience" useStandardMargin={true}>
            <AudienceSection isPlaying={isPlaying} />
          </ScrollSection>

          {/* Content & Conversation */}
          <ScrollSection delay={0.2} id="conversation">
            <ConversationSection 
              isPlaying={isPlaying} 
              guestName={guestName} 
              lastName={lastName} 
            />
          </ScrollSection>

          {/* Tech Setup */}
          <ScrollSection delay={0.3} id="tech">
            <TechSection isPlaying={isPlaying} />
          </ScrollSection>

          {/* About Nate & Sam */}
          <ScrollSection delay={0.4} id="about">
            <AboutSection isPlaying={isPlaying} />
          </ScrollSection>

          {/* Footer */}
          <ScrollSection delay={0.5} useStandardMargin={true}>
            <FooterSection isPlaying={isPlaying} guestName={guestName} />
          </ScrollSection>

          {/* Latest Episode Preview */}
          <ScrollSection delay={0.6} id="latest-episode">
            <LatestEpisodeSection />
          </ScrollSection>
        </main>
      </motion.div>
    </>
  )
}
