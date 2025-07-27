"use client"

import React, { useRef } from "react"
import { motion, useInView } from "framer-motion"

interface ScrollSectionProps {
  children: React.ReactNode
  delay?: number
  id?: string
  useStandardMargin?: boolean
}

export function ScrollSection({
  children,
  delay = 0,
  id,
  useStandardMargin = false,
}: ScrollSectionProps) {
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