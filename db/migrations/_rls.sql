-- All RLS rules for all tables in app_public here
-- RLS related triggers for these tables are here as well

CREATE OR REPLACE FUNCTION drop_all_policies(table_name_in TEXT, schema_name_in TEXT)
  RETURNS void AS
$$
DECLARE
  policy record;
BEGIN
  FOR policy IN (SELECT policyname
                 FROM pg_policies
                 WHERE schemaname = schema_name_in
                   AND tablename = table_name_in)
    LOOP
      EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', policy.policyname, schema_name_in, table_name_in);
    END LOOP;
END
$$
  LANGUAGE plpgsql;


-- GRANT everything to app_postgraphile
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA app_private TO :ROLE_OWNER;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA app_private TO :ROLE_OWNER;

GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA app_public TO :ROLE_OWNER;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA app_public TO :ROLE_OWNER;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA app_public TO :ROLE_OWNER;

GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA app_hidden TO :ROLE_OWNER;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA app_hidden TO :ROLE_OWNER;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA app_hidden TO :ROLE_OWNER;

------------------------------
-- USERS
------------------------------

select drop_all_policies('users', 'app_public');

alter table app_public.users
  enable row level security;

-- admin
grant all on app_public.users to :ROLE_ADMIN;

create policy manage_all on app_public.users for
  all to :ROLE_ADMIN using (true);


-- anonymous

grant select on app_public.users to :ROLE_VIEWER;

create policy select_all on app_public.users for
  select
  to :ROLE_VIEWER using (is_archived = false);

------------------------------
-- END USERS
------------------------------


------------------------------
-- LOCATIONS - admin can do everything, anonymous can only select
------------------------------

select drop_all_policies('locations', 'app_public');

alter table app_public.locations
  enable row level security;

-- admin
grant all on app_public.locations to :ROLE_ADMIN;

create policy manage_all on app_public.locations for
  all to :ROLE_ADMIN using (true);

-- anonymous
grant select on app_public.locations to :ROLE_VIEWER;

create policy select_all on app_public.locations for
  select
  to :ROLE_VIEWER using (is_archived = false);

------------------------------
-- END LOCATIONS
------------------------------


------------------------------
-- PHOTOS - admin can do everything, anonymous can only select, user can insert
------------------------------

select drop_all_policies('photos', 'app_public');

alter table app_public.photos
  enable row level security;

-- admin
grant all on app_public.photos to :ROLE_ADMIN;

create policy manage_all on app_public.photos for
  all to :ROLE_ADMIN using (true);

-- anonymous
grant select on app_public.photos to :ROLE_VIEWER;

create policy select_all on app_public.photos for
  select
  to :ROLE_VIEWER using (is_archived = false);

-- user
grant insert on app_public.photos to :ROLE_USER;

create policy insert_user on app_public.photos for
  insert to :ROLE_USER with check (
  author_id = app_public.current_user_id()
  );

------------------------------
-- END PHOTOS
------------------------------


------------------------------
-- IMAGES - admin can do everything, anonymous can only select, user can insert and update
------------------------------

select drop_all_policies('images', 'app_public');

alter table app_public.images
  enable row level security;

-- admin
grant all on app_public.images to :ROLE_ADMIN;

create policy manage_all on app_public.images for
  all to :ROLE_ADMIN using (true);

-- anonymous
grant select on app_public.images to :ROLE_VIEWER;

create policy select_all on app_public.images for
  select
  to :ROLE_VIEWER using (true);

-- user
grant
  update (is_uploaded)
  on app_public.images to :ROLE_USER;

create policy manage_own on app_public.images for
  update
  to :ROLE_USER using (
  user_id = app_public.current_user_id()
  );

------------------------------
-- END IMAGES
------------------------------


------------------------------
-- COMMENTS - admin can do everything, anonymous can only select, user can insert and update (with soft delete)
------------------------------

select drop_all_policies('comments', 'app_public');

alter table app_public.comments
  enable row level security;

-- admin
grant all on app_public.comments to :ROLE_ADMIN;

create policy manage_all on app_public.comments for
  all to :ROLE_ADMIN using (true);


-- anonymous
grant select on app_public.comments to :ROLE_VIEWER;

create policy select_all on app_public.comments for
  select
  to :ROLE_VIEWER using (is_archived = false);

-- user
grant
  insert (photo_id, body),
  update (is_archived, body)
  on app_public.comments to :ROLE_USER;

create policy manage_own on app_public.comments for all
  to :ROLE_USER using (
  user_id = app_public.current_user_id()
  );

-- allow to archive comment or unarchive it 5 minutes after archiving
create or replace function app_private.update_comment_check()
  returns trigger
  language plpgsql
as
$$
begin
  if new.is_archived = true then
    if new.updated_at < now() - interval '5 minutes' then
      raise exception 'You can not archive comment after 5 minutes after creation';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists _500_update_comment_check on app_public.comments;
create trigger _500_update_comment_check
  before update
  on app_public.comments
  for each row
execute procedure app_private.update_comment_check();

------------------------------
-- END COMMENTS
------------------------------


------------------------------
-- PHOTOS_LIKES - admin can do everything, anonymous can only select, user can insert and update
------------------------------

select drop_all_policies('photos_likes', 'app_public');

alter table app_public.photos_likes
  enable row level security;

-- admin
grant all on app_public.photos_likes to :ROLE_ADMIN;

create policy manage_all on app_public.photos_likes for
  all to :ROLE_ADMIN using (true);


-- anonymous
grant select on app_public.photos_likes to :ROLE_VIEWER;

create policy select_all on app_public.photos_likes for
  select
  to :ROLE_VIEWER using (true);

-- user
grant
  insert (photo_id, count),
  update (count)
  on app_public.photos_likes to :ROLE_USER;

create policy manage_own on app_public.photos_likes for all
  to :ROLE_USER using (
  user_id = app_public.current_user_id()
  );

------------------------------
-- END PHOTOS_LIKES
------------------------------
