import { Key, Value, Query, Header, Headers, Formats } from "./common";

import { IncomingMessage } from "http";
import { Readable } from "stream";

export interface FormData extends Readable {
  getHeaders();
}

export interface Status {
  code: number;
  message: string;
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

export type Response<Type> = Promise<
  | Type
  | {
      url: string;
      data: Type;
      status: Status;
      headers: Headers;
    }
>;

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

  send(format: "status", full?: boolean): Response<Status>;
  send(format: "headers", full?: boolean): Response<Headers>;
  send(format: "stream", full?: boolean): Response<IncomingMessage>;
  send(format: "buffer", full?: boolean): Response<Buffer>;
  send(format: "bufferArray", full?: boolean): Response<Buffer[]>;
  send(format: "text", full?: boolean): Response<string>;
  send(format: "json", full?: boolean): Response<object>;
  send(format: "arrayBuffer", full?: boolean): Response<ArrayBuffer>;
  send(format: "blob", full?: boolean): Response<Blob>;
  send(): Response<any>;
}