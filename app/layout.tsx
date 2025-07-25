import type React from "react"
import type { Metadata } from "next"
import { Amaranth, Merriweather } from "next/font/google"
import "./globals.css"

const amaranth = Amaranth({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-amaranth",
})

const merriweather = Merriweather({
  weight: ["300", "400", "700"],
  subsets: ["latin"],
  variable: "--font-merriweather",
})

export const metadata: Metadata = {
  title: "Walking with the Wise - Guest Onboarding",
  description: "Personalized onboarding for podcast guests",
  icons: {
    icon: "/favicon.png",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${amaranth.variable} ${merriweather.variable} antialiased`}>{children}</body>
    </html>
  )
}
