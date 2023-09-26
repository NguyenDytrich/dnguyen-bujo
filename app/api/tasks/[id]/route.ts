import { handleRoute } from "@/lib/handle-route.function";
import { HttpNotFoundError } from "@/lib/http/error.class";
import { IntegerUrlParam } from "@/lib/http/util.function";
import { TaskController } from "@/lib/models/task/task.const";
import { NextResponse } from "next/server";

export const GET = handleRoute("GET /tasks/[id]", async (_req, { params }) => {
  const parsedId = IntegerUrlParam.parse(params.id);
  const result = await TaskController.findById(parsedId);
  return result
    ? NextResponse.json(result)
    : new HttpNotFoundError(`No task found for id: ${parsedId}`);
});
