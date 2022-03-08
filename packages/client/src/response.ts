import {
  TimeoutError,
  RedirectError,
  ResponseError,
  ParseError,
} from "./errors";
import { Body, Methods, RequestOptions } from "./types";
import parse from "./parse";

import { request as https } from "https";
import { request as http } from "http";
import { Stream } from "stream";

export default function response(
  method: Methods,
  url: URL,
  body: Body,
  options: RequestOptions
) {
  return new Promise((resolve, reject) => {
    const make = url.protocol === "https:" ? https : http;
    const req = make(
      url,
      {
        method,
        port: options.port,

        // @ts-ignore pain
        headers: options.headers,
        timeout: options.timeout,
      },
      (res) => {
        res.on("error", (error) => reject(error));
        if (res.headers.location) {
          if (options.redirects === 0)
            reject(new RedirectError(url.toString(), options));
          switch (res.statusCode) {
            case 301:
            case 302:
            case 308:
            case 308:
              options.redirects--;
              url = new URL(res.headers.location, url);
              return resolve(response(method, url, body, options));
            case 303:
              options.redirects--;
              method = "GET";
              url = new URL(res.headers.location, url);
              body = null;
              return resolve(response(method, url, body, options));
          }
        }

        if (res.statusCode < 200 || res.statusCode >= 400)
          parse(res, options.format, options.size)
            .catch(() => {})
            .then((data) =>
              reject(
                new ResponseError(
                  url.toString(),
                  options,
                  res.statusCode,
                  res.statusMessage,
                  res.headers,
                  data
                )
              )
            );
        else
          parse(res, options.format, options.size)
            .then((data) =>
              resolve(
                options.full
                  ? {
                      url,
                      data,
                      status: res.statusCode,
                      statusText: res.statusMessage,
                      headers: res.headers,
                    }
                  : data
              )
            )
            .catch((error) =>
              reject(
                new ParseError(url.toString(), options, options.format, error)
              )
            );
      }
    );

    req.on("error", (error) => reject(error));
    req.on("socket", (socket) =>
      socket.on("timeout", () =>
        req.destroy(new TimeoutError(url.toString(), options, options.timeout))
      )
    );

    if (body) {
      if (body instanceof Stream) {
        body.pipe(req);
        body.on("end", () => req.end());
      } else {
        req.write(body);
        req.end();
      }
    } else req.end();
  });
}
