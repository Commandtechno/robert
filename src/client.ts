import { Key, Value, Query, Header, Headers, Methods, Formats } from "./types/common";
import { Client, Options as ClientOptions } from "./types/client";
import { Options as RequestOptions } from "./types/request";

import { parseSize, parseTime } from "./util";
import request from "./request";

function create(method: Methods, base: string, options: RequestOptions) {
  return function (url: URL | string = "") {
    url = new URL(base + url);

    options.headers = { ...options.headers };
    const entries = url.searchParams.entries();
    for (const [key, value] of entries) options.query.append(key, value);
    url.search = "";

    return request(method, url.toString(), { ...options });
  };
}

export default function (options?: ClientOptions): Client {
  options ??= {};
  if (typeof options === "string" || options instanceof URL) options = { base: options };

  let base = "";
  if (options.base) base = options.base.toString();

  const opts: RequestOptions = {
    full: options.full ?? false,
    port: options.port ?? null,
    size: parseSize(options.size ?? "100mb"),
    query: options.query ?? new URLSearchParams(),
    format: options.format ?? "stream",
    headers: options.headers ? { ...options.headers } : {},
    timeout: parseTime(options.timeout ?? "1m"),
    redirects: 10
  };

  return Object.assign(create("GET", base, opts), {
    get: create("GET", base, opts),
    put: create("PUT", base, opts),
    head: create("HEAD", base, opts),
    post: create("POST", base, opts),
    patch: create("PATCH", base, opts),
    delete: create("DELETE", base, opts),
    options: create("OPTIONS", base, opts),

    full(): Client {
      opts.full = !opts.full;
      return this;
    },
    format(format: Formats): Client {
      opts.format = format;
      return this;
    },
    base(base: string | URL): Client {
      base = base.toString();
      return this;
    },
    port(port: number): Client {
      opts.port = port;
      return this;
    },
    redirects(redirects: number): Client {
      opts.redirects = redirects;
      return this;
    },
    size(size: string | number): Client {
      opts.size = parseSize(size);
      return this;
    },
    timeout(time: string | number): Client {
      opts.timeout = parseTime(time);
      return this;
    },

    query(key: Value, value: Value): Client {
      opts.query.append(key.toString(), value.toString());
      return this;
    },
    setQuery(query: Query): Client {
      // alright so i want to find a formal fix for this
      // types only allow strings in paramaters: string[][] | Record<string, string> | string | URLSearchParams
      // though it accepts and i want to be able to pass through Record<Key, Value> | Value[][] | URLSearchParams | string
      // @ts-ignore
      opts.query = new URLSearchParams(query);
      return this;
    },
    addQuery(query: Query): Client {
      // @ts-ignore same thing again
      const entries = new URLSearchParams(query).entries();
      for (const [key, value] of entries) opts.query.append(key, value);
      return this;
    },
    delQuery(key: Key): Client {
      // @ts-ignore pain
      opts.query.delete(key);
      return this;
    },

    header(key: Key, value: Header): Client {
      opts.headers[key] = value;
      return this;
    },
    setHeaders(headers: Headers): Client {
      opts.headers = headers;
      return this;
    },
    addHeaders(headers: Headers): Client {
      Object.assign(opts.headers, headers);
      return this;
    },
    delHeader(key: Key): Client {
      delete opts.headers[key];
      return this;
    },

    auth(value: Header): Client {
      this.header("authorization", value);
      return this;
    },
    agent(value: Header): Client {
      this.header("user-agent", value);
      return this;
    },
    contentType(value: Header): Client {
      this.header("content-type", value);
      return this;
    }
  });
}