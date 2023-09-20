import { ZodError } from "zod";
import { HttpBadRequestError, HttpUnexpectedError } from "./http/error.class";
import { Logger } from "./logger.const";

type RouteArgs = {
  params: { [key: string]: string };
};

/** See: https://nextjs.org/docs/app/building-your-application/routing/route-handlers */
type RouteHandler = (
  request: Request,
  args: RouteArgs
) => Response | Promise<Response>;

/**
 * Wraps a Next Rotue Handler with logging
 * If a ZodError occurs, it returns HTTP 400 with the Zod message.
 * Returns HTTP 500 if an error is thrown from the handler.
 */
export function handleRoute(
  logName: string,
  handler: (
    request: Request | undefined,
    args: RouteArgs
  ) => Response | Promise<Response>
): RouteHandler {
  return async (request: Request, args) => {
    let body;
    try {
      if (request.body) {
        body = await request.json();
      }
      Logger.info(`${logName}`, { body, params: args.params });
      const profiler = Logger.startTimer();
      const result = await handler(request, args);
      profiler.done({ message: "Completed" });
      return result;
    } catch (e) {
      Logger.error((e as Error).message);
      if (e instanceof ZodError) {
        /** Concatenate the ZodErrors into one string */
        return new HttpBadRequestError(
          (e as ZodError).issues.map((v) => v.message).join(". ")
        );
      }
      return new HttpUnexpectedError();
    }
  };
}
