import { Formats, Header, Headers, Key, Params, Request, RequestOptions } from "./types";
import { parseSize, parseTime } from "./util";

import { Stream } from "stream";
import response from "./response";

export default function (method: string, url: string, options: RequestOptions): Request {
  let body: Stream | Buffer | string;

  return {
    full(): Request {
      options.full = !options.full;
      return this;
    },
    format(format: Formats): Request {
      options.format = format;
      return this;
    },
    port(port: number): Request {
      options.port = port;
      return this;
    },
    redirects(redirects: number): Request {
      options.redirects = redirects;
      return this;
    },
    size(size: string | number): Request {
      options.size = parseSize(size);
      return this;
    },
    timeout(time: string | number): Request {
      options.timeout = parseTime(time);
      return this;
    },

    query(key: Key, value: any): Request {
      options.query[key] = value;
      return this;
    },
    setQuery(query: object): Request {
      options.query = query;
      return this;
    },
    addQuery(query: object): Request {
      Object.assign(options.query, query);
      return this;
    },
    delQuery(key: Key): Request {
      delete options.query[key];
      return this;
    },

    header(key: Key, value: Header): Request {
      options.headers[key] = value;
      return this;
    },
    setHeaders(headers: Headers): Request {
      options.headers = headers;
      return this;
    },
    addHeaders(headers: Headers): Request {
      Object.assign(options.headers, headers);
      return this;
    },
    delHeader(key: Key): Request {
      delete options.headers[key];
      return this;
    },

    auth(value: Header): Request {
      this.header("authorization", value);
      return this;
    },
    agent(value: Header): Request {
      this.header("user-agent", value);
      return this;
    },
    contentType(value: Header): Request {
      this.header("content-type", value);
      return this;
    },
    contentLength(value: Header = this.body.length): Request {
      this.header("content-length", value);
      return this;
    },

    stream(stream: Stream): Request {
      body = stream;
      return this;
    },
    buffer(buffer: Buffer): Request {
      body = buffer;
      return this;
    },
    text(text: string): Request {
      this.contentType("text/raw");
      body = text;
      return this;
    },
    json(json: object): Request {
      this.contentType("application/json");
      body = JSON.stringify(json);
      return this;
    },
    form(form: object): Request {
      this.contentType("application/x-www-form-urlencoded");
      body = new URLSearchParams(form as Params).toString();
      return this;
    },

    send(format: Formats = options.format): Promise<any> {
      return response(method, format, url, body, options, options.redirects);
    }
  };
}