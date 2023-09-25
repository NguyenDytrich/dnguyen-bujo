import { _PgRepository } from "./repository.class";

export const PgRepository = new _PgRepository({
  host: process.env.POSTGRES_HOST,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
});
