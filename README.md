# PNG to SVG Converter

Convert **PNG images to clean, editable SVGs** right in your browser — no upload, no server.

🔗 **[Try it live](https://png-to-svg-converter.vercel.app)**

---

## What It Does

Upload a PNG image and get a downloadable, editable SVG back — instantly. All processing happens client-side.

## Tech Stack

| Tool | Purpose |
|------|---------|
| Next.js | React framework |
| TypeScript | Type safety |
| ImageTracer.js | PNG → SVG tracing algorithm |
| Tailwind CSS | Styling |
| Vercel | Deployment |

## Getting Started

```bash
# 1. Clone the repo
git clone https://github.com/damilareoo/PNG-TO-SVG.git
cd PNG-TO-SVG

# 2. Install dependencies
pnpm install

# 3. Run locally
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## How It Works

1. Upload your PNG
2. The app uses [ImageTracer.js](https://github.com/jankovicsandras/imagetracerjs) to trace the bitmap into vector paths
3. Download the resulting SVG file

---

Built by [Damilare Osofisan](https://www.damilareoo.xyz)
