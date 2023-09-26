/**
 * ONLY USED IN SETUP AND TEARDOWN!
 *
 * This replicates a PgRepository instance configured
 * from the `.env` file, but `dotenv.config()` for some reason
 * does not work in the setup scripts.
 */
import { _PgRepository } from "../../lib/repository.class";
import * as fs from "node:fs";

const envVars = fs.readFileSync("./.env").toString();

/**
 * A very hacky way to get the configured dotenv variables into
 * this script because `dotenv.config()` for some reason isn't working.
 */
function extract(variableName: string): string | undefined {
  const regex = new RegExp(`(?<=${variableName}\=).+`);
  const matchResult = regex.exec(envVars);
  if (!matchResult) {
    return undefined;
  }
  const variableDef = matchResult[0]; // Matched string
  // Check if the variable assigned is wrapped in quotes
  const quoted =
    /(?<=[']).+(?=['])/.test(variableDef) ||
    /(?<=["]).+(?=["])/.test(variableDef);

  // Return the value, excluding any quotations
  return quoted ? variableDef.slice(1, -1) : variableDef;
}

const config = {
  password: extract("POSTGRES_PASSWORD"),
  user: extract("POSTGRES_USER"),
  host: extract("POSTGRES_HOST"),
  port: parseInt(extract("POSTGRES_PORT") ?? "5432"),
};

export const DATABASE_NAME = "integration_test";
export const SetupPostgres = new _PgRepository(config);
