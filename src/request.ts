import { Key, Body, Value, Query, Header, Headers, Methods, Formats } from "./types/common";
import { FormData, Options, Request } from "./types/request";

import { parseSize, parseTime } from "./util";
import response from "./response";

import { Readable } from "stream";

export default function (method: Methods, url: string, options: Options): Request {
  let body: Body;

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

    query(key: Value, value: Value): Request {
      // @ts-ignore still the same fucking issue
      options.query.append(key, value);
      return this;
    },
    setQuery(query: Query): Request {
      // @ts-ignore yeah
      options.query = new URLSearchParams(query);
      return this;
    },
    addQuery(query: Query): Request {
      // @ts-ignore h
      const entries = new URLSearchParams(query).entries();
      for (const [key, value] of entries) options.query.append(key, value);
      return this;
    },
    delQuery(key: Key): Request {
      // @ts-ignore fucking
      options.query.delete(key);
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

    formData(formData: FormData): Request {
      Object.assign(options.headers, formData.getHeaders());
      body = formData;
      return this;
    },
    stream(stream: Readable): Request {
      body = stream;
      return this;
    },
    buffer(buffer: Buffer): Request {
      body = buffer;
      return this;
    },
    text(text: string): Request {
      this.contentType("text/plain");
      body = text;
      return this;
    },
    json(json: object): Request {
      this.contentType("application/json");
      body = JSON.stringify(json);
      return this;
    },
    form(form: Query): Request {
      this.contentType("application/x-www-form-urlencoded");

      // @ts-ignore h
      body = new URLSearchParams(form).toString();
      return this;
    },

    send(format: Formats = options.format, full: boolean = options.full): Promise<any> {
      options.format = format;
      options.full = full;

      const query = options.query.toString();
      if (query) url += "?" + query;

      return response(method, url, body, options);
    }
  };
}