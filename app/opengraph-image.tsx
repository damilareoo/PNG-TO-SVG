import { ImageResponse } from "next/og"

export const runtime = "edge"
export const alt = "PNG to SVG — Free Image Converter"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          backgroundColor: "#0a0a0a",
          position: "relative",
          fontFamily: "sans-serif",
          overflow: "hidden",
        }}
      >
        {/* Ghost "PNG" — large, faded, top-left */}
        <div
          style={{
            position: "absolute",
            top: -30,
            left: -12,
            fontSize: 400,
            fontWeight: 800,
            color: "rgba(255,255,255,0.028)",
            lineHeight: 1,
            letterSpacing: "-0.04em",
            display: "flex",
          }}
        >
          PNG
        </div>

        {/* Ghost "SVG" — large, faded, bottom-right */}
        <div
          style={{
            position: "absolute",
            bottom: -70,
            right: -12,
            fontSize: 400,
            fontWeight: 800,
            color: "rgba(255,255,255,0.045)",
            lineHeight: 1,
            letterSpacing: "-0.04em",
            display: "flex",
          }}
        >
          SVG
        </div>

        {/* Thin horizontal rule accent */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 1,
            backgroundColor: "rgba(255,255,255,0.06)",
            display: "flex",
          }}
        />

        {/* Foreground content */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "80px 88px",
            gap: 0,
          }}
        >
          {/* Eyebrow */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 28,
            }}
          >
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                backgroundColor: "#e0e0e0",
                display: "flex",
              }}
            />
            <span
              style={{
                fontSize: 13,
                color: "#3c3c3c",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                fontWeight: 600,
                display: "flex",
              }}
            >
              Free · No signup · Runs in your browser
            </span>
          </div>

          {/* Headline */}
          <div
            style={{
              fontSize: 100,
              fontWeight: 700,
              color: "#eeeeee",
              lineHeight: 1,
              letterSpacing: "-0.035em",
              display: "flex",
            }}
          >
            PNG to SVG
          </div>

          {/* Subline */}
          <div
            style={{
              marginTop: 24,
              fontSize: 26,
              color: "#444",
              lineHeight: 1.45,
              maxWidth: 580,
              display: "flex",
            }}
          >
            Convert any raster image to a clean,
            editable vector — instantly.
          </div>

          {/* URL */}
          <div
            style={{
              marginTop: 52,
              fontSize: 14,
              color: "#252525",
              letterSpacing: "0.06em",
              display: "flex",
            }}
          >
            v0-png-to-svg.vercel.app
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  )
}
