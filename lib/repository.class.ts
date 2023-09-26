import { Pool, PoolConfig, QueryResult } from "pg";
import { Logger } from "./logger.const";

export interface IRepository {
  query: (statement: string, args: any[]) => Promise<QueryResult>;
}

export class _PgRepository implements IRepository {
  private logger = Logger.child({ service: "Postgres" });
  private readonly pool: Pool;
  constructor(config: PoolConfig) {
    this.pool = new Pool(config);
  }

  async query(statement: string, args: any[]) {
    let result;
    const profiler = Logger.startTimer();
    try {
      this.logger.info("Executing query", {
        query: statement,
        args: args,
      });
      result = this.pool.query(statement, args);
      return result;
    } catch (e) {
      this.logger.error((e as Error).message);
      throw e;
    } finally {
      profiler.done({ message: "Completed" });
    }
  }

  /**
   * Used to manually shutdown the pool.
   * 
   * Note: there are no protections against calling `_PgRepository.query()`
   * after the pool has disconnected, and an error will be raised.
   */
  async _close() {
    this.logger.info("Closing connection...");
    await this.pool.end();
  }
}
