import { Formats } from "./types/common";

import { IncomingMessage } from "http";

function toBuffers(res: IncomingMessage, maxSize: number): Promise<Buffer[]> {
  return new Promise((resolve, reject) => {
    let buffers = [];
    let size = 0;

    res.on("data", data => {
      size += Buffer.byteLength(data);
      if (size > maxSize) reject(new Error("Body over maximum size: " + size));
      else buffers.push(data);
    });

    res.on("error", error => reject(error));
    res.on("end", () => resolve(buffers));
  });
}

async function toBuffer(res: IncomingMessage, maxSize: number): Promise<Buffer> {
  const buffers = await toBuffers(res, maxSize);
  return Buffer.concat(buffers);
}

async function toArrayBuffer(res: IncomingMessage, maxSize: number): Promise<ArrayBuffer> {
  const buffer = await toBuffer(res, maxSize);
  return buffer.slice(buffer.byteLength, buffer.byteOffset + buffer.byteLength);
}

async function toBlob(res: IncomingMessage, maxSize: number): Promise<Blob> {
  const buffers = await toBuffers(res, maxSize);
  return new Blob(buffers, { type: res.headers["content-type"] });
}

async function toString(res: IncomingMessage, maxSize: number): Promise<string> {
  const buffer = await toBuffer(res, maxSize);
  return buffer.toString();
}

async function toJSON(res: IncomingMessage, maxSize: number): Promise<object> {
  const string = await toString(res, maxSize);
  return JSON.parse(string);
}

export default async function (res: IncomingMessage, format: Formats, maxSize: number) {
  switch (format) {
    case "status":
      return { code: res.statusCode, message: res.statusMessage };
    case "headers":
      return res.headers;
    case "stream":
      return res;
    case "buffer":
      return toBuffer(res, maxSize);
    case "bufferArray":
      return toBuffers(res, maxSize);
    case "text":
      return toString(res, maxSize);
    case "json":
      return toJSON(res, maxSize);
    case "arrayBuffer":
      return toArrayBuffer(res, maxSize);
    case "blob":
      return toBlob(res, maxSize);
    default:
      throw new Error("Invalid format: " + format);
  }
}