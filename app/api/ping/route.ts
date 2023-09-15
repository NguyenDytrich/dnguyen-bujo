import { handleRoute } from "@/lib/handle-route.function";

export const GET = handleRoute("/ping", (req) => {
  return new Response("pong");
});
