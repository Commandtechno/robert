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