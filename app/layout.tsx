import type React from "react"
import type { Metadata } from "next"
import { Amaranth, Merriweather, Inter } from "next/font/google"
import "./globals.css"
import { Analytics } from "@vercel/analytics/next"

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

const inter = Inter({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "Walking with the Wise - Guest Onboarding",
  description: "Personalized onboarding for podcast guests",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${amaranth.variable} ${merriweather.variable} ${inter.variable} antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
