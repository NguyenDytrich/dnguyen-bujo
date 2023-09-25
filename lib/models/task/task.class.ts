import { DateTime } from "luxon";
import { IRepository } from "../../repository.class";

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
const SelectAll = `SELECT FROM tasks`;

/** Exported for unit testing */
export class _TaskController {
  constructor(private readonly repository: IRepository) {}
  /**
   * Inserts a new task into the database. If no `createdAt` time is specified, the current timestamp will be used.
   */
  async createOne(args: TaskCreateArgs): Promise<Task> {
    const result = await this.repository.query(CreateOneQuery, [
      args.text,
      args.notes,
      args.createdAt?.toUTC().toString(),
    ]);
    return result.rows[0];
  }

  async findById(id: number): Promise<Task> {
    const result = await this.repository.query(SelectById, [id]);
    return result.rows[0];
  }

  async findAll(): Promise<Task[]> {
    const result = await this.repository.query(SelectAll, []);
    return result.rows;
  }
}
