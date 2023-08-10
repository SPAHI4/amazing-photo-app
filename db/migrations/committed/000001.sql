--! Previous: -
--! Hash: sha1:a8fa8348bc31422b141c9f5bfcd6ac6ec9fbae27

-- common

drop schema if exists app_public cascade;
drop schema if exists app_hidden cascade;
drop schema if exists app_private cascade;

revoke all on schema public from public;

alter default privileges revoke all on sequences from public;
alter default privileges revoke all on functions from public;

create schema app_public;
create schema app_hidden;
create schema app_private;

grant all on schema app_private to :ROLE_OWNER;
grant all on schema app_hidden to :ROLE_OWNER;
grant all on schema app_public to :ROLE_OWNER;

grant usage on schema public, app_public, app_hidden to :ROLE_VIEWER;

alter default privileges in schema public, app_public, app_hidden
  grant usage, select on sequences to :ROLE_VIEWER;

alter default privileges in schema public, app_public, app_hidden
  grant execute on functions to :ROLE_VIEWER;


create function app_private.set_updated_at() returns trigger as
$$
begin
  new.updated_at := current_timestamp;
  return new;
end;
$$ language plpgsql security definer;

-- users

create type app_public.jwt_token as
(
  exp     bigint,
  user_id int4,
  role    text
);

create type app_public.role as enum ('app_user', 'app_admin');

create table app_public.users
(
  id           serial
    primary key,
  display_name varchar                                                      not null,
  picture_url  varchar
    constraint users_picture_url_check
      check ((picture_url)::text ~ '^https://.*'::text),
  created_at   timestamp with time zone default now()                       not null,
  updated_at   timestamp with time zone default now()                       not null,
  role         app_public.role          default 'app_user'::app_public.role not null,
  is_archived  boolean                  default false                       not null,
  archived_at  timestamp with time zone
);

create index users_is_archived_idx
  on app_public.users (is_archived)
  where (is_archived = false);

create trigger _100_users_set_updated_at
  before update
  on app_public.users
  for each row
execute procedure app_private.set_updated_at();


create table app_private.user_data
(
  id                    serial
    primary key,
  user_id               integer                                not null
    references app_public.users
      on delete cascade,
  created_at            timestamp with time zone default now() not null,
  updated_at            timestamp with time zone default now() not null,
  google_email          varchar(255)                           not null,
  google_id             varchar(255)                           not null,
  google_refresh_token  text                                   not null,
  google_picture_url    varchar(255)                           not null,
  google_name           varchar(255)                           not null,
  google_given_name     varchar(255)                           not null,
  google_family_name    varchar(255)                           not null,
  google_locale         varchar(10)                            not null,
  google_verified_email boolean                  default false not null,
  notified_at           timestamp with time zone,
  is_unsubscribed       boolean                  default false not null
);

create unique index user_data_google_id_uindex
  on app_private.user_data (google_id);

create unique index user_data_google_email_uindex
  on app_private.user_data (google_email);

create unique index user_data_user_id_uindex
  on app_private.user_data (user_id);

create index user_data_user_id_idx on app_private.user_data (user_id);

create trigger _100_user_data_set_updated_at
  before update
  on app_private.user_data
  for each row
execute procedure app_private.set_updated_at();

create table app_hidden.user_data (
                                    id                    serial
                                      primary key,
                                    user_id               integer                                not null
                                      references app_public.users
                                        on delete cascade,
                                    created_at            timestamp with time zone default now() not null,
                                    updated_at            timestamp with time zone default now() not null,
                                    email                 varchar(255)                         check ( (email)::text ~ '^.+@.+\..+$'::text ) not null
);

create unique index user_data_email_uindex
  on app_hidden.user_data (email);

create unique index user_data_user_id_uindex
  on app_hidden.user_data (user_id);

create trigger _100_user_data_set_updated_at
  before update
  on app_hidden.user_data
  for each row
execute procedure app_private.set_updated_at();


create or replace function app_private.access_token() returns app_public.jwt_token as
$$
declare
  user_id int4;
  user_role app_public.role;
begin
  select id, role
  into user_id, user_role
  from app_public.users
  where id = nullif(current_setting('jwt.claims.user_id', true), '')::integer;

  if user_id is null then
    return null;
  else
    return (extract(epoch from now() + interval '15 minutes'), user_id, user_role)::app_public.jwt_token;
  end if;

end;
$$ language plpgsql strict
                    security definer;


create or replace function app_public.current_user() returns app_public.users as
$$
select *
from app_public.users
where id = nullif(current_setting('jwt.claims.user_id', true), '')::integer
$$
  language sql
  stable;

create function current_user_id() returns integer
  stable
  language sql
as
$$
select nullif(current_setting('jwt.claims.user_id', true), '')::integer
$$;

create function app_private.upsert_user(google_id character varying, google_email character varying,
                                        google_refresh_token character varying, google_picture_url character varying,
                                        google_name character varying, google_given_name character varying,
                                        google_family_name character varying, google_locale character varying,
                                        google_verified_email boolean) returns app_public.users
  strict
  security definer
  language plpgsql
as
$$
declare
  "user" app_public.users;
  data   app_private.user_data;
begin
  select *
  into data
  from app_private.user_data
  where app_private.user_data.google_id = $1;

  if data is null then
    insert into app_public.users (created_at, updated_at, picture_url, display_name)
    values (now(), now(), $4, $5)
    returning * into "user";

    insert into app_private.user_data (user_id, google_id, google_email, google_refresh_token, google_picture_url,
                                       google_name, google_given_name, google_family_name, google_locale,
                                       google_verified_email)
    values ("user".id, $1, $2, $3, $4, $5, $6, $7, $8, $9);

    insert into app_hidden.user_data (user_id, email)
    values ("user".id, $2);
  else
    update app_public.users
    set updated_at   = now(),
        picture_url  = $4,
        display_name = $5
    where app_public.users.id = data.user_id
    returning * into "user";

    update app_private.user_data
    set google_email          = $2,
        google_refresh_token  = $3,
        google_picture_url    = $4,
        google_name           = $5,
        google_given_name     = $6,
        google_family_name    = $7,
        google_locale         = $8,
        google_verified_email = $9
    where app_private.user_data.user_id = data.user_id;

    update app_hidden.user_data
    set email = $2
    where app_hidden.user_data.user_id = data.user_id;
  end if;

  return user;
end;
$$;


-- locations

create table app_public.locations
(
  id          serial
    primary key,
  name        varchar                                                               not null,
  updated_at  timestamp default now()                                               not null,
  created_at  timestamp default now()                                               not null,
  geo         point     default point((0)::double precision, (0)::double precision) not null,
  slug        varchar   default ''                                                  not null,
  description text,
  is_archived boolean   default false                                               not null,
  archived_at timestamp with time zone
);

create index locations_geo_idx
  on app_public.locations using gist (geo);

create index unique_slug
  on app_public.locations (lower(slug::text));

create index locations_is_archived_idx
  on app_public.locations (is_archived)
  where (is_archived = false);

create trigger _100_locations_set_updated_at
  before update
  on app_public.locations
  for each row
execute procedure app_private.set_updated_at();


create function app_public.locations_by_distance(lat double precision, lng double precision) returns SETOF app_public.locations
  stable
  language sql
as
$$
select *
from app_public.locations
order by st_setsrid(st_makepoint(lat, lng), 4326) <-> st_setsrid(st_makepoint(
                                                                     app_public.locations.geo[0],
                                                                     app_public.locations.geo[1]
                                                                   ), 4326)
    asc
$$;

grant execute on function app_public.locations_by_distance(double precision, double precision) to :ROLE_VIEWER;


-- images

create type app_public.image_source as
(
  s3_key text,
  size   integer,
  type   varchar
);

create table app_public.images
(
  id          serial
    primary key,
  created_at  timestamp with time zone  default now()                               not null,
  updated_at  timestamp with time zone  default now()                               not null,
  user_id     integer                   default app_public.current_user_id()        not null
    references app_public.users
      on delete set null,
  s3_bucket   varchar                                                               not null,
  s3_key      text                                                                  not null,
  is_hdr      boolean                   default false                               not null,
  is_uploaded boolean                   default false                               not null,
  exif_data   jsonb,
  sources     app_public.image_source[] default ARRAY []::app_public.image_source[] not null
);

create index images_user_id_idx
  on app_public.images (user_id);

create trigger _100_images_updated_at
  before update
  on app_public.images
  for each row
execute procedure app_private.set_updated_at();

create function app_private.complete_image_upload() returns trigger as
$$
begin
  perform graphile_worker.add_job(
      identifier := 'convert_image',
      payload := json_build_object('image_id', new.id),
      queue_name := 'image_conversion',
      max_attempts => 4
    );
  return new; -- New line added
end;
$$ language plpgsql security definer;

create trigger _500_complete_image_upload
  after update
  on app_public.images
  for each row
  when (old.is_uploaded = false and new.is_uploaded = true)
execute procedure app_private.complete_image_upload();


-- photos

create table app_public.photos
(
  id            serial
    primary key,
  author_id     integer                  default app_public.current_user_id()
    references app_public.users
      on delete cascade,
  url           varchar                                not null,
  thumbnail     bytea,
  location_id   integer                                not null
    constraint photos_location_fkey
      references app_public.locations
      on delete set null,
  width         smallint                               not null,
  height        smallint                               not null,
  lat           double precision,
  lng           double precision,
  camera        varchar,
  lens          varchar,
  focal_length  varchar,
  iso           smallint,
  shutter_speed double precision,
  aperture      varchar,
  created_at    timestamp with time zone default now() not null,
  updated_at    timestamp with time zone default now() not null,
  shot_at       timestamp with time zone,
  blurhash      text,
  image_id      integer
                                                       references app_public.images
                                                         on delete set null,
  likes_count   integer                  default 0     not null,
  is_archived   boolean                  default false not null,
  archived_at   timestamp with time zone
);

create trigger _100_photos_updated_at
  before update
  on app_public.photos
  for each row
execute procedure app_private.set_updated_at();

comment on column app_public.photos.author_id is '@omit create,update
 @hasDefault';

create index photos_is_archived_idx
  on app_public.photos (is_archived)
  where (is_archived = true);

create index photos_shot_at_idx
  on app_public.photos (shot_at);

create index photos_created_at_idx
  on app_public.photos (created_at);

create index photos_location_id_idx
  on app_public.photos (location_id);

create index photos_author_id_idx
  on app_public.photos (author_id);

create index photos_image_id_idx
  on app_public.photos (image_id);

create function app_private.delete_image() returns trigger
  security definer
  language plpgsql
as
$$
begin
  perform graphile_worker.add_job('delete_image', json_build_object('image_id', old.image_id), max_attempts => 4);
  return old;
end;
$$;

create trigger _100_photos_on_delete
  after delete
  on app_public.photos
  for each row
execute procedure app_private.delete_image();

-- photos likes

create table app_public.photos_likes
(
  id         serial
    primary key,
  photo_id   integer                                                       not null
    references app_public.photos
      on delete cascade,
  user_id    integer                  default app_public.current_user_id() not null
    references app_public.users
      on delete cascade,
  created_at timestamp with time zone default now()                        not null,
  updated_at timestamp with time zone default now()                        not null,
  count      integer                  default 1                            not null
    constraint photos_likes_count_check
      check ((count <= 5) AND (count >= 0)),
  unique (id, photo_id),
  constraint photos_user_id_photo_id_key
    unique (user_id, photo_id)
);

create trigger _100_photos_likes_updated_at
  before update
  on app_public.photos_likes
  for each row
execute procedure app_private.set_updated_at();

comment on constraint photos_likes_photo_id_fkey on app_public.photos_likes is '@foreignFieldName likes';

create function app_private.photos_likes_notify_trigger() returns trigger
  security definer
  language plpgsql
as
$$
declare
  recipient_id integer;
begin
  select author_id into recipient_id from app_public.photos where id = new.photo_id;

  if recipient_id = new.user_id
  then
    return new;
  end if;

  if exists (select 1 from app_private.user_data where user_id = recipient_id and is_unsubscribed = true)
  then
    return new;
  end if;

  perform graphile_worker.add_job(
      identifier := 'notify_user',
      payload := json_build_object('user_id', recipient_id),
      queue_name := 'emails',
      run_at := now() + interval '3 seconds',
      max_attempts := 10,
      job_key := 'user_id:' || new.user_id || ':notify_user',
      job_key_mode := 'preserve_run_at'
    );
  return new;
end;
$$;
create trigger _100_photos_likes_notify_trigger
  after insert
  on app_public.photos_likes
  for each row
execute procedure app_private.photos_likes_notify_trigger();


create function app_private.photos_likes_recalculate_count_on_delete() returns trigger
  security definer
  language plpgsql
as
$$
begin
  -- Use select for update to apply row level lock
  perform id from app_public.photos where id = deleted.photo_id for update;
  update app_public.photos
  set likes_count = likes_count - deleted.count
  where id = deleted.photo_id;
  return deleted;
end;
$$;
create trigger _100_photos_likes_recalculate_count_on_delete
  after delete
  on app_public.photos_likes
  referencing old table as deleted
  for each row
execute procedure app_private.photos_likes_recalculate_count_on_delete();

create function app_private.photos_likes_recalculate_count_on_insert() returns trigger
  security definer
  language plpgsql
as
$$
begin
  -- Use select for update to apply row level lock
  perform id from app_public.photos where id = new.photo_id for update;
  update app_public.photos
  set likes_count = likes_count + new.count
  where id = new.photo_id;
  return new;
end;
$$;
create trigger _100_photos_likes_recalculate_count_on_insert
  after insert
  on app_public.photos_likes
  for each row
execute procedure app_private.photos_likes_recalculate_count_on_insert();


create function app_private.photos_likes_recalculate_count_on_update() returns trigger
  security definer
  language plpgsql
as
$$
begin
  -- Use select for update to apply row level lock
  perform id from app_public.photos where id = new.photo_id for update;
  update app_public.photos
  set likes_count = likes_count + new.count - old.count
  where id = new.photo_id;
  return new;
end;
$$;

create trigger _100_photos_likes_recalculate_count_on_update
  after update
  on app_public.photos_likes
  for each row
  when (new.count IS DISTINCT FROM old.count)
execute procedure app_private.photos_likes_recalculate_count_on_update();


create function app_public.upsert_photo_like(photoId integer, count integer) returns app_public.photos_likes
  security definer
  language plpgsql
as
$$
declare
  current_user_id int;
  result          app_public.photos_likes;
begin
  current_user_id := app_public.current_user_id();

  perform app_public.photos_likes.photo_id
  from app_public.photos_likes
  where app_public.photos_likes.photo_id = $1
    and user_id = current_user_id for update;

  insert into app_public.photos_likes (photo_id, count, user_id)
  values ($1, $2, current_user_id)
  on conflict (photo_id, user_id)
    do update set count = $2
  returning * into result;

  return result;
end;
$$;

-- comments

create table app_public.comments
(
  id          serial
    primary key,
  user_id     integer                  default app_public.current_user_id() not null
    references app_public.users
      on delete cascade,
  body        text                                                          not null
    constraint comments_body_check
      check ((body <> ''::text) AND (body IS NOT NULL) AND (length(body) >= 2)),
  created_at  timestamp with time zone default now()                        not null,
  updated_at  timestamp with time zone default now()                        not null,
  photo_id    integer                                                       not null
    references app_public.photos
      on delete cascade,
  is_archived boolean                  default false                        not null,
  archived_at timestamp with time zone
);

create trigger _100_comments_updated_at
  before update
  on app_public.comments
  for each row
execute procedure app_private.set_updated_at();

create index comments_photo_id_idx
  on app_public.comments (photo_id);

create index comments_user_id_idx
  on app_public.comments (user_id);

comment on column app_public.comments.user_id is '@omit create,update @hasDefault';

create index comments_is_archived_idx
  on app_public.comments (is_archived)
  where (is_archived = true);

create function app_private.comment_notify_trigger() returns trigger
  security definer
  language plpgsql
as
$$
declare
  recipient_id integer;
begin
  select author_id into recipient_id from app_public.photos where id = new.photo_id;

  if recipient_id = new.user_id
  then
    return new;
  end if;

  if exists (select 1 from app_private.user_data where user_id = recipient_id and is_unsubscribed = true)
  then
    return new;
  end if;

  perform graphile_worker.add_job(
      identifier := 'notify_user',
      payload := json_build_object('user_id', recipient_id),
      queue_name := 'emails',
      run_at := now() + interval '15 minutes',
      max_attempts := 10,
      job_key := 'user_id:' || new.user_id || ':notify_user',
      job_key_mode := 'preserve_run_at'
    );
  return new;
end;
$$;

create trigger _800_comments_notify_trigger
  after insert
  on app_public.comments
  for each row
execute procedure app_private.comment_notify_trigger();

-- sessions

create table app_private.sessions
(
  id               uuid primary key     default uuid_generate_v4(),
  user_id          int4        not null references app_public.users on delete cascade,
  token_expires_at timestamptz not null,
  token_hash       varchar(16) not null,
  token_revoked_at timestamptz,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  last_seen_at     timestamptz not null default now(),
  last_seen_ip     inet        not null,
  logged_in_at     timestamptz not null default now(),
  logged_in_ip     inet        not null
);

create index session_user_id_idx
  on app_private.sessions (user_id);

create index session_token_hash_idx
  on app_private.sessions (token_hash);

create index session_token_expires_at_idx
  on app_private.sessions (token_expires_at);

create index session_token_revoked_at_idx
  on app_private.sessions (token_revoked_at);

create trigger _100_session_updated_at
  before update
  on app_private.sessions
  for each row
execute procedure app_private.set_updated_at();


-- seeds

INSERT INTO app_public.locations (id, name, updated_at, created_at, geo, slug, description, is_archived, archived_at)
VALUES (1, 'Istanbul', '2023-06-27 16:33:40.436949', '2023-06-27 16:33:40.436949', '(41.013611,28.955)', 'istanbul', e'
Istanbul\'s beauty lies in its breathtaking juxtaposition of East and West, where ancient historical sites coexist with modern marvels. Its stunning architecture, such as the iconic Hagia Sophia and the grandeur of the Blue Mosque, combined with the picturesque views of the Bosphorus, create an enchanting atmosphere that is truly captivating. Additionally, the vibrant and diverse culture, bustling markets, and mouthwatering cuisine further enhance Istanbul\'s allure, making it a city that effortlessly captures the hearts of its visitors.',
        false, null);
INSERT INTO app_public.locations (id, name, updated_at, created_at, geo, slug, description, is_archived, archived_at)
VALUES (5, 'Batumi', '2023-06-27 16:47:44.013233', '2023-06-27 16:47:44.013233', '(41.645833,41.641667)', 'batumi',
        'Batumi, a coastal city located on the Black Sea coast of Georgia, is a stunning destination that offers a perfect blend of natural beauty, modern architecture, and vibrant culture. Its beauty lies in the breathtaking coastline with pristine beaches, where visitors can enjoy the mesmerizing views of the sea and stunning sunsets. Batumi''s skyline is adorned with unique architectural marvels, including the famous Alphabet Tower and the futuristic Batumi Boulevard, which add a touch of modernity to the city. The city''s lively atmosphere, vibrant nightlife, and welcoming locals further enhance its allure, making Batumi a captivating destination for travelers.',
        false, null);
INSERT INTO app_public.locations (id, name, updated_at, created_at, geo, slug, description, is_archived, archived_at)
VALUES (3, 'Bali', '2023-06-27 16:46:45.697894', '2023-06-27 16:46:45.697894', '(-8.335,115.088056)', 'bali', e'
Bali\'s beauty lies in its tropical paradise setting, where stunning landscapes, pristine beaches, and lush green rice terraces create a mesmerizing backdrop. The island\'s unique blend of ancient temples, such as the iconic Uluwatu Temple, alongside its vibrant arts and cultural scene, including traditional dance performances and local craftsmanship, add to its charm. Bali\'s warm hospitality, rich spiritual traditions, and delectable cuisine further enhance its allure, making it a captivating destination that leaves a lasting impression on all who visit.',
        false, null);
INSERT INTO app_public.locations (id, name, updated_at, created_at, geo, slug, description, is_archived, archived_at)
VALUES (4, 'Manila', '2023-06-27 16:47:17.863527', '2023-06-27 16:47:17.863527', '(14.5958,120.9772)', 'manila',
        'Manila, the bustling capital of the Philippines, is a beautiful city that seamlessly blends history, modernity, and natural beauty. Its beauty lies in the vibrant mix of colonial-era architecture, such as the iconic walled city of Intramuros, with modern skyscrapers dotting the skyline. Manila Bay, with its stunning sunsets and panoramic views, adds to the city''s allure, while its rich cultural heritage, lively markets, and mouthwatering street food scene provide a captivating experience for visitors. Manila''s warm hospitality and the Filipinos'' genuine charm make it a destination that leaves a lasting impression.',
        false, null);
INSERT INTO app_public.locations (id, name, updated_at, created_at, geo, slug, description, is_archived, archived_at)
VALUES (2, 'Tbilisi', '2023-06-27 16:45:57.543682', '2023-06-27 16:45:57.543682', '(41.7225,44.7925)', 'tbilisi',
        'Tbilisi, the capital city of Georgia, is a beautiful destination that offers a unique blend of old-world charm and modern vibrancy. Its beauty lies in the picturesque setting of cobblestone streets, colorful buildings, and a backdrop of rolling hills and the Mtkvari River. The city''s rich history is evident in its diverse architectural styles, ranging from medieval fortress walls and grand churches to the iconic Art Nouveau structures. Tbilisi''s warm and welcoming atmosphere, along with its thriving arts and culinary scenes, further add to its allure, making it a captivating destination for travelers.',
        false, null);
INSERT INTO app_public.locations (id, name, updated_at, created_at, geo, slug, description, is_archived, archived_at)
VALUES (6, 'Saint Petersburg', '2023-06-27 16:48:15.401373', '2023-06-27 16:48:15.401373', '(59.9375,30.308611)',
        'saint-petersburg',
        'Saint Petersburg, the cultural gem of Russia, is a city of extraordinary beauty that captivates visitors with its grandeur and elegance. Its beauty lies in the magnificent architectural ensemble, with iconic landmarks such as the Hermitage Museum, the Peter and Paul Fortress, and the Church of the Savior on Spilled Blood. The city''s network of canals and bridges, reminiscent of Venice, adds a romantic charm, while its rich artistic and literary heritage, including the renowned Mariinsky Theatre and the literary landmarks of Dostoevsky and Pushkin, contribute to its allure. Saint Petersburg''s cultural vibrancy, combined with its regal past and scenic landscapes, make it an enchanting destination that leaves a lasting impression.',
        false, null);
