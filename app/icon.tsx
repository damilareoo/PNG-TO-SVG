import { ImageResponse } from "next/og"

export const runtime = "edge"
export const size = { width: 32, height: 32 }
export const contentType = "image/png"

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          backgroundColor: "#0a0a0a",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 6,
        }}
      >
        {/* P → S mark: small dot (raster) + arrow + triangle (vector) */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          {/* Raster dot */}
          <div
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              backgroundColor: "#888",
              display: "flex",
            }}
          />
          {/* Arrow */}
          <div
            style={{
              width: 6,
              height: 1,
              backgroundColor: "#555",
              display: "flex",
            }}
          />
          {/* Vector triangle */}
          <div
            style={{
              width: 0,
              height: 0,
              borderLeft: "5px solid transparent",
              borderRight: "5px solid transparent",
              borderBottom: "8px solid #e0e0e0",
              display: "flex",
            }}
          />
        </div>
      </div>
    ),
    { width: 32, height: 32 },
  )
}
