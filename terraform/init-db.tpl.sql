DO
$$
  BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'app_postgraphile') THEN
      CREATE ROLE app_postgraphile WITH LOGIN PASSWORD '${db_app_password}';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'app_user') THEN
      CREATE ROLE app_user;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'app_admin') THEN
      CREATE ROLE app_admin;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'app_anonymous') THEN
      CREATE ROLE app_anonymous;
    END IF;
  END
$$;

-- Grant privileges to the roles
GRANT app_anonymous TO app_user;
GRANT app_user TO app_admin;
GRANT app_admin TO app_postgraphile;