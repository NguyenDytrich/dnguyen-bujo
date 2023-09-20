export const UnexpectedError = new Response("An unexpected error occurred", {
  status: 500,
});

interface ErrorBody {
  message: string;
}

/** Wrap the native Response to ensure error responses are consistently formatted. */
export class HttpErrorBase<T extends ErrorBody = ErrorBody> extends Response {
  constructor({ status, body }: { status: number; body: T }) {
    super(JSON.stringify(body), { status });
  }
}

/**
 * Wrapper around native Reponse that returns status 500 with the body `{"message": "An unexpected error occurred."}`
 */
export class HttpUnexpectedError extends HttpErrorBase {
  static status: 500;
  constructor() {
    super({
      status: HttpUnexpectedError.status,
      body: { message: "An unexpected error occurred." },
    });
  }
}

export class HttpNotFoundError extends HttpErrorBase {
  static status: 404;
  /**
   * @param message Message to display. Defaults to `"Not found."`
   */
  constructor(message?: string) {
    super({
      status: HttpNotFoundError.status,
      body: { message: message ?? "Not found." },
    });
  }
}

export class HttpBadRequestError extends HttpErrorBase {
  static status: 400;
  constructor(message?: string) {
    super({
      status: HttpBadRequestError.status,
      body: { message: message ?? "Bad request." },
    });
  }
}
