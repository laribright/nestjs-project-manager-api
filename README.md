# NestJS Project Manager API

Companion repo for the **NestJS Complete Course** — a project-manager API built with NestJS, Drizzle ORM, PostgreSQL, JWT auth, BullMQ, scheduling, and WebSockets.

## Course on Udemy

- **[Purchase with love](https://www.udemy.com/course/nestjs-complete-course/?couponCode=CODEWITHLARI)** — 50% off
- Or the [full course here](https://www.udemy.com/course/nestjs-complete-course/?referralCode=2164FFED884D2E1A4CE3)

## Prerequisites

- Node.js 22+
- PostgreSQL
- Redis (Upstash or any Redis instance — used by BullMQ)

## Branches

Each section of the course has its own branch. Start from the section you are on:

| Branch | Section |
| --- | --- |
| `section-02-core-building-blocks` | Core building blocks |
| `section-03-request-lifecycle` | Request lifecycle |
| `section-04-application-lifecycle` | Application lifecycle |
| `section-05-configuration-architecture` | Configuration |
| `section-06-postgresql-drizzle` | PostgreSQL + Drizzle |
| `section-07-rest-api-design` | REST API design |
| `section-08-authentication-authorization` | Auth |
| `section-09-main-application` | Main application |
| `section-10-events-queues-scheduling` | Events, queues, scheduling |
| `section-11-websockets-realtime` | WebSockets |
| `section-12-testing-docker-deployment` | Testing + Docker |
| `section-13-angular-cors` | Angular CORS |
| `main` | Full completed app |

```bash
git checkout section-06-postgresql-drizzle
```

## 1. Install

```bash
npm install
```

## 2. Environment variables

Copy the example file and fill in your values:

```bash
cp .env.example .env
```

| Variable | Required | Description |
| --- | --- | --- |
| `PORT` | no | App port (default `3000`) |
| `APP_NAME` | no | Display name in logs |
| `TASK_DEFAULT_STATUS` | no | `todo` or `done` |
| `MAIL_FROM` | yes | Valid email used by the mailer |
| `DATABASE_URL` | yes | PostgreSQL connection URL |
| `JWT_ACCESS_SECRET` | yes | Secret for access tokens (**min 64 chars**) |
| `UPSTASH_REDIS_HOST` | yes | Redis host |
| `UPSTASH_REDIS_PORT` | no | Redis port (default `6379`) |
| `UPSTASH_REDIS_PASSWORD` | yes | Redis password |

Example `DATABASE_URL`:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/project_manager
```

The app validates these on boot via Zod (`src/config/validate-env.ts`). If something is missing or invalid, it fails fast with a clear error.

## 3. Database migrations

Migrations live in `drizzle/` and are managed with Drizzle Kit.

```bash
# Apply existing migrations to your database
npm run db:migrate

# After changing src/database/schema.ts — generate a new migration
npm run db:generate

# Optional: open Drizzle Studio
npm run db:studio
```

**Order that matters:** set `DATABASE_URL` in `.env` → run `db:migrate` → then start the app.

## 4. Seed (optional)

```bash
npm run db:seed
```

Inserts a couple of sample tasks.

## 5. Run the API

```bash
# watch mode (recommended while learning)
npm run start:dev

# one-shot
npm run start

# production build + run
npm run build
npm run start:prod
```

Once running:

- API: `http://localhost:3000`
- Swagger docs: `http://localhost:3000/docs`

## Tests

```bash
npm run test        # unit
npm run test:e2e    # e2e
npm run test:cov    # coverage
```

## Docker

```bash
docker build -t project-manager-api .
docker run --env-file .env -p 3000:3000 project-manager-api
```

Make sure Postgres and Redis are reachable from the container (use hostnames your container can resolve — not `localhost` unless you network them correctly).

## License

MIT
