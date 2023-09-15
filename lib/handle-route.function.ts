import { Logger } from "./logger.const";

/** Wraps a Next Rotue Handler with logging */
export function handleRoute(
  logName: string,
  handler: (request?: Request) => Response | Promise<Response>
): (request: Request) => Promise<Response> {
  return async (request: Request) => {
    let body;
    try {
      body = await request.json();
    } catch {}
    Logger.info(`${logName}`, { body });
    const profiler = Logger.startTimer();
    const result = await handler(request);
    profiler.done({ message: "Completed" });
    return result;
  };
}
