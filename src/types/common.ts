import { Readable } from "stream";

export type Key = string | number;
export type Body = Readable | Buffer | string;
export type Value = string | boolean | number | bigint;
export type Query = Record<Key, Value> | Value[][] | URLSearchParams | string;
export type Header = Value | Value[];
export type Headers = Record<Key, Header>;
export type Methods = "GET" | "PUT" | "HEAD" | "POST" | "PATCH" | "DELETE" | "OPTIONS";
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