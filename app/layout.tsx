import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import "./globals.css"

export const metadata: Metadata = {
  title: "PNG to SVG — Free Converter",
  description: "Convert any PNG, JPG, or WebP image to a clean, editable SVG vector. Multiple modes for logos, photos, and line art.",
  openGraph: {
    title: "PNG to SVG Converter",
    description: "Convert any PNG to a clean, editable SVG vector. Free, instant, no signup.",
    images: ["/png-to-svg-logo.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "PNG to SVG Converter",
    description: "Convert any PNG to a clean, editable SVG vector. Free, instant, no signup.",
    images: ["/png-to-svg-logo.png"],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={GeistSans.className}>
      <body>{children}</body>
    </html>
  )
}
