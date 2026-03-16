import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import "./globals.css"

export const metadata: Metadata = {
  title: "PNG to SVG — Free Converter",
  description: "Convert any PNG, JPG, or WebP image to a clean, editable SVG vector. Free, instant, no signup.",
  openGraph: {
    title: "PNG to SVG",
    description: "Convert any image to a clean, editable vector — instantly.",
    url: "https://v0-png-to-svg.vercel.app",
    siteName: "PNG to SVG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PNG to SVG",
    description: "Convert any image to a clean, editable vector — instantly.",
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
