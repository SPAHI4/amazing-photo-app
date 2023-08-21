BEGIN;


CREATE ROLE app_postgraphile WITH LOGIN PASSWORD '${db_app_password}';

CREATE ROLE app_user;

CREATE ROLE app_admin;

CREATE ROLE app_anonymous;

GRANT app_anonymous TO app_user;
GRANT app_user TO app_admin;
GRANT app_admin TO app_postgraphile;


GRANT CONNECT ON DATABASE "${db_app_name}" TO app_postgraphile;
GRANT CONNECT ON DATABASE "${db_app_name}" TO app_anonymous;
GRANT ALL ON DATABASE "${db_app_name}" TO app_postgraphile;

ALTER SCHEMA public OWNER TO app_postgraphile;

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS postgis_topology;
CREATE EXTENSION IF NOT EXISTS fuzzystrmatch;
CREATE EXTENSION IF NOT EXISTS postgis_tiger_geocoder;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;

COMMIT;