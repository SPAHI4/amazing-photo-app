
# Photos gallery app


In a nutshell, this is a simple app that allows you to upload photos and view them in a gallery.

It's a monorepo with the following structure:

- client - React app with react-router, apollo-client, material-ui
- server - Node.js app with [fastify](https://www.fastify.io/) and [postgraphile](https://www.graphile.org/postgraphile/)
- worker - Node.js app with [graphile-worker](https://github.com/graphile/worker), ffmpeg, nodemailer
- db - [graphile-migrate](https://github.com/graphile/migrate) migrations and seeds
- config - common environment variables loader and public .env files
- terraform - Terraform configuration for AWS infrastructure
