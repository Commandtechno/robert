import { Key, Value, Query, Header, Headers, Formats } from "./common";
import { Request } from "./request";

export type ClientOptions =
  | string
  | URL
  | {
      base?: string | URL;
      full?: boolean;
      port?: number;
      size?: number | string;
      query?: URLSearchParams;
      format?: Formats;
      headers?: Headers;
      timeout?: number | string;
      redirects?: number;
    };

export interface Client {
  (url?: URL | string): Request;
  get(url?: URL | string): Request;
  put(url?: URL | string): Request;
  head(url?: URL | string): Request;
  post(url?: URL | string): Request;
  patch(url?: URL | string): Request;
  delete(url?: URL | string): Request;
  options(url?: URL | string): Request;

  full(): Client;
  format(format: Formats): Client;
  base(base: string): Client;
  port(port: number): Client;
  redirects(redirects: number): Client;
  size(size: string | number): Client;
  timeout(time: string | number): Client;

  query(key: Value, value: Value): Client;
  setQuery(query: Query): Client;
  addQuery(query: Query): Client;
  delQuery(key: Value): Client;

  header(key: Key, value: Header): Client;
  setHeaders(headers: Headers): Client;
  addHeaders(headers: Headers): Client;
  delHeader(key: Key): Client;

  auth(value: Header): Client;
  agent(value: Header): Client;
  contentType(value: Header): Client;
}
