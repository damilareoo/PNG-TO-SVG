# PNG to SVG Converter

Convert any PNG, JPG, or WebP image to a clean, editable SVG vector — free, instant, no signup.

**[Try it live → v0-png-to-svg.vercel.app](https://v0-png-to-svg.vercel.app)**

---

## What It Does

Upload an image and get a downloadable SVG in seconds. Three conversion modes adapt to your image type, with optional AI background removal (via Replicate) for cleaner results on logos and icons.

## Features

- Three conversion modes — Logo/Icon, Photo, Line Art
- Color count control — 2 to 128 colors
- AI background removal via Replicate (optional, requires API key)
- Client-side white background removal — works without any API key
- Copy SVG code — paste into Figma, code, or design tools
- Side-by-side preview — original vs vector with transparent checkerboard
- Persistent controls sidebar — mode, colors, and background removal always visible on desktop
- Fully responsive — stacked controls panel on mobile

## Tech Stack

| Tool | Purpose |
|------|---------|
| Next.js 15 | React framework |
| TypeScript | Type safety |
| ImageTracer.js | Client-side PNG to SVG tracing |
| Replicate API | AI background removal (optional) |
| Tailwind CSS | Styling |
| Vercel | Deployment |

## Getting Started

```bash
# Clone
git clone https://github.com/damilareoo/PNG-TO-SVG.git
cd PNG-TO-SVG

# Install dependencies
pnpm install

# Run locally
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Optional: AI Background Removal

1. Get a free API key at [replicate.com](https://replicate.com)
2. Create `.env.local`:
   ```env
   REPLICATE_API_TOKEN=your_token_here
   ```
3. Restart dev server — the "Remove BG (AI)" button activates automatically

Without the key, the app falls back to client-side white background removal.

## Conversion Modes

| Mode | Best for | Colors | Preprocessing |
|------|----------|--------|---------------|
| Logo / Icon | Logos, flat art, icons | 2–32 | High contrast + sharpen |
| Photo | Photographs, complex images | 2–128 | Light contrast |
| Line Art | Sketches, drawings, outlines | 2–32 | Max contrast + sharpen |

---

Built by [Damilare Osofisan](https://www.damilareoo.xyz)
