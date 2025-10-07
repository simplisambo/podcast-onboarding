"use client"

import React from "react"

export function LatestEpisodeSection() {
  return (
    <section className="py-8">
      <h3
        className="text-3xl font-bold text-gray-900 mb-8 text-center"
        style={{ fontFamily: "var(--font-amaranth)" }}
      >
        Example Episode
      </h3>
      <div className="flex justify-center">
        <iframe
          style={{ borderRadius: '12px' }}
          src="https://open.spotify.com/embed/episode/51MVswGnX4iaPZN5dtEpLd"
          width="100%"
          height="152"
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          allowFullScreen
          title="Walking With The Wise Podcast Preview"
        ></iframe>
      </div>
    </section>
  )
} 