"use client"

import type React from "react"

import { useParams } from "next/navigation"
import { useEffect, useState, useRef } from "react"
import { motion, useInView } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Users, Mic, Video, ExternalLink, Play, Pause, Loader2 } from "lucide-react"
import { FadeTypewriter } from "@/components/fade-typewriter"
import { useGuestData } from "@/hooks/use-guest-data"

// Function to remove markdown headers from Notion content
function removeMarkdownHeaders(content: string): string {
  return content.replace(/^#+\s*/gm, '')
}

function ScrollSection({
  children,
  delay = 0,
  id,
  useStandardMargin = false,
}: {
  children: React.ReactNode
  delay?: number
  id?: string
  useStandardMargin?: boolean
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, {
    once: true,
    margin: useStandardMargin ? "-100px" : "-20%",
  })

  return (
    <motion.div
      ref={ref}
      id={id}
      initial={{ opacity: 0, scale: 0.95, y: 50 }}
      animate={isInView ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.95, y: 50 }}
      transition={{ duration: 0.8, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  )
}

function TableOfContents({ isVideoPlaying }: { isVideoPlaying: boolean }) {
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

export default function OnboardingPage() {
  const params = useParams()
  const [guestName, setGuestName] = useState("")
  const [lastName, setLastName] = useState("")
  const [showContent, setShowContent] = useState(false)
  const [fadeOut, setFadeOut] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasPlayedOnce, setHasPlayedOnce] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const playerRef = useRef<HTMLVideoElement>(null)
  const progressBarRef = useRef<HTMLDivElement>(null)
  const videoContainerRef = useRef<HTMLDivElement>(null)

  // Fetch guest data from Notion
  const { guestData, loading: guestLoading, error: guestError } = useGuestData(lastName)

  useEffect(() => {
    if (params["title-last"]) {
      const nameSlug = params["title-last"] as string
      const nameParts = nameSlug.split("-")
      
      // List of common titles
      const titles = ["prof", "dr", "mr", "ms", "mrs", "miss", "rev", "sir", "madam", "captain", "colonel", "general", "admiral", "senator", "governor", "president", "ambassador", "bishop", "pastor", "father", "sister", "brother"]
      
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

      // Start fade out after 3 seconds
      const fadeTimer = setTimeout(() => setFadeOut(true), 3000)

      // Show content 2 seconds after fade out starts (total 5 seconds)
      const contentTimer = setTimeout(() => setShowContent(true), 5000)

      return () => {
        clearTimeout(fadeTimer)
        clearTimeout(contentTimer)
      }
    }
  }, [params])

  // Handle clicking outside the video to pause
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isPlaying && videoContainerRef.current && !videoContainerRef.current.contains(event.target as Node)) {
        const video = playerRef.current as HTMLVideoElement
        if (video) {
          video.pause()
        }
      }
    }

    if (isPlaying) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => {
        document.removeEventListener("mousedown", handleClickOutside)
      }
    }
  }, [isPlaying])

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || !playerRef.current) return

    const rect = progressBarRef.current.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const newProgress = clickX / rect.width

    const video = playerRef.current as HTMLVideoElement
    if (video && video.duration > 0) {
      video.currentTime = newProgress * video.duration
      setProgress(newProgress)
    }
  }

  const handleProgressBarMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true)
    handleProgressBarClick(e)
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !progressBarRef.current || !playerRef.current) return

    const rect = progressBarRef.current.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const newProgress = Math.max(0, Math.min(1, clickX / rect.width))

    const video = playerRef.current as HTMLVideoElement
    if (video && video.duration > 0) {
      video.currentTime = newProgress * video.duration
      setProgress(newProgress)
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)

      return () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
      }
    }
  }, [isDragging])

  if (!showContent) {
    return (
      <motion.div
        className="min-h-screen bg-white flex items-center justify-center"
        initial={{ opacity: 1 }}
        animate={{ opacity: fadeOut ? 0 : 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
      >
        <div className="text-center px-4">
          <div className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight" style={{ fontFamily: "var(--font-amaranth)" }}>
            <FadeTypewriter text="Welcome, " letterDelay={50} className="text-gray-600 font-normal" />
            <FadeTypewriter
              text={guestName}
              delay={450} // Start after "Welcome, " finishes (9 characters * 50ms)
              letterDelay={50}
              className="text-black font-bold"
            />
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <>
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
            <section className="text-center">
              <motion.h2
                className="text-5xl font-bold text-gray-900 mb-4"
                style={{ fontFamily: "var(--font-amaranth)" }}
                animate={{ opacity: isPlaying ? 0.5 : 1 }}
                transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
              >
                We can't wait!
              </motion.h2>
              <motion.p
                className="text-lg text-gray-700 mb-8 leading-relaxed max-w-3xl mx-auto"
                animate={{ opacity: isPlaying ? 0.5 : 1 }}
                transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
              >
                This page can help for any pre-recording prep :)
              </motion.p>
              {/* Modern Video Player with Custom Controls */}
              <div className="flex justify-center items-center w-full px-4">
                <motion.div
                  ref={videoContainerRef}
                  className={`relative max-w-6xl w-full rounded-xl overflow-hidden z-30 group transition-colors duration-300 ${
                    isPlaying ? 'bg-black/5' : ''
                  }`}
                  initial={{ scale: 1 }}
                  animate={{
                    scale: isPlaying ? 1.35 : 1,
                  }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                {/* Temporary test with basic video element */}
                <video
                  ref={playerRef as any}
                  src="https://pub-bd9011e5a7894589b50ac5a4e1765260.r2.dev/Podcast%20Outro.mp4"
                  style={{
                    width: "100%",
                    height: "100%",
                    aspectRatio: "16/9",
                    display: "block",
                  }}
                  onPlay={() => {
                    console.log("Video started playing")
                    setIsPlaying(true)
                    setHasPlayedOnce(true)
                  }}
                  onPause={() => {
                    console.log("Video paused")
                    setIsPlaying(false)
                  }}
                  onEnded={() => {
                    console.log("Video ended")
                    setIsPlaying(false)
                  }}
                  onError={(error) => {
                    console.error("Video error:", error)
                  }}
                  onTimeUpdate={(e) => {
                    const video = e.target as HTMLVideoElement
                    if (video.duration > 0 && !isDragging) {
                      setProgress(video.currentTime / video.duration)
                    }
                  }}
                />

                {/* Custom Play Button - Only show when not playing */}
                {!isPlaying && (
                  <motion.button
                    initial={{ opacity: 1 }}
                    animate={{ opacity: isPlaying ? 0 : 1 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => {
                      const video = playerRef.current as HTMLVideoElement
                      if (video) {
                        video.play()
                      }
                    }}
                    className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 hover:bg-opacity-10 transition-all duration-200"
                  >
                    <div className="bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-6 shadow-lg transition-all duration-200">
                      <Play className="w-12 h-12 text-gray-800 ml-1" fill="currentColor" />
                    </div>
                  </motion.button>
                )}

                {/* Pause Button Overlay - Only show when playing and on hover */}
                {isPlaying && (
                  <button
                    onClick={() => {
                      const video = playerRef.current as HTMLVideoElement
                      if (video) {
                        video.pause()
                      }
                    }}
                    className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 hover:bg-opacity-10 transition-all duration-200 opacity-0 hover:opacity-100"
                  >
                    <div className="bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-6 shadow-lg transition-all duration-200">
                      <Pause className="w-12 h-12 text-gray-800" fill="currentColor" />
                    </div>
                  </button>
                )}

                {/* Custom Progress Bar - Only show after first play, when paused or on hover */}
                {hasPlayedOnce && (
                  <div
                    ref={progressBarRef}
                    className="absolute bottom-0 left-0 right-0 h-2 bg-black bg-opacity-20 cursor-pointer opacity-0 hover:opacity-100 group-hover:opacity-100 transition-opacity duration-200"
                    onMouseDown={handleProgressBarMouseDown}
                    onClick={handleProgressBarClick}
                    style={{ opacity: isPlaying ? 0 : 1 }}
                  >
                    <div
                      className="h-full bg-white transition-all duration-75"
                      style={{ width: `${progress * 100}%` }}
                    ></div>
                    {/* Progress handle */}
                    <div
                      className="absolute top-1/2 transform -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-md opacity-0 hover:opacity-100 transition-opacity duration-200"
                      style={{ left: `${progress * 100}%`, marginLeft: "-6px" }}
                    ></div>
                  </div>
                )}
              </motion.div>
              </div>
            </section>
          </ScrollSection>



          {/* About the Podcast */}
          <motion.div animate={{ opacity: isPlaying ? 0.5 : 1 }} transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}>
            <ScrollSection delay={0.1} id="audience" useStandardMargin={true}>
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
            </ScrollSection>
          </motion.div>

          {/* Content & Conversation */}
          <motion.div animate={{ opacity: isPlaying ? 0.5 : 1 }} transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}>
            <ScrollSection delay={0.2} id="conversation">
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
            </ScrollSection>
          </motion.div>

          {/* Tech Setup */}
          <motion.div animate={{ opacity: isPlaying ? 0.5 : 1 }} transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}>
            <ScrollSection delay={0.3} id="tech">
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
                        <li>• Any pleasant background, like a living room or studio</li>
                        <li>• Natural light or ring light is ideal</li>
                        <li>• Whatever you have is fine, though!</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>
            </ScrollSection>
          </motion.div>

          {/* About Nate & Sam */}
          <motion.div animate={{ opacity: isPlaying ? 0.5 : 1 }} transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}>
            <ScrollSection delay={0.4} id="about">
              <section className="py-8">
                <h3
                  className="text-3xl font-bold text-gray-900 mb-8 text-center"
                  style={{ fontFamily: "var(--font-amaranth)" }}
                >
                  About Nate & Sam
                </h3>

                <div className="grid md:grid-cols-2 gap-12">
                  <div className="text-center">
                    <img
                      src="/nate.png"
                      alt="Nate, one of the podcast hosts"
                      className="w-32 h-32 rounded-full mx-auto mb-6 object-cover"
                    />
                    <h4
                      className="text-xl font-semibold text-[#2B6951] mb-3"
                      style={{ fontFamily: "var(--font-amaranth)" }}
                    >
                      Nate
                    </h4>
                    <p className="text-base text-gray-700 leading-relaxed">
                      He smels gud
                    </p>
                  </div>
                  <div className="text-center">
                    <img
                      src="/sam.png"
                      alt="Sam, one of the podcast hosts"
                      className="w-32 h-32 rounded-full mx-auto mb-6 object-cover"
                    />
                    <h4
                      className="text-xl font-semibold text-[#2B6951] mb-3"
                      style={{ fontFamily: "var(--font-amaranth)" }}
                    >
                      Sam
                    </h4>
                    <p className="text-base text-gray-700 leading-relaxed">
                      I grew up partly in North Africa and partly in Kentucky. I graduated from Liberty in 2025 and
                      currently work at Microsoft doing cybersecurity. I love to play devil's advocate in the interview.
                    </p>
                  </div>
                </div>
              </section>
            </ScrollSection>
          </motion.div>

          {/* Footer */}
          <motion.div animate={{ opacity: isPlaying ? 0.5 : 1 }} transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}>
            <ScrollSection delay={0.5} useStandardMargin={true}>
              <footer className="text-center py-12 border-t border-gray-100">
                <p className="text-base text-gray-600 mb-4">
                  We can't wait to learn from you and share your wisdom with our community.
                </p>
                <p className="text-lg font-semibold text-[#2B6951]">Thank you for joining us, {guestName}!</p>
              </footer>
            </ScrollSection>
          </motion.div>
        </main>
      </motion.div>
    </>
  )
}
