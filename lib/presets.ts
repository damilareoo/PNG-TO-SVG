export type PresetKey = "logo" | "photo" | "lineart"

export interface Preset {
  label: string
  description: string
  defaultColors: number
  options: {
    ltres: number
    qtres: number
    pathomit: number
    colorsampling: number
    numberofcolors: number
    mincolorratio: number
    colorquantcycles: number
    strokewidth: number
    linefilter: boolean
    scale: number
    roundcoords: number
    blurradius: number
    blurdelta: number
    rightangleenhance: boolean
  }
  preprocess: {
    contrast: number
    brightness: number
    sharpen: boolean
  }
}

export const PRESETS: Record<PresetKey, Preset> = {
  logo: {
    label: "Logo / Icon",
    description: "Clean shapes, flat colors",
    defaultColors: 8,
    options: {
      ltres: 0.5,
      qtres: 0.5,
      pathomit: 8,
      colorsampling: 2,
      numberofcolors: 8,
      mincolorratio: 0.02,
      colorquantcycles: 2,
      strokewidth: 0,
      linefilter: true,
      scale: 1,
      roundcoords: 1,
      blurradius: 0,
      blurdelta: 20,
      rightangleenhance: true,
    },
    preprocess: { contrast: 1.3, brightness: 1.0, sharpen: false },
  },
  photo: {
    label: "Photo",
    description: "Detailed, full color",
    defaultColors: 64,
    options: {
      ltres: 1,
      qtres: 1,
      pathomit: 4,
      colorsampling: 2,
      numberofcolors: 64,
      mincolorratio: 0,
      colorquantcycles: 2,
      strokewidth: 0,
      linefilter: false,
      scale: 1,
      roundcoords: 1,
      blurradius: 2,
      blurdelta: 20,
      rightangleenhance: false,
    },
    preprocess: { contrast: 1.1, brightness: 1.0, sharpen: false },
  },
  lineart: {
    label: "Line Art",
    description: "Sketches and drawings",
    defaultColors: 2,
    options: {
      ltres: 0.1,
      qtres: 0.1,
      pathomit: 4,
      colorsampling: 2,
      numberofcolors: 2,
      mincolorratio: 0.01,
      colorquantcycles: 3,
      strokewidth: 0,
      linefilter: true,
      scale: 1,
      roundcoords: 0,
      blurradius: 0,
      blurdelta: 20,
      rightangleenhance: false,
    },
    preprocess: { contrast: 1.6, brightness: 1.05, sharpen: false },
  },
}
