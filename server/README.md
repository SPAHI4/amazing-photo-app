# Server

Main api server for the project.

## Stack
- nodejs >= 20.5.
- [fastify](https://www.fastify.io/) - web server for nodejs focused on performance with great typescript support.
- [postgraphile](https://www.graphile.org/postgraphile/) - graphql api server for postgres.

other libraries worth mentioning:
- @aws-sdk/* - aws sdk for nodejs
- google-auth-library - google oauth2 client
- @sentry/node - error tracking
- [sitemap](https://github.com/ekalinin/sitemap.js) - highload optimized sitemap generator

Main logic is implemented in postgres functions and triggers, postgraphile just exposes them as graphql api.

