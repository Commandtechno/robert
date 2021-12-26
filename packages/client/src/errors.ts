import { Formats, RequestOptions } from ".";

export class RobertError extends Error {
  url: string;
  options: RequestOptions;

  constructor(url: string, options: RequestOptions, message: string) {
    super("RobertError: " + message);
    this.url = url;
    this.options = options;
  }
}

export class RedirectError extends RobertError {
  constructor(url: string, options: RequestOptions) {
    super(url, options, "URL redirected over limit");
  }
}

export class TimeoutError extends RobertError {
  time: number;

  constructor(url: string, options: RequestOptions, time: number) {
    super(url, options, "Request timed out after " + time + "ms");
    this.time = time;
  }
}

export class ParseError extends RobertError {
  format: Formats;
  error: Error;

  constructor(url: string, options: RequestOptions, format: Formats, error: Error) {
    super(url, options, "Could not parse body: (" + format + ") " + error.message);
    this.format = format;
    this.error = error;
  }
}

export class ResponseError extends RobertError {
  code: number;
  text: string;
  body?: any;

  constructor(url: string, options: RequestOptions, code: number, text: string, body: any) {
    super(url, options, "URL responded with status " + code + ": " + text);
    this.code = code;
    this.text = text;
    if (body) this.body = body;
  }
}