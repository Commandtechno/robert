import { Options } from "../types/request";
import { Formats } from "../types/common";

export class RobertError extends Error {
  url: string;
  options: Options;

  constructor(url: string, options: Options, message: string) {
    super("RobertError: " + message);
    this.url = url;
    this.options = options;
  }
}

export class RedirectError extends RobertError {
  constructor(url: string, options: Options) {
    super(url, options, "URL redirected over limit");
  }
}

export class TimeoutError extends RobertError {
  time: number;

  constructor(url: string, options: Options, time: number) {
    super(url, options, "Request timed out after " + time + "ms");
    this.time = time;
  }
}

export class ParseError extends RobertError {
  format: Formats;
  error: Error;

  constructor(url: string, options: Options, format: Formats, error: Error) {
    super(url, options, "Could not parse body: (" + format + ") " + error.message);
    this.format = format;
    this.error = error;
  }
}

export class ResponseError extends RobertError {
  code: number;
  text: string;
  body?: any;

  constructor(url: string, options: Options, code: number, text: string, body: any) {
    super(url, options, "URL responded with status " + code + ": " + text);
    this.code = code;
    this.text = text;
    if (body) this.body = body;
  }
}