declare module "imagetracerjs" {
  interface ImageTracerOptions {
    ltres?: number
    qtres?: number
    pathomit?: number
    colorsampling?: number
    numberofcolors?: number
    mincolorratio?: number
    colorquantcycles?: number
    layering?: number
    strokewidth?: number
    linefilter?: boolean
    scale?: number
    roundcoords?: number
    viewbox?: boolean
    desc?: boolean
    rightangleenhance?: boolean
    pal?: string[]
    blurradius?: number
    blurdelta?: number
  }

  interface ImageTracer {
    imageToSVG(url: string, callback: (svgString: string) => void, options?: ImageTracerOptions): void
    imagedataToSVG(imageData: ImageData, options?: ImageTracerOptions): string
    appendSVGString(svgString: string, parentElement: HTMLElement): void
  }

  const ImageTracer: ImageTracer
  export default ImageTracer
}
