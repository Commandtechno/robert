import { sizes, times } from "./constants";

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

export function parseTime(time: number | string): number {
  if (typeof time === "number") return time;

  const amount = parseInt(time.match(/^\d+/)[0]);
  const unit = time
    .replace(/^\d+\s*/, "")
    .trimEnd()
    .toLowerCase();

  return amount * (times[unit] ?? 0);
}