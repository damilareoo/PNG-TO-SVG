"use client"

import type React from "react"
import { useState, useRef, useCallback, useEffect } from "react"
import { useDropzone } from "react-dropzone"
import ImageTracer from "imagetracerjs"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider" // Import Slider component
import { Upload, Download, Code } from "lucide-react"

export default function Home() {
  const [svgData, setSvgData] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isConverting, setIsConverting] = useState(false)
  const [smoothness, setSmoothness] = useState<number[]>([50]) // Default smoothness 0-100
  const imageDataUrlRef = useRef<string | null>(null) // To store the base64 image data

  const traceImage = useCallback((dataUrl: string, currentSmoothness: number) => {
    setIsConverting(true)
    // Map slider value (0-100) to ltres/qtres (0.1-10)
    // Higher slider value = higher ltres/qtres = more smoothness (less detail)
    const ltresValue = 0.1 + (currentSmoothness / 100) * (10 - 0.1)
    const qtresValue = ltresValue // Use the same value for both

    ImageTracer.imageToSVG(
      dataUrl,
      (svgString: string) => {
        setSvgData(svgString)
        setIsConverting(false)
      },
      {
        ltres: ltresValue,
        qtres: qtresValue,
        pathomit: 1,
        blurradius: 1,
      },
    )
  }, [])

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return

      const file = acceptedFiles[0]
      const reader = new FileReader()

      setSvgData(null)
      setIsEditing(false)
      setSmoothness([50]) // Reset smoothness on new upload

      reader.onload = (event) => {
        if (!event.target?.result) return

        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement("canvas")
          const ctx = canvas.getContext("2d")
          if (!ctx) return

          canvas.width = img.width
          canvas.height = img.height
          ctx.drawImage(img, 0, 0)

          const dataUrl = canvas.toDataURL()
          imageDataUrlRef.current = dataUrl // Store the image data URL
          traceImage(dataUrl, smoothness[0]) // Initial trace with default smoothness
        }
        img.src = event.target.result as string
      }

      reader.readAsDataURL(file)
    },
    [traceImage, smoothness],
  )

  // Re-trace when smoothness changes, if an image is already loaded
  useEffect(() => {
    if (imageDataUrlRef.current && !isConverting) {
      traceImage(imageDataUrlRef.current, smoothness[0])
    }
  }, [smoothness, traceImage]) // Removed isConverting from dependency array to avoid infinite loop

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [],
      "image/png": [],
    },
    multiple: false,
  })

  const handleSvgEdit = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSvgData(e.target.value)
  }

  const handleDownload = () => {
    if (!svgData) return

    const blob = new Blob([svgData], { type: "image/svg+xml" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "converted-image.svg"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-3xl">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">PNG to SVG Converter</h1>

        {!svgData && !isConverting && (
          <Card className="p-8 flex flex-col items-center justify-center border-dashed border-2 border-gray-300 bg-white rounded-xl">
            <div
              {...getRootProps()}
              className={`w-full h-64 flex flex-col items-center justify-center cursor-pointer rounded-lg transition-colors ${
                isDragActive ? "bg-gray-100" : "hover:bg-gray-50"
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="h-12 w-12 mb-4 text-gray-400" />
              <p className="text-lg font-medium text-gray-700 mb-2">
                {isDragActive ? "Drop the image here" : "Drag & drop an image here"}
              </p>
              <p className="text-sm text-gray-500 mb-4">or click to select a file</p>
              <Button className="bg-gray-800 hover:bg-gray-700">Upload Image</Button>
            </div>
          </Card>
        )}

        {isConverting && (
          <Card className="p-8 flex flex-col items-center justify-center bg-white rounded-xl">
            <div className="w-12 h-12 border-4 border-t-gray-800 border-gray-200 rounded-full animate-spin mb-4"></div>
            <p className="text-lg font-medium text-gray-700">Converting image to SVG...</p>
          </Card>
        )}

        {svgData && (
          <Card className="p-8 bg-white rounded-xl">
            <div className="flex flex-col items-center">
              <div className="w-full mb-6 flex justify-center">
                <div
                  className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 max-w-full overflow-auto"
                  dangerouslySetInnerHTML={{ __html: svgData }}
                />
              </div>

              <div className="w-full mb-6 px-4">
                <label htmlFor="smoothness-slider" className="block text-sm font-medium text-gray-700 mb-2">
                  Smoothness: {smoothness[0]}
                </label>
                <Slider
                  id="smoothness-slider"
                  min={0}
                  max={100}
                  step={1}
                  value={smoothness}
                  onValueChange={setSmoothness}
                  className="w-full"
                />
              </div>

              {isEditing ? (
                <div className="w-full mb-6">
                  <Textarea
                    value={svgData}
                    onChange={handleSvgEdit}
                    className="font-mono text-sm h-64 bg-gray-50 border-gray-300"
                  />
                </div>
              ) : null}

              <div className="flex gap-4">
                <Button onClick={handleDownload} className="bg-gray-800 hover:bg-gray-700">
                  <Download className="mr-2 h-4 w-4" />
                  Download SVG
                </Button>
                <Button
                  onClick={() => setIsEditing(!isEditing)}
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-100"
                >
                  <Code className="mr-2 h-4 w-4" />
                  {isEditing ? "Hide SVG Code" : "Edit SVG Code"}
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </main>
  )
}
