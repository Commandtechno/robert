import { Key, Value, Query, Header, Headers, Formats } from "./common";

import { Readable } from "stream";

export interface FormData extends Readable {
  getHeaders();
}

export interface Options {
  full: boolean;
  port: number;
  size: number;
  query: URLSearchParams;
  format: Formats;
  headers: Headers;
  timeout: number;
  redirects: number;
}

export interface Request {
  full(): Request;
  format(formats: Formats): Request;
  port(port: number): Request;
  redirects(redirects: number): Request;
  size(size: string | number): Request;
  timeout(time: string | number): Request;

  query(key: Value, value: Value): Request;
  setQuery(query: Query): Request;
  addQuery(query: Query): Request;
  delQuery(key: Value): Request;

  header(key: Key, value: Header): Request;
  setHeaders(headers: Headers): Request;
  addHeaders(headers: Headers): Request;
  delHeader(key: Key): Request;

  auth(value: Header): Request;
  agent(value: Header): Request;
  contentType(value: Header): Request;
  contentLength(value?: Header): Request;

  formData(formData: FormData): Request;
  stream(data: Readable): Request;
  buffer(buffer: Buffer): Request;
  text(text: string): Request;
  json(json: object): Request;
  form(form: Query): Request;

  send(format?: Formats, full?: boolean): Promise<any>;
}