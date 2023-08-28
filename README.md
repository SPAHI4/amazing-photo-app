
# Photos gallery app by Anton Suslov

In a nutshell, this is a simple app that allows you to upload photos and view them in a gallery.

### Features
- Focused on fancy UI and animations as it's a portfolio project
- Photos upload (resize, compress, convert, focused primarily on **HDR** images)
- Photos gallery by location
- Photo details page with HQ image, exif data, likes and comments
- Admin panel with basic CRUD operations
- Email notifications on new comments and likes
- Authentication with Google

#### Pros:
- Production ready infrastructure with AWS and Cloudflare
- Production ready graphql API with Postgraphile
- Production ready security with JWT
- CI/CD with Github Actions; linting

#### Not there:
SSR, tests (TBD), wide browser support (TBD)

It's a `pnpm` monorepo with the following structure:

workspaces:
- [client](./client) - React app with vite, react-router, apollo, material-ui
- [server](./server) - Node.js app with [fastify](https://www.fastify.io/) and [postgraphile](https://www.graphile.org/postgraphile/)
- [worker](./worker) - Node.js app with [graphile-worker](https://github.com/graphile/worker), ffmpeg, nodemailer
- [db](./db) - [graphile-migrate](https://github.com/graphile/migrate) migrations and seeds
- [config](./config) - common environment variables loader and public .env files

Workspaces feature is one of the main selling points of `pnpm` as it's really fast and allows to share dependencies between packages.

infrastructure:
- [terraform](./terraform) - Terraform configuration for AWS and Cloudflare


To speed up `tsc` compilation, every package has its own tsconfig.json with `composite` option enabled, and root tsconfig.json has `references` to all packages.

Dependencies between packages are resolved with `pnpm` `workspace:*` protocol and nodejs `--conditions` [flag](https://nodejs.org/api/cli.html#-c-condition---conditionscondition) to distinguish between `dev` and `prod` environments.

## How to run

### Prerequisites for local development
- nodejs >= 20.5.0 (server is running locally instead of docker-compose to speed up development)
- docker
- ffmpeg (if worker is running locally instead of docker-compose)

```bash
corepack enable; # enable pnpm

pnpm install; # install dependencies, setup git hooks

docker-compose up -d; # start postgres

pnpm run gm:migrate --filter db; # run migrations

pnpm run dev; # start server, client and worker in watch mode, stream logs from all services
```

## Linting

Industrially proven eslint and prettier are used for linting and formatting, nothing special here.

Lint-staged is used to run linters and formatters on husky hook for typescript, json, sql, terraform and other files.

## Authorization and authentication

Simple diagram of google oauth flow:
![auth-diagram-1.svg](.github%2Fassets%2Fauth-diagram-1.svg)

JWT flow:
![auth-diagram-2.svg](.github%2Fassets%2Fauth-diagram-2.svg)

More details in [server/README.md](./server/README.md) and [client/README.md](./client/README.md)

## Testing

**TBD**