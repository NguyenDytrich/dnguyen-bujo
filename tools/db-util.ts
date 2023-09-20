import { Command } from "commander";
import * as fs from "fs";
import { Client } from "pg";
import dotenv from "dotenv";

dotenv.config();

async function applyMigration(client: Client, path: string) {
  const exists = fs.existsSync(`${path}/migration.sql`);
  if (!exists)
    throw new Error(`No migration file found: ${path}/migration.sql`);

  const file = fs.readFileSync(`${path}/migration.sql`).toString();
  await client.query(file);
  console.log(`Successfully applied migration ${path}`);
}

async function applyRollback(client: Client, path: string) {
  const exists = fs.existsSync(`${path}/rollback.sql`);
  if (!exists) throw new Error(`No migration file found: ${path}/rollback.sql`);

  const file = fs.readFileSync(`${path}/rollback.sql`).toString();
  await client.query(file);
  console.log(`Successfully rolled back migration ${path}`);
}

async function getClient() {
  console.log("Initializing Postgres client");
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
  });
  await client.connect();
  return client;
}

function getMigrationDirectories() {
  const directories = fs
    .readdirSync("db/migrations", { withFileTypes: true })
    .filter((d) => d.isDirectory());

  // Validate the migration directory
  directories.forEach((dir) => {
    if (!/^\d+_[A-Za-z\d-]+$/.test(dir.name)) {
      throw new Error(
        `Malformed migration directory: db/migrations/${dir.name}! Directory name should start with a numeric value!`
      );
    }
  });

  return directories;
}

/** Initializes a client, runs the action function, then closes the connection. */
async function run(action: (client: Client) => void | Promise<void>) {
  const client = await getClient();
  try {
    await action(client);
    client.end();
  } catch (e) {
    // Close the connection before throw
    client.end();
    throw e;
  }
}

const program = new Command();

program
  .command("list")
  .description("List all migrations in db/**")
  .action(() => {
    const directories = fs
      .readdirSync("db/migrations", { withFileTypes: true })
      .filter((D) => D.isDirectory())
      .map((d) => `${d.name}`)
      .sort((a, b) => parseInt(a.split("_")[0]) - parseInt(b.split("_")[0]));
    console.log("Migrations:");
    directories.forEach((d) => console.log(`  - ${d}`));
  });

program
  .command("ping")
  .description("Test the configured Postgres connection")
  .action(async () => {
    await getClient();
    return;
  });

program
  .command("initialize")
  .description("Run all migrations in sequence (db/**/migration.sql)")
  .action(async () => {
    const migrationDirectories = fs
      .readdirSync("db/migrations", { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => `${d.name}`)
      .sort((a, b) => parseInt(a.split("_")[0]) - parseInt(b.split("_")[0]));

    await run(async (client) => {
      for (const migration of migrationDirectories) {
        await applyMigration(client, `db/migrations/${migration}`);
      }
    });
  });

program
  .command("new-migration <name>")
  .description("Create an empty migration")
  .action(async (name: string) => {
    const isValidName = /^[A-Za-z-\d]+$/.test(name);
    if (!isValidName) {
      console.error(
        `Migration name ${name} is invalid. Name must only contain alphanumeric characters and '-'`
      );
      return;
    }
    const migrations = fs
      .readdirSync("db/migrations", { withFileTypes: true })
      .filter((d) => d.isDirectory());
    const dirname = `${migrations.length}_${name}`;
    console.log(`Creating 'db/migrations/${dirname}/migration.sql...`);
    fs.mkdirSync(`db/migrations/${dirname}`);
    fs.writeFileSync(
      `db/migrations/${dirname}/migration.sql`,
      "BEGIN;\n\n\nCOMMIT;"
    );
  });

program
  .command("migrate")
  .description(
    "Run a specified migration from `db/`. If no migration is specified, runs the lastest one."
  )
  .argument("[migration]", "migration name to run")
  .action(async (migration: string) => {
    const migrations = getMigrationDirectories();

    const dir = await (async () => {
      if (migration) {
        const matches = migrations.filter(
          // Remove the number prefix
          (d) => d.name.split("_").slice(1).join("_") === migration
        );
        if (matches.length > 1)
          throw new Error(`Name conflict found for migration: ${migration}`);
        const migrationDir = matches.pop();
        if (!migrationDir) throw new Error(`No migration found: ${migration}`);
        return migrationDir;
      } else {
        const sortedMigrations = [...migrations].sort(
          (a, b) =>
            parseInt(b.name.split("_")[0]) - parseInt(a.name.split("_")[0])
        );
        console.log(`Running latest migration: ${sortedMigrations[0].name}`);
        return sortedMigrations[0];
      }
    })();

    await run(async (client) => {
      await applyMigration(client, `db/migrations/${dir.name}`);
    });
  });

program
  .command("rollback")
  .description("Rollback the latest migration")
  .action(async () => {
    const migrations = getMigrationDirectories()
      .map((d) => `${d.name}`)
      .sort((a, b) => parseInt(b.split("_")[0]) - parseInt(a.split("_")[0]));

    console.log(`Rolling back migration: ${migrations[0]}`);
    await run(async (client) => {
      await applyRollback(client, `db/migrations/${migrations[0]}`);
    });
  });

program
  .command("seed")
  .description("Run a seed script as specified")
  .argument("<script>", "script to run, e.x. 'test/billing'")
  .action(async (script: string) => {
    const exists = fs.existsSync(`seeds/${script}.ts`);
    if (!exists) throw new Error(`No seed file found: seeds/${script}.ts`);

    // need the '..' because this script is actually running from the `tools` directory.
    const module = (await import(`../seeds/${script}`)).default;
    if (!module.seed)
      throw new Error(
        `Seed file seeds/${script}.ts does not export a \`seed\` method!`
      );

    await run(async (client) => {
      await module.seed(client);
    });
  });

program
  .command("deseed")
  .description("Runs the seed cleanup method specified")
  .argument("<script>", "script to run, e.x. 'test/billing'")
  .action(async (script: string) => {
    const exists = fs.existsSync(`seeds/${script}.ts`);
    if (!exists) throw new Error(`No seed file found: seeds/${script}.ts`);

    // need the '..' because this script is actually running from the `tools` directory.
    const module = (await import(`../seeds/${script}`)).default;
    if (!module.deseed)
      throw new Error(
        `Seed file seeds/${script}.ts does not export a \`cleanup\` method!`
      );
    await run(async (client) => {
      await module.deseed(client);
    });
  });

async function main() {
  await program.parseAsync(process.argv);
  return "Done.";
}
main().then(console.log).catch(console.error);
