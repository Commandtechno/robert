const ms = 1;
const s = ms * 1000;
const m = s * 60;
const h = m * 60;

export const times = {
  ms,
  msec: ms,
  msecs: ms,
  millisecond: ms,
  milliseconds: ms,
  s,
  sec: s,
  secs: s,
  second: s,
  seconds: s,
  m,
  min: m,
  mins: m,
  minute: m,
  minutes: m,
  h,
  hr: h,
  hrs: h,
  hour: h,
  hours: h
};

export function parseTime(time: number | string): number {
  if (typeof time === "number") return time;

  const amount = parseInt(time.match(/^\d+/)[0]);
  const unit = time
    .replace(/^\d+\s*/, "")
    .trimEnd()
    .toLowerCase();

  return amount * (times[unit] ?? 0);
}