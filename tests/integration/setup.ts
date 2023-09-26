import { DATABASE_NAME, SetupPostgres } from "./setup-utils";

/**
 * Create a clean database to run integration tests against
 */
async function setup() {
  await SetupPostgres.query(`DROP DATABASE IF EXISTS ${DATABASE_NAME}`, []);
  await SetupPostgres.query(`CREATE DATABASE ${DATABASE_NAME}`, []);
}
export default setup;
