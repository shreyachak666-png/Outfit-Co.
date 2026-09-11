/**
 * Turns an outfit title into a URL-friendly slug.
 * "The Burgundy Edit!" -> "the-burgundy-edit"
 */
export function slugify(input: string): string {
  return input
    .toString()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "") // strip accents
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "") // strip anything not alphanumeric/space/hyphen
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Picks a readable text colour class for a given hex background colour,
 * used when the colour is a custom pick rather than one of the presets.
 */
export function textClassForColor(hex: string): string {
  const clean = hex.replace("#", "");
  if (clean.length !== 6) return "text-ink";
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  // Perceived luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance < 0.5 ? "text-ivory" : "text-ink";
}
