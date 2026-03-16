interface PreprocessOptions {
  contrast?: number
  brightness?: number
  sharpen?: boolean
  scale?: number
}

export async function preprocessImage(
  dataUrl: string,
  options: PreprocessOptions = {}
): Promise<string> {
  const { contrast = 1, brightness = 1, sharpen = false, scale = 2 } = options

  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      const w = img.width * scale
      const h = img.height * scale

      const canvas = document.createElement("canvas")
      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext("2d")!

      // Apply contrast + brightness via filter before drawing
      ctx.filter = `contrast(${contrast}) brightness(${brightness})`
      ctx.drawImage(img, 0, 0, w, h)
      ctx.filter = "none"

      if (sharpen) {
        const imageData = ctx.getImageData(0, 0, w, h)
        const sharpened = applySharpen(imageData)
        ctx.putImageData(sharpened, 0, 0)
      }

      resolve(canvas.toDataURL("image/png"))
    }
    img.src = dataUrl
  })
}

// 3×3 unsharp mask kernel
function applySharpen(imageData: ImageData): ImageData {
  const src = imageData.data
  const w = imageData.width
  const h = imageData.height
  const out = new Uint8ClampedArray(src)

  const kernel = [0, -1, 0, -1, 5, -1, 0, -1, 0]

  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      for (let c = 0; c < 3; c++) {
        let val = 0
        for (let ky = -1; ky <= 1; ky++) {
          for (let kx = -1; kx <= 1; kx++) {
            const idx = ((y + ky) * w + (x + kx)) * 4 + c
            val += src[idx] * kernel[(ky + 1) * 3 + (kx + 1)]
          }
        }
        out[(y * w + x) * 4 + c] = Math.min(255, Math.max(0, val))
      }
    }
  }

  return new ImageData(out, w, h)
}

export function removeWhiteBackground(dataUrl: string, tolerance = 30): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement("canvas")
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext("2d")!
      ctx.drawImage(img, 0, 0)

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imageData.data

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i], g = data[i + 1], b = data[i + 2]
        if (r >= 255 - tolerance && g >= 255 - tolerance && b >= 255 - tolerance) {
          data[i + 3] = 0
        }
      }

      ctx.putImageData(imageData, 0, 0)
      resolve(canvas.toDataURL("image/png"))
    }
    img.src = dataUrl
  })
}

export function optimizeSvg(svg: string): string {
  // Remove unnecessary attributes added by imagetracerjs
  return svg
    .replace(/ desc="[^"]*"/g, "")
    .replace(/<desc>[^<]*<\/desc>/g, "")
    .trim()
}
