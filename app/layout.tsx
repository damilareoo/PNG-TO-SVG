import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "PNG to SVG Converter",
  description: "Convert PNG and JPEG images to SVG vectors instantly",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <meta property="og:image" content="/png-to-svg-logo.png" />
        <meta property="og:title" content="PNG to SVG Converter" />
        <meta property="og:description" content="Convert PNG/JPEG images to editable SVG vectors instantly." />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="PNG to SVG Converter" />
        <meta name="twitter:description" content="Convert PNG/JPEG images to editable SVG vectors instantly." />
        <meta name="twitter:image" content="/png-to-svg-logo.png" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
