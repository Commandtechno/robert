const ratio = 1024;
export const sizes = {
  k: Math.pow(ratio, 1),
  m: Math.pow(ratio, 2),
  g: Math.pow(ratio, 3),
  t: Math.pow(ratio, 4),
  p: Math.pow(ratio, 5),
  e: Math.pow(ratio, 6),
  z: Math.pow(ratio, 7),
  y: Math.pow(ratio, 8)
};

export function parseSize(size: number | string): number {
  if (typeof size === "number") return size;

  const bytes = parseInt(size.match(/^\d+/)[0]);
  const unit = size
    .replace(/^\d+\s*/, "")
    .trimEnd()
    .replace(/[bB]$/, "")
    .toLowerCase();

  return bytes * (sizes[unit] ?? 0);
}