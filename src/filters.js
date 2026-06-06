export const FILTERS = [
  { id: "normal", label: "Normal", css: "none" },
  { id: "clarendon", label: "Clarendon", css: "contrast(1.2) saturate(1.35)" },
  { id: "gingham", label: "Gingham", css: "brightness(1.05) hue-rotate(-10deg) sepia(0.15)" },
  { id: "moon", label: "Moon", css: "grayscale(1) contrast(1.1) brightness(1.1)" },
  { id: "lark", label: "Lark", css: "contrast(1.1) saturate(1.3) brightness(1.05)" },
  { id: "lofi", label: "Lo-Fi", css: "contrast(1.4) saturate(1.1)" },
  { id: "aden", label: "Aden", css: "hue-rotate(-20deg) saturate(0.85) contrast(0.9) brightness(1.15)" },
  { id: "perpetual", label: "Perpetual", css: "brightness(1.05) sepia(0.2) saturate(1.1) hue-rotate(-5deg)" },
  { id: "reyes", label: "Reyes", css: "brightness(1.1) sepia(0.3) contrast(0.85) saturate(0.85)" },
  { id: "slumber", label: "Slumber", css: "brightness(1.05) saturate(0.7) sepia(0.2)" },
  { id: "crema", label: "Crema", css: "brightness(1.05) sepia(0.15) contrast(0.95)" },
  { id: "willow", label: "Willow", css: "grayscale(0.5) contrast(0.95) brightness(1.1)" },
  { id: "rise", label: "Rise", css: "brightness(1.1) sepia(0.15) contrast(0.95) saturate(1.1)" },
  { id: "inkwell", label: "Inkwell", css: "grayscale(1) contrast(1.2)" },
  { id: "hudson", label: "Hudson", css: "brightness(1.1) contrast(1.1) saturate(1.2) hue-rotate(-10deg)" },
  { id: "valencia", label: "Valencia", css: "brightness(1.08) sepia(0.18) contrast(1.05) saturate(1.1)" },
  { id: "amaro", label: "Amaro", css: "brightness(1.1) saturate(1.3) hue-rotate(-10deg) sepia(0.15)" },
  { id: "brannan", label: "Brannan", css: "sepia(0.35) contrast(1.1) brightness(0.95)" },
  { id: "brooklyn", label: "Brooklyn", css: "brightness(1.1) contrast(0.95) sepia(0.15)" },
  { id: "earlybird", label: "Earlybird", css: "sepia(0.3) contrast(1.1) brightness(1.05) saturate(0.9)" },
  { id: "juno", label: "Juno", css: "saturate(1.4) sepia(0.15) contrast(1.1)" },
  { id: "kelvin", label: "Kelvin", css: "sepia(0.25) brightness(1.1) contrast(1.05) saturate(1.3)" },
  { id: "maven", label: "Maven", css: "sepia(0.35) contrast(1.05) brightness(0.95) saturate(1.2)" },
  { id: "nashville", label: "Nashville", css: "sepia(0.3) contrast(1.1) brightness(1.05) saturate(1.2) hue-rotate(-10deg)" },
  { id: "sierra", label: "Sierra", css: "brightness(1.05) contrast(0.95) sepia(0.2) saturate(1.2)" },
  { id: "sutro", label: "Sutro", css: "brightness(0.95) sepia(0.3) contrast(1.1) saturate(1.3)" },
  { id: "toaster", label: "Toaster", css: "sepia(0.2) contrast(1.4) brightness(0.95)" },
  { id: "walden", label: "Walden", css: "brightness(1.1) sepia(0.2) saturate(1.3) hue-rotate(-10deg)" },
  { id: "xpro2", label: "X-Pro II", css: "sepia(0.3) contrast(1.3) saturate(1.4) hue-rotate(-10deg)" },
];

export const FILTER_MAP = FILTERS.reduce((acc, f) => {
  acc[f.id] = f;
  return acc;
}, {});

export const getFilterCss = (id) => {
  const f = FILTER_MAP[id];
  return f ? f.css : "none";
};

export const getFilterLabel = (id) => {
  const f = FILTER_MAP[id];
  return f ? f.label : "Normal";
};
