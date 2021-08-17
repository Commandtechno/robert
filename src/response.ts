import { Body, Params, RequestOptions } from "./types";
import { toBuffer, toBuffers } from "./util";

import { Stream } from "stream";
import { request as http } from "http";
import { request as https } from "https";

export default function response(
  method: string,
  format: string,
  url: string,
  body: Body,
  options: RequestOptions,
  redirects: number
): Promise<any> {
  const query = new URLSearchParams(options.query as Params).toString();
  if (query) url += "?" + query;

  return new Promise((resolve, reject) => {
    const req = (url.startsWith("https") ? https : http)(
      url,
      {
        method,
        port: options.port,
        headers: options.headers,
        timeout: options.timeout
      },
      (res) => {
        res.on("error", (error) => reject(error));

        if ((res.statusCode === 301 || res.statusCode === 302) && res.headers.location) {
          redirects--;
          if (redirects < 0) return reject(Error("Max redirects reached"));
          return response(method, format, res.headers.location, body, options, redirects);
        }

        if ((res.statusCode < 200 || res.statusCode >= 400) && !options.full)
          return reject(
            Error("URL responded with status " + res.statusCode + ": " + res.statusMessage)
          );

        async function $(data) {
          try {
            data = await data;
          } catch (e) {
            return reject(e);
          }

          resolve(
            options.full
              ? {
                  data,
                  status: res.statusCode,
                  statusText: res.statusMessage,
                  headers: res.headers
                }
              : data
          );
        }

        switch (format) {
          case "status":
            return $({ code: res.statusCode, text: res.statusMessage });
          case "headers":
            return $(res.headers);
          case "stream":
            return $(res);
          case "buffer":
            return $(toBuffer(res, options.size));
          case "bufferArray":
            return $(toBuffers(res, options.size));
          case "text":
            return $(toBuffer(res, options.size).then((buffer) => buffer.toString()));
          case "json":
            return $(toBuffer(res, options.size).then((buffer) => JSON.parse(buffer.toString())));
          case "arrayBuffer":
            return $(
              toBuffer(res, options.size).then((buffer) =>
                buffer.slice(buffer.byteLength, buffer.byteOffset + buffer.byteLength)
              )
            );
          case "blob":
            return $(
              toBuffers(res, options.size).then(
                (buffers) => new Blob(buffers, { type: res.headers["content-type"] })
              )
            );
          default:
            throw Error("Unknown format");
        }
      }
    );

    if (body) {
      if (body instanceof Stream) body.pipe(req);
      else req.write(body);
    }

    req.on("socket", (socket) =>
      socket.on("timeout", () => req.destroy(Error("Request timed out")))
    );

    req.on("error", (error) => reject(error));
    req.end();
  });
}