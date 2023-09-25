import { PgRepository } from "@/lib/postgres.const";
import { _TaskController } from "./task.class";

export const TaskController = new _TaskController(PgRepository);
