import { Stream } from "stream";

const ratio = 1024;
const sizes = {
  k: Math.pow(ratio, 1),
  m: Math.pow(ratio, 2),
  g: Math.pow(ratio, 3),
  t: Math.pow(ratio, 4),
  p: Math.pow(ratio, 5),
  e: Math.pow(ratio, 6),
  z: Math.pow(ratio, 7),
  y: Math.pow(ratio, 8)
};

function parseSize(size: number | string): number {
  if (typeof size === "number") return size;

  const bytes = parseInt(size.match(/^\d+/)[0]);
  const unit = size
    .replace(/^\d+\s*/, "")
    .trimEnd()
    .replace(/[bB]$/, "")
    .toLowerCase();

  return bytes * (sizes[unit] ?? 0);
}

const ms = 1;
const s = ms * 1000;
const m = s * 60;
const h = m * 60;

const times = {
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

function parseTime(time: number | string): number {
  if (typeof time === "number") return time;

  const amount = parseInt(time.match(/^\d+/)[0]);
  const unit = time
    .replace(/^\d+\s*/, "")
    .trimEnd()
    .toLowerCase();

  return amount * (times[unit] ?? 0);
}

function toBuffers(stream: Stream, maxSize: number): Promise<Buffer[]> {
  return new Promise((resolve, reject) => {
    let buffers = [];
    let size = 0;

    stream.on("data", (data) => {
      size += Buffer.byteLength(data);
      if (size > maxSize) reject(Error("Data above maximum size"));
      else buffers.push(data);
    });

    stream.on("error", (error) => reject(error));
    stream.on("end", () => resolve(buffers));
  });
}

function toBuffer(stream: Stream, maxSize: number): Promise<Buffer> {
  return toBuffers(stream, maxSize).then((buffers) => Buffer.concat(buffers));
}

export { parseSize, parseTime, toBuffer, toBuffers };