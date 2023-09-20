import { DateTime } from "luxon";
import { Postgres, Repository } from "../postgres.const";

/** Types */
export interface Task {
  id: string /** PG type: UUID */;
  text: string /** PG type: varchar(255) */;
  notes?: string /** PG type: text */;
  createdAt?: DateTime /** PG type: Timestamp */;
}
export interface TaskCreateArgs extends Omit<Task, "id"> {}

/** Queries */
const CreateOneQuery = `INSERT INTO tasks("text", notes, createdAt) VALUES ($1, $2, $3)`;
const SelectById = `SELECT FROM tasks WHERE id=$1`;

export const TaskController = {
  /**
   * Inserts a new task into the database. If no `createdAt` time is specified, the current timestamp will be used.
   */
  createOne: async (args: TaskCreateArgs): Promise<Task> => {
    const result = await Postgres.query(CreateOneQuery, [
      args.text,
      args.notes,
      args.createdAt,
    ]);
    return result.rows[0];
  },
  findById: async (id: number): Promise<Task> => {
    const result = await Repository.query(SelectById, [id]);
    return result.rows[0];
  },
};
