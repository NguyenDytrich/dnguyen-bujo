import { DATABASE_NAME, SetupPostgres } from "./setup-utils";

async function teardown() {
  await SetupPostgres.query(`DROP DATABASE IF EXISTS ${DATABASE_NAME}`, []);
  await SetupPostgres._close();
}

export default teardown;
