import { NextRequest, NextResponse } from "next/server"

// Uses Replicate's remove-bg model to strip background before vectorizing.
// Set REPLICATE_API_TOKEN in your Vercel environment variables.
// Model: lucataco/remove-bg
const MODEL_VERSION = "95fcc2a26d3899cd6c2691c900465aaeff466285d05a9b4e7c7d0f5c9aaaa7a5"

export async function POST(req: NextRequest) {
  const token = process.env.REPLICATE_API_TOKEN
  if (!token) {
    return NextResponse.json({ error: "REPLICATE_API_TOKEN not configured" }, { status: 503 })
  }

  const { image } = await req.json()
  if (!image) {
    return NextResponse.json({ error: "No image provided" }, { status: 400 })
  }

  // Create prediction
  const createRes = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: {
      Authorization: `Token ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      version: MODEL_VERSION,
      input: { image },
    }),
  })

  if (!createRes.ok) {
    const err = await createRes.text()
    return NextResponse.json({ error: err }, { status: 500 })
  }

  const prediction = await createRes.json()

  // Poll until complete
  let result = prediction
  while (result.status !== "succeeded" && result.status !== "failed") {
    await new Promise((r) => setTimeout(r, 500))
    const pollRes = await fetch(`https://api.replicate.com/v1/predictions/${result.id}`, {
      headers: { Authorization: `Token ${token}` },
    })
    result = await pollRes.json()
  }

  if (result.status === "failed") {
    return NextResponse.json({ error: "Prediction failed", detail: result.error }, { status: 500 })
  }

  // Fetch the output image and convert to base64 to avoid CORS issues on client
  const outputUrl = result.output
  const imgRes = await fetch(outputUrl)
  const buffer = await imgRes.arrayBuffer()
  const base64 = Buffer.from(buffer).toString("base64")
  const mime = imgRes.headers.get("content-type") ?? "image/png"

  return NextResponse.json({ image: `data:${mime};base64,${base64}` })
}
