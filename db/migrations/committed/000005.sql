--! Previous: sha1:9bff7de709da07c1f0a82f040a9bb149e4a783d4
--! Hash: sha1:06f60f7ee535e6d546471f7226643d7fb59a1e05

DO $$
DECLARE
  col record;
  target_columns text[] := ARRAY['google_locale', 'google_email', 'google_name'];  -- Add your target columns here
BEGIN
  FOR col IN 
    SELECT column_name
    FROM information_schema.columns
    WHERE table_schema = 'app_private'
      AND table_name = 'user_data'
      AND is_nullable = 'NO'
      AND column_name = ANY(target_columns)
  LOOP
    EXECUTE format('ALTER TABLE app_private.user_data ALTER COLUMN %I DROP NOT NULL', col.column_name);
    RAISE NOTICE 'Dropped NOT NULL constraint from column: %', col.column_name;
  END LOOP;
END $$;
