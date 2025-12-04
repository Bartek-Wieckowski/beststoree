export const COLOR_NAME_TO_HEX: Record<string, string> = {
  // Basic colors
  red: "#FF0000",
  green: "#008000",
  blue: "#0000FF",
  yellow: "#FFFF00",
  orange: "#FFA500",
  purple: "#800080",
  pink: "#FFC0CB",
  black: "#000000",
  white: "#FFFFFF",
  gray: "#808080",
  grey: "#808080",
  brown: "#A52A2A",

  // Extended colors
  navy: "#000080",
  "navy blue": "#000080",
  "light blue": "#ADD8E6",
  "dark blue": "#00008B",
  "sky blue": "#87CEEB",

  "forest green": "#228B22",
  "lime green": "#32CD32",
  "olive green": "#808000",
  "dark green": "#006400",

  "cherry red": "#DE3163",
  crimson: "#DC143C",
  burgundy: "#800020",
  maroon: "#800000",

  gold: "#FFD700",
  silver: "#C0C0C0",
  beige: "#F5F5DC",
  tan: "#D2B48C",
  khaki: "#F0E68C",

  lavender: "#E6E6FA",
  violet: "#8A2BE2",
  indigo: "#4B0082",

  coral: "#FF7F50",
  salmon: "#FA8072",
  peach: "#FFE5B4",

  turquoise: "#40E0D0",
  teal: "#008080",
  cyan: "#00FFFF",

  ivory: "#FFFFF0",
  cream: "#FFFDD0",
  "off-white": "#FAF9F6",
};

export function getColorValue(colorName: string): string {
  const normalized = colorName.toLowerCase().trim();
  return COLOR_NAME_TO_HEX[normalized] || colorName;
}
