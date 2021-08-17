import { Stream } from "stream";

export type Key = number | string;
export type Body = Stream | Buffer | string;
export type Params = string[][] | Record<string, string> | string | URLSearchParams;
export type Header = number | string | string[];
export type Headers = Record<Key, Header>;
export type Formats =
  | "status"
  | "headers"
  | "stream"
  | "buffer"
  | "bufferArray"
  | "text"
  | "json"
  | "arrayBuffer"
  | "blob";

export interface Client {
  get(url?: string): Request;
  put(url?: string): Request;
  head(url?: string): Request;
  post(url?: string): Request;
  patch(url?: string): Request;
  delete(url?: string): Request;
  options(url?: string): Request;

  full(): Client;
  format(format: Formats): Client;
  base(base: string): Client;
  port(port: number): Client;
  redirects(redirects: number): Client;
  size(size: string | number): Client;
  timeout(time: string | number): Client;

  query(key: Key, value: any): Client;
  setQuery(query: object): Client;
  addQuery(query: object): Client;
  delQuery(key: Key): Client;

  header(key: Key, value: Header): Client;
  setHeaders(headers: Headers): Client;
  addHeaders(headers: Headers): Client;
  delHeader(key: Key): Client;

  auth(value: Header): Client;
  agent(value: Header): Client;
  contentType(value: Header): Client;
}

export interface Request {
  full(): Request;
  format(formats: Formats): Request;
  port(port: number): Request;
  redirects(redirects: number): Request;
  size(size: string | number): Request;
  timeout(time: string | number): Request;

  query(key: Key, value: any): Request;
  setQuery(query: object): Request;
  addQuery(query: object): Request;
  delQuery(key: Key): Request;

  header(key: Key, value: Header): Request;
  setHeaders(headers: Headers): Request;
  addHeaders(headers: Headers): Request;
  delHeader(key: Key): Request;

  auth(value: Header): Request;
  agent(value: Header): Request;
  contentType(value: Header): Request;
  contentLength(value?: Header): Request;

  stream(data: Stream): Request;
  buffer(buffer: Buffer): Request;
  text(text: string): Request;
  json(json: object): Request;
  form(form: object): Request;

  send(format?: Formats): Promise<any>;
}

export interface RequestOptions {
  full: boolean;
  port: number;
  size: number;
  query: object;
  format: Formats;
  headers: Headers;
  timeout: number;
  redirects: number;
}

export interface ClientOptions {
  base?: string | URL;
  full?: boolean;
  port?: number;
  size?: number | string;
  query?: object;
  format?: Formats;
  headers?: Headers;
  timeout?: number | string;
  redirects?: number;
}

export interface Options {
  base?: string | URL;
  full?: boolean;
  port?: number;
  size?: number;
  query?: object;
  format?: Formats;
  headers?: Headers;
  timeout?: number;
  redirects?: number;
}