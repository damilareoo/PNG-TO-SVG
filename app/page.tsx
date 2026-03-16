"use client"

import type React from "react"
import { useState, useRef, useCallback, useEffect } from "react"
import { useDropzone } from "react-dropzone"
import ImageTracer from "imagetracerjs"
import { Download, Upload, RotateCcw, Sparkles, Code2, ChevronDown, ChevronUp } from "lucide-react"
import { PRESETS, type PresetKey } from "@/lib/presets"
import { preprocessImage, removeWhiteBackground, optimizeSvg } from "@/lib/preprocess"

type Stage = "idle" | "converting" | "done"

export default function Home() {
  const [stage, setStage] = useState<Stage>("idle")
  const [svgData, setSvgData] = useState<string | null>(null)
  const [originalUrl, setOriginalUrl] = useState<string | null>(null)
  const [preset, setPreset] = useState<PresetKey>("logo")
  const [colors, setColors] = useState(8)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiAvailable, setAiAvailable] = useState(false)
  const [showCode, setShowCode] = useState(false)
  const [svgSize, setSvgSize] = useState<string>("")
  const [previewMode, setPreviewMode] = useState<"split" | "original" | "vector">("split")
  const processedDataUrlRef = useRef<string | null>(null)

  // Check if Replicate is configured
  useEffect(() => {
    fetch("/api/remove-bg", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: "" }),
    })
      .then((r) => setAiAvailable(r.status !== 503))
      .catch(() => setAiAvailable(false))
  }, [])

  const runTrace = useCallback(
    (dataUrl: string, currentPreset: PresetKey, currentColors: number) => {
      setStage("converting")
      const p = PRESETS[currentPreset]
      const options = { ...p.options, numberofcolors: currentColors }

      ImageTracer.imageToSVG(
        dataUrl,
        (svgString: string) => {
          const optimized = optimizeSvg(svgString)
          setSvgData(optimized)
          setSvgSize(formatBytes(new Blob([optimized]).size))
          setStage("done")
        },
        options,
      )
    },
    [],
  )

  const processFile = useCallback(
    async (file: File, currentPreset: PresetKey, currentColors: number) => {
      setStage("converting")
      setSvgData(null)
      setShowCode(false)

      const reader = new FileReader()
      reader.onload = async (e) => {
        const raw = e.target?.result as string
        setOriginalUrl(raw)

        const p = PRESETS[currentPreset]
        const processed = await preprocessImage(raw, {
          contrast: p.preprocess.contrast,
          brightness: p.preprocess.brightness,
          sharpen: p.preprocess.sharpen,
          scale: 1,
        })

        processedDataUrlRef.current = processed
        runTrace(processed, currentPreset, currentColors)
      }
      reader.readAsDataURL(file)
    },
    [runTrace],
  )

  const onDrop = useCallback(
    (files: File[]) => {
      if (!files[0]) return
      processFile(files[0], preset, colors)
    },
    [processFile, preset, colors],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/png": [], "image/jpeg": [], "image/webp": [] },
    multiple: false,
  })

  const handlePresetChange = (p: PresetKey) => {
    const defaultColors = PRESETS[p].defaultColors
    setPreset(p)
    setColors(defaultColors)
    if (processedDataUrlRef.current) {
      runTrace(processedDataUrlRef.current, p, defaultColors)
    }
  }

  const handleColorsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setColors(Number(e.target.value))
  }

  const handleColorsCommit = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value)
    if (processedDataUrlRef.current) {
      runTrace(processedDataUrlRef.current, preset, val)
    }
  }

  const handleRemoveBg = async () => {
    if (!originalUrl) return

    if (!aiAvailable) {
      setStage("converting")
      const cleaned = await removeWhiteBackground(originalUrl)
      processedDataUrlRef.current = cleaned
      runTrace(cleaned, preset, colors)
      return
    }

    setAiLoading(true)
    try {
      const res = await fetch("/api/remove-bg", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: originalUrl }),
      })
      const data = await res.json()
      if (data.image) {
        processedDataUrlRef.current = data.image
        runTrace(data.image, preset, colors)
      }
    } finally {
      setAiLoading(false)
    }
  }

  const handleDownload = () => {
    if (!svgData) return
    const blob = new Blob([svgData], { type: "image/svg+xml" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "vector.svg"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleReset = () => {
    setStage("idle")
    setSvgData(null)
    setOriginalUrl(null)
    processedDataUrlRef.current = null
    setShowCode(false)
    setPreset("logo")
    setColors(8)
  }

  const maxColors = preset === "photo" ? 128 : 32
  const minColors = 2
  const colorsPercent = ((colors - minColors) / (maxColors - minColors)) * 100

  return (
    <main className="min-h-screen bg-[#0c0c0c] text-[#e8e8e8] flex flex-col" style={{ fontFamily: "inherit" }}>

      {/* Header */}
      <header className="flex items-center justify-between px-5 h-12 border-b border-[#181818] shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-white flex items-center justify-center shrink-0">
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
              <path d="M1.5 9.5L5.5 1.5L9.5 9.5" stroke="#0c0c0c" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2.8 7H8.2" stroke="#0c0c0c" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="text-[13px] font-medium text-[#c8c8c8]">PNG to SVG</span>
        </div>

        {stage === "done" && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs text-[#555] hover:text-[#999] hover:bg-[#141414] transition-all cursor-pointer"
            >
              <RotateCcw size={12} />
              New image
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white text-black text-xs font-medium hover:bg-[#e0e0e0] transition-colors cursor-pointer"
            >
              <Download size={12} />
              Download SVG
            </button>
          </div>
        )}
      </header>

      {/* Upload */}
      {stage === "idle" && (
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
          <div className="mb-7 text-center">
            <h1 className="text-[22px] sm:text-[28px] font-semibold tracking-tight text-[#e0e0e0] mb-1.5 leading-tight">
              Convert any image to SVG
            </h1>
            <p className="text-[13px] text-[#444]">
              PNG · JPG · WebP &rarr; clean, editable vector
            </p>
          </div>

          {/* Mode selector above drop zone */}
          <div className="flex items-center gap-1 mb-4 bg-[#111] rounded-lg p-1">
            {(["logo", "photo", "lineart"] as PresetKey[]).map((p) => (
              <button
                key={p}
                onClick={() => { setPreset(p); setColors(PRESETS[p].defaultColors) }}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
                  preset === p
                    ? "bg-[#1f1f1f] text-[#e0e0e0]"
                    : "text-[#444] hover:text-[#777]"
                }`}
              >
                {PRESETS[p].label}
              </button>
            ))}
          </div>

          <div
            {...getRootProps()}
            className={`relative w-full max-w-[480px] cursor-pointer rounded-xl border border-dashed transition-all duration-200 ${
              isDragActive
                ? "border-[#444] bg-[#121212]"
                : "border-[#1f1f1f] bg-[#0e0e0e] hover:border-[#2a2a2a] hover:bg-[#101010]"
            }`}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center justify-center py-14 px-8 gap-4">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors ${isDragActive ? "bg-[#1f1f1f]" : "bg-[#141414]"}`}>
                <Upload size={18} className="text-[#444]" />
              </div>
              <div className="text-center">
                <p className="text-[13px] text-[#777] mb-0.5">
                  {isDragActive ? "Drop to convert" : "Drop an image or click to browse"}
                </p>
                <p className="text-[11px] text-[#333]">PNG, JPG, WebP</p>
              </div>
            </div>
          </div>

          <p className="mt-5 text-[11px] text-[#2a2a2a]">
            Free · No signup · Runs in your browser
          </p>
        </div>
      )}

      {/* Converting */}
      {stage === "converting" && (
        <div className="flex-1 flex flex-col items-center justify-center gap-3">
          <div className="w-7 h-7 border-2 border-[#222] border-t-[#444] rounded-full animate-spin" />
          <p className="text-[13px] text-[#444]">Converting…</p>
        </div>
      )}

      {/* Result */}
      {stage === "done" && svgData && originalUrl && (
        <div className="flex-1 flex min-h-0">

          {/* Main area: preview panels + code panel + mobile controls */}
          <div className="flex-1 flex flex-col min-h-0">

            {/* Mobile preview toggle */}
            <div className="flex sm:hidden items-center gap-1 px-4 pt-3 pb-2 shrink-0">
              {(["split", "original", "vector"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setPreviewMode(m)}
                  className={`flex-1 py-1.5 rounded-md text-[11px] capitalize transition-colors cursor-pointer ${
                    previewMode === m ? "bg-[#1a1a1a] text-[#c8c8c8]" : "text-[#444]"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>

            {/* Panels */}
            <div className="flex-1 flex flex-col sm:flex-row gap-px bg-[#141414] min-h-0 overflow-hidden">

              {(previewMode === "split" || previewMode === "original") && (
                <div className="flex-1 flex flex-col bg-[#0c0c0c] min-w-0 min-h-0">
                  <div className="flex items-center px-4 h-9 border-b border-[#141414] shrink-0">
                    <span className="text-[10px] text-[#333] uppercase tracking-widest font-medium">Original</span>
                  </div>
                  <div className="flex-1 flex items-center justify-center p-6 overflow-auto">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={originalUrl}
                      alt="Original"
                      className="max-w-full max-h-full object-contain"
                      style={{ maxHeight: "calc(100vh - 200px)" }}
                    />
                  </div>
                </div>
              )}

              {(previewMode === "split" || previewMode === "vector") && (
                <div className="flex-1 flex flex-col bg-[#0c0c0c] min-w-0 min-h-0">
                  <div className="flex items-center justify-between px-4 h-9 border-b border-[#141414] shrink-0">
                    <span className="text-[10px] text-[#333] uppercase tracking-widest font-medium">Vector</span>
                    <span className="text-[10px] text-[#2a2a2a]">{svgSize}</span>
                  </div>
                  <div className="flex-1 flex items-center justify-center p-6 overflow-auto checkerboard">
                    <div
                      className="max-w-full max-h-full"
                      style={{ maxHeight: "calc(100vh - 200px)" }}
                      dangerouslySetInnerHTML={{ __html: svgData }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Code panel */}
            {showCode && (
              <div className="border-t border-[#141414] px-4 py-3 shrink-0 bg-[#0c0c0c]">
                <textarea
                  readOnly
                  value={svgData}
                  className="w-full h-36 text-[10.5px] font-mono text-[#555] bg-[#090909] border border-[#181818] rounded-lg px-3 py-2.5 resize-none focus:outline-none leading-relaxed"
                />
                <div className="flex justify-end mt-1.5">
                  <button
                    onClick={() => navigator.clipboard.writeText(svgData)}
                    className="text-[11px] text-[#444] hover:text-[#777] transition-colors cursor-pointer"
                  >
                    Copy SVG
                  </button>
                </div>
              </div>
            )}

            {/* Mobile controls (visible only on mobile) */}
            <div className="sm:hidden border-t border-[#1a1a1a] bg-[#0e0e0e] p-4 shrink-0">
              {/* Mode */}
              <div className="flex gap-1 bg-[#141414] rounded-lg p-1 mb-4">
                {(["logo", "photo", "lineart"] as PresetKey[]).map((p) => (
                  <button
                    key={p}
                    onClick={() => handlePresetChange(p)}
                    className={`flex-1 py-2 rounded-md text-[12px] font-medium transition-all cursor-pointer ${
                      preset === p
                        ? "bg-[#262626] text-[#d8d8d8]"
                        : "text-[#555] hover:text-[#888]"
                    }`}
                  >
                    {PRESETS[p].label}
                  </button>
                ))}
              </div>

              {/* Colors */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[12px] text-[#888] font-medium">Colors</span>
                  <span className="text-[12px] font-semibold text-[#aaa]">{colors}</span>
                </div>
                <input
                  type="range"
                  min={minColors}
                  max={maxColors}
                  step={preset === "photo" ? 4 : 1}
                  value={colors}
                  onChange={handleColorsChange}
                  onMouseUp={handleColorsCommit as any}
                  onTouchEnd={handleColorsCommit as any}
                  className="w-full h-0.5 cursor-pointer appearance-none rounded"
                  style={{
                    background: `linear-gradient(to right, #666 0%, #666 ${colorsPercent}%, #222 ${colorsPercent}%, #222 100%)`,
                    accentColor: "#e8e8e8",
                  }}
                />
              </div>

              {/* Remove BG */}
              <button
                onClick={handleRemoveBg}
                disabled={aiLoading}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-[13px] font-medium text-[#999] hover:text-[#ccc] bg-[#141414] hover:bg-[#1a1a1a] border border-[#222] transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer mb-2"
              >
                <Sparkles size={13} className={aiLoading ? "animate-pulse" : ""} />
                {aiLoading ? "Removing…" : aiAvailable ? "Remove BG (AI)" : "Remove White BG"}
              </button>

              {/* View code */}
              <button
                onClick={() => setShowCode((s) => !s)}
                className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-[13px] font-medium transition-all cursor-pointer ${
                  showCode
                    ? "bg-[#1d1d1d] text-[#c8c8c8] border border-[#2a2a2a]"
                    : "text-[#666] hover:text-[#999] border border-transparent"
                }`}
              >
                <Code2 size={13} />
                {showCode ? "Hide code" : "View code"}
              </button>
            </div>
          </div>

          {/* Desktop controls sidebar (hidden on mobile) */}
          <div className="hidden sm:flex w-[196px] border-l border-[#181818] bg-[#0c0c0c] flex-col shrink-0">
            <div className="flex-1 p-4 flex flex-col gap-6 overflow-y-auto">

              {/* Mode section */}
              <div>
                <p className="text-[10px] text-[#484848] uppercase tracking-wider font-medium mb-2.5">Mode</p>
                <div className="flex flex-col gap-0.5">
                  {(["logo", "photo", "lineart"] as PresetKey[]).map((p) => (
                    <button
                      key={p}
                      onClick={() => handlePresetChange(p)}
                      className={`px-3 py-2 rounded-lg text-left text-[12px] font-medium transition-all cursor-pointer ${
                        preset === p
                          ? "bg-[#1d1d1d] text-[#d8d8d8]"
                          : "text-[#666] hover:text-[#aaa] hover:bg-[#141414]"
                      }`}
                    >
                      {PRESETS[p].label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Colors section */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <p className="text-[10px] text-[#484848] uppercase tracking-wider font-medium">Colors</p>
                  <span className="text-[13px] font-semibold text-[#888]">{colors}</span>
                </div>
                <input
                  type="range"
                  min={minColors}
                  max={maxColors}
                  step={preset === "photo" ? 4 : 1}
                  value={colors}
                  onChange={handleColorsChange}
                  onMouseUp={handleColorsCommit as any}
                  onTouchEnd={handleColorsCommit as any}
                  className="w-full h-0.5 cursor-pointer appearance-none rounded"
                  style={{
                    background: `linear-gradient(to right, #666 0%, #666 ${colorsPercent}%, #222 ${colorsPercent}%, #222 100%)`,
                    accentColor: "#e8e8e8",
                  }}
                />
                <div className="flex justify-between mt-1.5">
                  <span className="text-[10px] text-[#333]">{minColors}</span>
                  <span className="text-[10px] text-[#333]">{maxColors}</span>
                </div>
              </div>

              {/* Background section */}
              <div>
                <p className="text-[10px] text-[#484848] uppercase tracking-wider font-medium mb-2.5">Background</p>
                <button
                  onClick={handleRemoveBg}
                  disabled={aiLoading}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-[12px] font-medium text-[#888] hover:text-[#ccc] bg-[#141414] hover:bg-[#1a1a1a] border border-[#222] hover:border-[#2a2a2a] transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <Sparkles size={12} className={aiLoading ? "animate-pulse" : ""} />
                  {aiLoading ? "Removing…" : aiAvailable ? "Remove BG (AI)" : "Remove White BG"}
                </button>
              </div>
            </div>

            {/* View code at bottom of sidebar */}
            <div className="border-t border-[#181818] p-3 shrink-0">
              <button
                onClick={() => setShowCode((s) => !s)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-[12px] font-medium transition-all cursor-pointer ${
                  showCode
                    ? "bg-[#1d1d1d] text-[#c8c8c8]"
                    : "text-[#666] hover:text-[#aaa] hover:bg-[#141414]"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Code2 size={13} />
                  {showCode ? "Hide code" : "View code"}
                </div>
                {showCode ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      {stage === "idle" && (
        <footer className="px-5 py-3.5 border-t border-[#111] flex items-center justify-between shrink-0">
          <span className="text-[11px] text-[#282828]">
            Built by{" "}
            <a href="https://www.damilareoo.xyz" target="_blank" rel="noopener noreferrer" className="hover:text-[#444] transition-colors">
              Damilare Osofisan
            </a>
          </span>
          <span className="text-[11px] text-[#222]">Powered by ImageTracer · Replicate</span>
        </footer>
      )}
    </main>
  )
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1048576).toFixed(1)} MB`
}
