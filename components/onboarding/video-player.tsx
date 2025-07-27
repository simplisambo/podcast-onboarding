"use client"

import React, { useRef, useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Play, Pause } from "lucide-react"

interface VideoPlayerProps {
  isPlaying: boolean
  setIsPlaying: (playing: boolean) => void
  hasPlayedOnce: boolean
  setHasPlayedOnce: (played: boolean) => void
  progress: number
  setProgress: (progress: number) => void
  isDragging: boolean
  setIsDragging: (dragging: boolean) => void
}

export function VideoPlayer({
  isPlaying,
  setIsPlaying,
  hasPlayedOnce,
  setHasPlayedOnce,
  progress,
  setProgress,
  isDragging,
  setIsDragging,
}: VideoPlayerProps) {
  const playerRef = useRef<HTMLVideoElement>(null)
  const progressBarRef = useRef<HTMLDivElement>(null)
  const videoContainerRef = useRef<HTMLDivElement>(null)

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

  return (
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
        {/* Video element */}
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
  )
} 