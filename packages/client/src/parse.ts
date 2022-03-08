import {
  toBuffer,
  toBuffers,
  toString,
  toJSON,
  toArrayBuffer,
  toBlob,
} from "robert-util";
import { Formats } from ".";

import { IncomingMessage } from "http";

export default async function (
  res: IncomingMessage,
  format: Formats,
  maxSize: number
) {
  switch (format) {
    case "status":
      return res.statusCode;
    case "statusText":
      return res.statusMessage;
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
