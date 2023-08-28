# Database

[graphile-migrate](https://github.com/graphile/migrate) is used for database migrations.

Contains migrations and seeds for the database.

Supposed to be run as docker container and removed after migration.

Almost all the logic is implemented in postgres functions and triggers.

Application is using [postgraphile](https://www.graphile.org/postgraphile/) to expose postgres functions as graphql api.

## Database structure

Application contains 3 schemas:
- app_public - contains all the public data that should be exposed to the client
- app_hidden - contains all the data that should not be exposed to the client
- app_private - contains all the sensitive data and functions

For access control, [row level security](https://www.postgresql.org/docs/9.5/ddl-rowsecurity.html) is used.

there are 4 roles:
- app_anonymous - default role for postgraphile
- app_user - role for authenticated users
- app_admin - role for admin users
- app_postgraphile - role for postgraphile api, database owner (not superuser)

Authentication is implemented with JWT tokens, set by postgraphile as `jwt.claims.` variable.