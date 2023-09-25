import { IRepository } from "@/lib/repository.class";
import { QueryResult } from "pg";
import { Database } from "sqlite3";

class _SqliteRepository implements IRepository {
  private readonly db: Database;
  constructor() {
    this.db = new Database(":memory:");
  }
  async query(statement: string, args: any[]) {
    return new Promise<QueryResult>((resolve) =>
      this.db.all(statement.replace(/\$\d+/, "?"), args, (err, rows) => {
        resolve({
          rows,
        } as QueryResult);
      })
    );
  }
}

const SqliteRepository = new _SqliteRepository();

const run = async () => {
  await SqliteRepository.query(
    "CREATE TABLE test (id INTEGER PRIMARY KEY, name TEXT)",
    []
  );
  await SqliteRepository.query("INSERT INTO test VALUES ($1, $2)", [0, "Test"]);
  const result = await SqliteRepository.query("SELECT * FROM test", []);
  return result;
};

run().then(console.log).catch();
