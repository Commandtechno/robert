import { Client, ClientOptions, Formats, Header, Headers, Key, Options } from "./types";
import { parseSize, parseTime } from "./util";

import request from "./request";

const global: ClientOptions = {
  base: "",
  full: false,
  port: null,
  size: "10mb",
  query: {},
  format: "stream",
  headers: {},
  timeout: "30s",
  redirects: 3
};

function create(method: string, options: Options) {
  return function (url: string = "") {
    const $ = new URL(options.base + url);
    const headers = { ...options.headers };
    const query = { ...options.query, ...Object.fromEntries([...$.searchParams]) };

    $.search = "";
    return request(method, $.toString(), {
      query,
      headers,
      size: options.size,
      full: options.full,
      port: options.port,
      format: options.format,
      timeout: options.timeout,
      redirects: options.redirects
    });
  };
}

export default function (options?: string | ClientOptions) {
  let opts: ClientOptions = {};
  if (typeof options === "string") opts = { base: options };

  opts = Object.assign({}, global, opts);
  opts.timeout = parseTime(opts.timeout);
  opts.size = parseSize(opts.size);

  return {
    get: create("GET", opts as Options),
    put: create("PUT", opts as Options),
    head: create("HEAD", opts as Options),
    post: create("POST", opts as Options),
    patch: create("PATCH", opts as Options),
    delete: create("DELETE", opts as Options),
    options: create("OPTIONS", opts as Options),

    full(): Client {
      opts.full = !opts.full;
      return this;
    },
    format(format: Formats): Client {
      opts.format = format;
      return this;
    },
    base(base: string): Client {
      opts.base = base;
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

    query(key: Key, value: any): Client {
      opts.query[key] = value;
      return this;
    },
    setQuery(query: object): Client {
      opts.query = query;
      return this;
    },
    addQuery(query: object): Client {
      Object.assign(opts.query, query);
      return this;
    },
    delQuery(key: Key): Client {
      delete opts.query[key];
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
  };
}