import { IncomingMessage } from "http";

export async function toBuffers(res: IncomingMessage, maxSize: number): Promise<Buffer[]> {
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

export async function toBuffer(res: IncomingMessage, maxSize: number): Promise<Buffer> {
  const buffers = await toBuffers(res, maxSize);
  return Buffer.concat(buffers);
}

export async function toArrayBuffer(res: IncomingMessage, maxSize: number): Promise<ArrayBuffer> {
  const buffer = await toBuffer(res, maxSize);
  return buffer.slice(buffer.byteLength, buffer.byteOffset + buffer.byteLength);
}

export async function toBlob(res: IncomingMessage, maxSize: number): Promise<Blob> {
  const buffers = await toBuffers(res, maxSize);
  return new Blob(buffers, { type: res.headers["content-type"] });
}

export async function toString(res: IncomingMessage, maxSize: number): Promise<string> {
  const buffer = await toBuffer(res, maxSize);
  return buffer.toString();
}

export async function toJSON(res: IncomingMessage, maxSize: number): Promise<object> {
  const string = await toString(res, maxSize);
  return JSON.parse(string);
}