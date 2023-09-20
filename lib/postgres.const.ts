import { Pool } from "pg";
import { Logger } from "./logger.const";

export const Postgres = new Pool({
  host: process.env.POSTGRES_HOST,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
});

const PgLogger = Logger.child({ service: "Postgres" });

export const Repository = {
  query: async (statement: string, args: any[]) => {
    let result;
    const profiler = Logger.startTimer();
    try {
      PgLogger.info("Executing query", {
        query: statement,
        args: args,
      });
      result = Postgres.query(statement, args);
      return result;
    } catch (e) {
      PgLogger.error((e as Error).message);
      throw e;
    } finally {
      profiler.done({ message: "Completed" });
    }
  },
};
