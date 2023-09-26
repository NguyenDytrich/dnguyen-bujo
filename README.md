## Setting Up Docker for Local Development
By default, the `compose.yml` file spins up a Postgres image with the required `POSTGRES_PASSWORD` environment variable
set in your `.env`.

## Running Tests
Unit tests: `npm run test:unit`

### Integration tests
Make sure that you have your Docker compose up. Alternatively, you can configure the tests to point at an alternate database.

The global setup for integration tests will read from `.env` by default. It expects the following:

```bash
# If you configured a different POSTGRES_USER for your Docker container set it here
POSTGRES_USER=postgres
POSTGRES_PASSWORD=<your-pass>
POSTGRES_HOST=localhost
```

**Caveats**: The setup script will create a new database called `integration_tests` that all tests will run against. It will then destroy this database on completion.

---

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, start your Docker compose (if you haven't already):
```bash
docker compose up
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Resources

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.