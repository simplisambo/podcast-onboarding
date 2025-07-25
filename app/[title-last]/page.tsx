"use client"

import type React from "react"

import { useParams } from "next/navigation"
import { useEffect, useState, useRef } from "react"
import { motion, useInView } from "framer-motion"
import ReactPlayer from "react-player"
import { Button } from "@/components/ui/button"
import { Users, Mic, Video, ExternalLink } from "lucide-react"
import { FadeTypewriter } from "@/components/fade-typewriter"

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

function TableOfContents() {
  const [activeSection, setActiveSection] = useState("intro")

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["intro", "audience", "conversation", "tech", "about"]
      const scrollPosition = window.scrollY + 200

      for (let i = sections.length - 1; i >= 0; i--) {
        const element = document.getElementById(sections[i])
        if (element && element.offsetTop <= scrollPosition) {
          setActiveSection(sections[i])
          break
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
    <div className="hidden xl:block fixed left-8 top-1/2 transform -translate-y-1/2 z-10">
      <nav className="space-y-4">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => scrollToSection(section.id)}
            className={`block text-sm transition-colors duration-200 hover:text-black ${
              activeSection === section.id ? "text-black font-medium" : "text-gray-600"
            }`}
          >
            {section.label}
          </button>
        ))}
      </nav>
    </div>
  )
}

export default function OnboardingPage() {
  const params = useParams()
  const [guestName, setGuestName] = useState("")
  const [showContent, setShowContent] = useState(false)
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    if (params["title-last"]) {
      const nameSlug = params["title-last"] as string
      const nameParts = nameSlug.split("-")

      // Add period after first part (title) and capitalize all parts
      const formattedName = nameParts
        .map((word, index) => {
          const capitalizedWord = word.charAt(0).toUpperCase() + word.slice(1)
          return index === 0 ? `${capitalizedWord}.` : capitalizedWord
        })
        .join(" ")

      setGuestName(formattedName)

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

  if (!showContent) {
    return (
      <motion.div
        className="min-h-screen bg-white flex items-center justify-center"
        initial={{ opacity: 1 }}
        animate={{ opacity: fadeOut ? 0 : 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
      >
        <div className="text-center">
          <div className="text-6xl whitespace-nowrap" style={{ fontFamily: "var(--font-amaranth)" }}>
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
      <TableOfContents />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="min-h-screen bg-white"
        style={{ fontFamily: "var(--font-merriweather)" }}
      >
        <main className="max-w-4xl mx-auto px-6 py-16 space-y-20">
          {/* Hero Section */}
          <ScrollSection id="intro">
            <section className="text-center">
              <h2 className="text-5xl font-bold text-gray-900 mb-4" style={{ fontFamily: "var(--font-amaranth)" }}>
                We're so excited to have you!
              </h2>
              <p className="text-lg text-gray-700 mb-8 leading-relaxed max-w-3xl mx-auto">
                Thanks for joining us :) Here's a short video intro from Nate & Sam, plus everything you need to know
                for our chat.
              </p>
              {/* Modern Video Player */}
              <div className="relative max-w-3xl mx-auto">
                <div className="relative rounded-xl overflow-hidden shadow-lg">
                  <ReactPlayer
                    url="/nate-sam-intro.mp4"
                    width="100%"
                    height="100%"
                    controls={true}
                    style={{
                      aspectRatio: "16/9",
                    }}
                    config={{
                      file: {
                        attributes: {
                          style: {
                            width: "100%",
                            height: "100%",
                          },
                        },
                      },
                    }}
                  />
                </div>
              </div>
            </section>
          </ScrollSection>

          {/* About the Podcast */}
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
                  We're just two normal dudes that have learned the value of spending time with wise people. Our goal in
                  this podcast is not to just entertain you, but to give you practical and specific takeaways from some
                  of the wisest Christian leaders we know.
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

          {/* Content & Conversation */}
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
                <p>
                  <strong className="text-[#2B6951]">{guestName}, you're the expert!</strong> While we'll have some
                  questions prepared, feel free to take the conversation wherever you feel most led.
                </p>
                <p>
                  Let us know if there's a topic you'd really love to cover. The best episodes are when guests are
                  sharing what excites them most.
                </p>
                <p>
                  We especially love hearing <strong className="text-[#2B6951]">stories from your own life</strong> that
                  contain wisdom or practical takeaways.
                </p>
              </div>
            </section>
          </ScrollSection>

          {/* Tech Setup */}
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
                    We'll be recording on <strong>Riverside</strong>, a video podcast recording site similar to Zoom.
                  </p>
                  <Button className="bg-[#2B6951] hover:bg-[#1e4a3a] text-white">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Test Your Setup Here
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
                      <li>• Avoid Bluetooth AirPods (poor sound quality)</li>
                    </ul>
                  </div>
                  <div>
                    <h4
                      className="text-xl font-semibold text-[#2B6951] mb-3"
                      style={{ fontFamily: "var(--font-amaranth)" }}
                    >
                      Environment
                    </h4>
                    <ul className="space-y-2 text-base text-gray-700">
                      <li>• Choose a quiet space</li>
                      <li>• Decent lighting preferred</li>
                      <li>• Natural light or ring light is ideal</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>
          </ScrollSection>

          {/* About Nate & Sam */}
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
                  <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-6 flex items-center justify-center">
                    <span className="text-4xl font-bold text-gray-400">N</span>
                  </div>
                  <h4
                    className="text-xl font-semibold text-[#2B6951] mb-3"
                    style={{ fontFamily: "var(--font-amaranth)" }}
                  >
                    Nate
                  </h4>
                  <p className="text-base text-gray-700 leading-relaxed">
                    Passionate about connecting with wise leaders and extracting practical insights that can transform
                    lives. Believes deeply in the power of mentorship and learning from those who've walked the path
                    before us.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-6 flex items-center justify-center">
                    <span className="text-4xl font-bold text-gray-400">S</span>
                  </div>
                  <h4
                    className="text-xl font-semibold text-[#2B6951] mb-3"
                    style={{ fontFamily: "var(--font-amaranth)" }}
                  >
                    Sam
                  </h4>
                  <p className="text-base text-gray-700 leading-relaxed">
                    Dedicated to creating meaningful conversations that go beyond surface-level discussions. Loves
                    discovering the stories and experiences that have shaped our guests into the leaders they are today.
                  </p>
                </div>
              </div>
            </section>
          </ScrollSection>

          {/* Footer */}
          <ScrollSection delay={0.5} useStandardMargin={true}>
            <footer className="text-center py-12 border-t border-gray-100">
              <p className="text-base text-gray-600 mb-4">
                We can't wait to learn from you and share your wisdom with our community.
              </p>
              <p className="text-lg font-semibold text-[#2B6951]">Thank you for joining us, {guestName}!</p>
            </footer>
          </ScrollSection>
        </main>
      </motion.div>
    </>
  )
}
