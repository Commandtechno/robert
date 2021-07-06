import { Readable } from "stream";

const protocols = {
  "https:": require("https").request,
  "http:": require("http").request
};

interface Options {
  base?: string;
  port?: number;
  headers?: object;
}

class Client {
  base: string;
  port: number;
  headers: object;

  constructor(options: string | Options = {}) {
    if (typeof options === "string") options = { base: options };
    this.base = typeof options.base === "string" ? options.base : "";
    this.port = typeof options.port === "number" ? options.port : 443;
    this.headers = typeof options.headers === "object" ? options.headers : {};
  }

  header(name: string, value: string) {
    this.headers[name] = value;
    return this;
  }

  setHeaders(headers: object) {
    this.headers = headers;
    return this;
  }

  get(url: string) {
    return new req({
      method: "GET",
      url: new URL(this.base + url),
      port: this.port,
      headers: this.headers
    });
  }

  head(url: string) {
    return new req({
      method: "HEAD",
      url: new URL(this.base + url),
      port: this.port,
      headers: this.headers
    });
  }

  post(url: string) {
    return new req({
      method: "POST",
      url: new URL(this.base + url),
      port: this.port,
      headers: this.headers
    });
  }

  put(url: string) {
    return new req({
      method: "PUT",
      url: new URL(this.base + url),
      port: this.port,
      headers: this.headers
    });
  }

  delete(url: string) {
    return new req({
      method: "DELETE",
      url: new URL(this.base + url),
      port: this.port,
      headers: this.headers
    });
  }

  connect(url: string) {
    return new req({
      method: "CONNECT",
      url: new URL(this.base + url),
      port: this.port,
      headers: this.headers
    });
  }

  options(url: string) {
    return new req({
      method: "OPTIONS",
      url: new URL(this.base + url),
      port: this.port,
      headers: this.headers
    });
  }

  trace(url: string) {
    return new req({
      method: "TRACE",
      url: new URL(this.base + url),
      port: this.port,
      headers: this.headers
    });
  }

  patch(url: string) {
    return new req({
      method: "PATCH",
      url: new URL(this.base + url),
      port: this.port,
      headers: this.headers
    });
  }
}

class req {
  method: string;
  url: URL;
  port: number;
  headers: object;
  data?: Buffer | string;

  constructor(config) {
    Object.assign(this, config);
  }

  query(key: string, value: string) {
    this.url.searchParams.append(key, value);
    return this;
  }

  setQuery(
    query?: string[][] | Record<string, string> | string | URLSearchParams
  ) {
    this.url.search = new URLSearchParams(query).toString();
    return this;
  }

  header(key: string, value: string) {
    this.headers[key] = value;
    return this;
  }

  setHeaders(headers: object) {
    this.headers = headers;
    return this;
  }

  buffer(buffer: Buffer) {
    this.data = buffer;
    return this;
  }

  text(text: string) {
    this.data = text;
    this.header("Content-Type", "text/raw");
    return this;
  }

  json(json: object) {
    this.data = JSON.stringify(json);
    this.header("Content-Type", "application/json");
    return this;
  }

  form(form?: string[][] | Record<string, string> | string | URLSearchParams) {
    this.data = new URLSearchParams(form).toString();
    this.header("Content-Type", "application/x-www-form-urlencoded");
    return this;
  }

  send() {
    return new res(this.url, this.data, {
      method: this.method,
      headers: this.headers,
      port: this.port
    });
  }
}

class res {
  data: Promise<Readable>;
  statusCode: number;
  statusMessage: string;
  headers: object;

  constructor(url, body, config) {
    this.data = new Promise((resolve, reject) => {
      const req = protocols[url.protocol](url, config, (res) => {
        this.headers = res.headers;
        this.statusCode = res.statusCode;
        this.statusMessage = res.statusMessage;

        resolve(res);
      });

      if (body) req.write(body);
      req.on("error", reject);
      req.end();
    });
  }

  stream(): Promise<{
    data: Readable;
    statusCode: number;
    statusMessage: string;
    headers: object;
  }> {
    return this.data.then((stream) => ({
      data: stream,
      statusCode: this.statusCode,
      statusMessage: this.statusMessage,
      headers: this.headers
    }));
  }

  buffer(): Promise<{
    data: Buffer;
    statusCode: number;
    statusMessage: string;
    headers: object;
  }> {
    return this.bufferArray().then((res) => ({
      data: Buffer.concat(res.data),
      statusCode: res.statusCode,
      statusMessage: res.statusMessage,
      headers: res.headers
    }));
  }

  bufferArray(): Promise<{
    data: Array<Buffer>;
    statusCode: number;
    statusMessage: string;
    headers: object;
  }> {
    return this.data.then(
      (stream) =>
        new Promise((resolve, reject) => {
          let res = [];
          stream.on("data", res.push);
          stream.on("end", () =>
            resolve({
              data: res,
              statusCode: this.statusCode,
              statusMessage: this.statusMessage,
              headers: this.headers
            })
          );
          stream.on("error", reject);
        })
    );
  }

  arrayBuffer(): Promise<{
    data: ArrayBuffer;
    statusCode: number;
    statusMessage: string;
    headers: object;
  }> {
    return this.buffer().then((res) => ({
      data: res.data.buffer.slice(
        res.data.byteLength,
        res.data.byteOffset + res.data.byteLength
      ),
      statusCode: res.statusCode,
      statusMessage: res.statusMessage,
      headers: res.headers
    }));
  }

  blob(): Promise<{
    data: Blob;
    statusCode: number;
    statusMessage: string;
    headers: object;
  }> {
    return this.bufferArray().then((res) => ({
      data: new Blob(res.data, { type: this.headers["Content-Type"] }),
      statusCode: res.statusCode,
      statusMessage: res.statusMessage,
      headers: res.headers
    }));
  }

  text(): Promise<{
    data: string;
    statusCode: number;
    statusMessage: string;
    headers: object;
  }> {
    return this.data.then(
      (stream) =>
        new Promise((resolve, reject) => {
          let res = "";
          stream.on("data", (chunk) => (res += chunk));
          stream.on("end", () =>
            resolve({
              data: res,
              statusCode: this.statusCode,
              statusMessage: this.statusMessage,
              headers: this.headers
            })
          );
          stream.on("error", reject);
        })
    );
  }

  json(): Promise<{
    data: object;
    statusCode: number;
    statusMessage: string;
    headers: object;
  }> {
    return this.text().then((res) => ({
      data: JSON.parse(res.data),
      statusCode: res.statusCode,
      statusMessage: res.statusMessage,
      headers: res.headers
    }));
  }
}

export = Object.assign(new Client(), { Client });
