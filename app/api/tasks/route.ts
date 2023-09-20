import { handleRoute } from "@/lib/handle-route.function";
import { HttpUnexpectedError } from "@/lib/http/error.class";
import { TaskController } from "@/lib/models/task.class";
import { NextResponse } from "next/server";

export const GET = handleRoute("GET /tasks", async (_req) => {
  const result = await TaskController.findAll();
  return result ? NextResponse.json(result) : new HttpUnexpectedError();
});
