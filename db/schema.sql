--
-- PostgreSQL database dump
--

-- Dumped from database version 15.3 (Debian 15.3-1.pgdg110+1)
-- Dumped by pg_dump version 15.3 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: app_hidden; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA app_hidden;


--
-- Name: app_private; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA app_private;


--
-- Name: app_public; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA app_public;


--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

-- *not* creating schema, since initdb creates it


--
-- Name: fuzzystrmatch; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS fuzzystrmatch WITH SCHEMA public;


--
-- Name: EXTENSION fuzzystrmatch; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION fuzzystrmatch IS 'determine similarities and distance between strings';


--
-- Name: postgis; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS postgis WITH SCHEMA public;


--
-- Name: EXTENSION postgis; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION postgis IS 'PostGIS geometry and geography spatial types and functions';


--
-- Name: postgis_topology; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS postgis_topology WITH SCHEMA topology;


--
-- Name: EXTENSION postgis_topology; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION postgis_topology IS 'PostGIS topology spatial types and functions';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: image_source; Type: TYPE; Schema: app_public; Owner: -
--

CREATE TYPE app_public.image_source AS (
	s3_key text,
	size integer,
	type character varying
);


--
-- Name: jwt_token; Type: TYPE; Schema: app_public; Owner: -
--

CREATE TYPE app_public.jwt_token AS (
	exp bigint,
	user_id integer,
	role text
);


--
-- Name: role; Type: TYPE; Schema: app_public; Owner: -
--

CREATE TYPE app_public.role AS ENUM (
    'app_user',
    'app_admin'
);


--
-- Name: access_token(); Type: FUNCTION; Schema: app_private; Owner: -
--

CREATE FUNCTION app_private.access_token() RETURNS app_public.jwt_token
    LANGUAGE plpgsql STRICT SECURITY DEFINER
    AS $$
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
$$;


--
-- Name: comment_notify_trigger(); Type: FUNCTION; Schema: app_private; Owner: -
--

CREATE FUNCTION app_private.comment_notify_trigger() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
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


--
-- Name: complete_image_upload(); Type: FUNCTION; Schema: app_private; Owner: -
--

CREATE FUNCTION app_private.complete_image_upload() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
begin
  perform graphile_worker.add_job(
      identifier := 'convert_image',
      payload := json_build_object('image_id', new.id),
      queue_name := 'image_conversion',
      max_attempts => 4
    );
  return new; -- New line added
end;
$$;


--
-- Name: delete_image(); Type: FUNCTION; Schema: app_private; Owner: -
--

CREATE FUNCTION app_private.delete_image() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
begin
  perform graphile_worker.add_job('delete_image', json_build_object('image_id', old.image_id), max_attempts => 4);
  return old;
end;
$$;


--
-- Name: photos_likes_notify_trigger(); Type: FUNCTION; Schema: app_private; Owner: -
--

CREATE FUNCTION app_private.photos_likes_notify_trigger() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
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


--
-- Name: photos_likes_recalculate_count_on_delete(); Type: FUNCTION; Schema: app_private; Owner: -
--

CREATE FUNCTION app_private.photos_likes_recalculate_count_on_delete() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
begin
  -- Use select for update to apply row level lock
  perform id from app_public.photos where id = old.photo_id for update;
  update app_public.photos
  set likes_count = likes_count - old.count
  where id = old.photo_id;
  return old;
end;
$$;


--
-- Name: photos_likes_recalculate_count_on_insert(); Type: FUNCTION; Schema: app_private; Owner: -
--

CREATE FUNCTION app_private.photos_likes_recalculate_count_on_insert() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
begin
  -- Use select for update to apply row level lock
  perform id from app_public.photos where id = new.photo_id for update;
  update app_public.photos
  set likes_count = likes_count + new.count
  where id = new.photo_id;
  return new;
end;
$$;


--
-- Name: photos_likes_recalculate_count_on_update(); Type: FUNCTION; Schema: app_private; Owner: -
--

CREATE FUNCTION app_private.photos_likes_recalculate_count_on_update() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
begin
  -- Use select for update to apply row level lock
  perform id from app_public.photos where id = new.photo_id for update;
  update app_public.photos
  set likes_count = likes_count + new.count - old.count
  where id = new.photo_id;
  return new;
end;
$$;


--
-- Name: set_updated_at(); Type: FUNCTION; Schema: app_private; Owner: -
--

CREATE FUNCTION app_private.set_updated_at() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
begin
  new.updated_at := current_timestamp;
  return new;
end;
$$;


--
-- Name: update_comment_check(); Type: FUNCTION; Schema: app_private; Owner: -
--

CREATE FUNCTION app_private.update_comment_check() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
begin
  if new.is_archived = true then
    if new.updated_at < now() - interval '5 minutes' then
      raise exception 'You can not archive comment after 5 minutes after creation';
    end if;
  end if;
  return new;
end;
$$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: users; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.users (
    id integer NOT NULL,
    display_name character varying NOT NULL,
    picture_url character varying,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    role app_public.role DEFAULT 'app_user'::app_public.role NOT NULL,
    is_archived boolean DEFAULT false NOT NULL,
    archived_at timestamp with time zone,
    CONSTRAINT users_picture_url_check CHECK (((picture_url)::text ~ '^https://.*'::text))
);


--
-- Name: upsert_user(character varying, character varying, character varying, character varying, character varying, character varying, character varying, character varying, boolean); Type: FUNCTION; Schema: app_private; Owner: -
--

CREATE FUNCTION app_private.upsert_user(google_id character varying, google_email character varying, google_refresh_token character varying, google_picture_url character varying, google_name character varying, google_given_name character varying, google_family_name character varying, google_locale character varying, google_verified_email boolean) RETURNS app_public.users
    LANGUAGE plpgsql STRICT SECURITY DEFINER
    AS $_$
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
$_$;


--
-- Name: current_user(); Type: FUNCTION; Schema: app_public; Owner: -
--

CREATE FUNCTION app_public."current_user"() RETURNS app_public.users
    LANGUAGE sql STABLE
    AS $$
select *
from app_public.users
where id = nullif(current_setting('jwt.claims.user_id', true), '')::integer
$$;


--
-- Name: current_user_id(); Type: FUNCTION; Schema: app_public; Owner: -
--

CREATE FUNCTION app_public.current_user_id() RETURNS integer
    LANGUAGE sql STABLE
    AS $$
select nullif(current_setting('jwt.claims.user_id', true), '')::integer
$$;


--
-- Name: delete_old_session(); Type: FUNCTION; Schema: app_public; Owner: -
--

CREATE FUNCTION app_public.delete_old_session() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
begin
    delete from app_private.sessions where id in (
        select id from app_private.sessions
        where user_id = new.user_id
        order by created_at desc offset 20
    );
    return null;
end;
$$;


--
-- Name: drop_all_policies(text, text); Type: FUNCTION; Schema: app_public; Owner: -
--

CREATE FUNCTION app_public.drop_all_policies(table_name_in text, schema_name_in text) RETURNS void
    LANGUAGE plpgsql
    AS $$
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
$$;


--
-- Name: locations; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.locations (
    id integer NOT NULL,
    name character varying NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    geo point DEFAULT point((0)::double precision, (0)::double precision) NOT NULL,
    slug character varying DEFAULT ''::character varying NOT NULL,
    description text,
    is_archived boolean DEFAULT false NOT NULL,
    archived_at timestamp with time zone
);


--
-- Name: locations_by_distance(double precision, double precision); Type: FUNCTION; Schema: app_public; Owner: -
--

CREATE FUNCTION app_public.locations_by_distance(lat double precision, lng double precision) RETURNS SETOF app_public.locations
    LANGUAGE sql STABLE
    AS $$
select *
from app_public.locations
order by st_setsrid(st_makepoint(lat, lng), 4326) <-> st_setsrid(st_makepoint(
                                                                     app_public.locations.geo[0],
                                                                     app_public.locations.geo[1]
                                                                   ), 4326)
    asc
$$;


--
-- Name: photos_likes; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.photos_likes (
    id integer NOT NULL,
    photo_id integer NOT NULL,
    user_id integer DEFAULT app_public.current_user_id() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    count integer DEFAULT 1 NOT NULL,
    CONSTRAINT photos_likes_count_check CHECK (((count <= 5) AND (count >= 0)))
);


--
-- Name: upsert_photo_like(integer, integer); Type: FUNCTION; Schema: app_public; Owner: -
--

CREATE FUNCTION app_public.upsert_photo_like(photoid integer, count integer) RETURNS app_public.photos_likes
    LANGUAGE plpgsql SECURITY DEFINER
    AS $_$
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
$_$;


--
-- Name: user_data; Type: TABLE; Schema: app_hidden; Owner: -
--

CREATE TABLE app_hidden.user_data (
    id integer NOT NULL,
    user_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    email character varying(255) NOT NULL,
    CONSTRAINT user_data_email_check CHECK (((email)::text ~ '^.+@.+\..+$'::text))
);


--
-- Name: user_data_id_seq; Type: SEQUENCE; Schema: app_hidden; Owner: -
--

CREATE SEQUENCE app_hidden.user_data_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: user_data_id_seq; Type: SEQUENCE OWNED BY; Schema: app_hidden; Owner: -
--

ALTER SEQUENCE app_hidden.user_data_id_seq OWNED BY app_hidden.user_data.id;


--
-- Name: sessions; Type: TABLE; Schema: app_private; Owner: -
--

CREATE TABLE app_private.sessions (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id integer NOT NULL,
    token_expires_at timestamp with time zone NOT NULL,
    token_hash character varying(16) NOT NULL,
    token_revoked_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    last_seen_at timestamp with time zone DEFAULT now() NOT NULL,
    last_seen_ip inet NOT NULL,
    logged_in_at timestamp with time zone DEFAULT now() NOT NULL,
    logged_in_ip inet NOT NULL
);


--
-- Name: user_data; Type: TABLE; Schema: app_private; Owner: -
--

CREATE TABLE app_private.user_data (
    id integer NOT NULL,
    user_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    google_email character varying(255) NOT NULL,
    google_id character varying(255) NOT NULL,
    google_refresh_token text NOT NULL,
    google_picture_url character varying(255) NOT NULL,
    google_name character varying(255) NOT NULL,
    google_given_name character varying(255) NOT NULL,
    google_family_name character varying(255) NOT NULL,
    google_locale character varying(10) NOT NULL,
    google_verified_email boolean DEFAULT false NOT NULL,
    notified_at timestamp with time zone,
    is_unsubscribed boolean DEFAULT false NOT NULL
);


--
-- Name: user_data_id_seq; Type: SEQUENCE; Schema: app_private; Owner: -
--

CREATE SEQUENCE app_private.user_data_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: user_data_id_seq; Type: SEQUENCE OWNED BY; Schema: app_private; Owner: -
--

ALTER SEQUENCE app_private.user_data_id_seq OWNED BY app_private.user_data.id;


--
-- Name: comments; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.comments (
    id integer NOT NULL,
    user_id integer DEFAULT app_public.current_user_id() NOT NULL,
    body text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    photo_id integer NOT NULL,
    is_archived boolean DEFAULT false NOT NULL,
    archived_at timestamp with time zone,
    CONSTRAINT comments_body_check CHECK (((body <> ''::text) AND (body IS NOT NULL) AND (length(body) >= 2)))
);


--
-- Name: COLUMN comments.user_id; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON COLUMN app_public.comments.user_id IS '@omit create,update @hasDefault';


--
-- Name: comments_id_seq; Type: SEQUENCE; Schema: app_public; Owner: -
--

CREATE SEQUENCE app_public.comments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: comments_id_seq; Type: SEQUENCE OWNED BY; Schema: app_public; Owner: -
--

ALTER SEQUENCE app_public.comments_id_seq OWNED BY app_public.comments.id;


--
-- Name: images; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.images (
    id integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    user_id integer DEFAULT app_public.current_user_id(),
    s3_bucket character varying NOT NULL,
    s3_key text NOT NULL,
    is_hdr boolean DEFAULT false NOT NULL,
    is_uploaded boolean DEFAULT false NOT NULL,
    exif_data jsonb,
    sources app_public.image_source[] DEFAULT ARRAY[]::app_public.image_source[] NOT NULL
);


--
-- Name: images_id_seq; Type: SEQUENCE; Schema: app_public; Owner: -
--

CREATE SEQUENCE app_public.images_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: images_id_seq; Type: SEQUENCE OWNED BY; Schema: app_public; Owner: -
--

ALTER SEQUENCE app_public.images_id_seq OWNED BY app_public.images.id;


--
-- Name: locations_id_seq; Type: SEQUENCE; Schema: app_public; Owner: -
--

CREATE SEQUENCE app_public.locations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: locations_id_seq; Type: SEQUENCE OWNED BY; Schema: app_public; Owner: -
--

ALTER SEQUENCE app_public.locations_id_seq OWNED BY app_public.locations.id;


--
-- Name: photos; Type: TABLE; Schema: app_public; Owner: -
--

CREATE TABLE app_public.photos (
    id integer NOT NULL,
    author_id integer DEFAULT app_public.current_user_id(),
    url character varying NOT NULL,
    thumbnail bytea,
    location_id integer NOT NULL,
    width smallint NOT NULL,
    height smallint NOT NULL,
    lat double precision,
    lng double precision,
    camera character varying,
    lens character varying,
    focal_length character varying,
    iso smallint,
    shutter_speed double precision,
    aperture character varying,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    shot_at timestamp with time zone,
    blurhash text,
    image_id integer,
    likes_count integer DEFAULT 0 NOT NULL,
    is_archived boolean DEFAULT false NOT NULL,
    archived_at timestamp with time zone
);


--
-- Name: COLUMN photos.author_id; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON COLUMN app_public.photos.author_id IS '@omit create,update
 @hasDefault';


--
-- Name: COLUMN photos.likes_count; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON COLUMN app_public.photos.likes_count IS '@omit update';


--
-- Name: photos_id_seq; Type: SEQUENCE; Schema: app_public; Owner: -
--

CREATE SEQUENCE app_public.photos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: photos_id_seq; Type: SEQUENCE OWNED BY; Schema: app_public; Owner: -
--

ALTER SEQUENCE app_public.photos_id_seq OWNED BY app_public.photos.id;


--
-- Name: photos_likes_id_seq; Type: SEQUENCE; Schema: app_public; Owner: -
--

CREATE SEQUENCE app_public.photos_likes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: photos_likes_id_seq; Type: SEQUENCE OWNED BY; Schema: app_public; Owner: -
--

ALTER SEQUENCE app_public.photos_likes_id_seq OWNED BY app_public.photos_likes.id;


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: app_public; Owner: -
--

CREATE SEQUENCE app_public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: app_public; Owner: -
--

ALTER SEQUENCE app_public.users_id_seq OWNED BY app_public.users.id;


--
-- Name: user_data id; Type: DEFAULT; Schema: app_hidden; Owner: -
--

ALTER TABLE ONLY app_hidden.user_data ALTER COLUMN id SET DEFAULT nextval('app_hidden.user_data_id_seq'::regclass);


--
-- Name: user_data id; Type: DEFAULT; Schema: app_private; Owner: -
--

ALTER TABLE ONLY app_private.user_data ALTER COLUMN id SET DEFAULT nextval('app_private.user_data_id_seq'::regclass);


--
-- Name: comments id; Type: DEFAULT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.comments ALTER COLUMN id SET DEFAULT nextval('app_public.comments_id_seq'::regclass);


--
-- Name: images id; Type: DEFAULT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.images ALTER COLUMN id SET DEFAULT nextval('app_public.images_id_seq'::regclass);


--
-- Name: locations id; Type: DEFAULT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.locations ALTER COLUMN id SET DEFAULT nextval('app_public.locations_id_seq'::regclass);


--
-- Name: photos id; Type: DEFAULT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.photos ALTER COLUMN id SET DEFAULT nextval('app_public.photos_id_seq'::regclass);


--
-- Name: photos_likes id; Type: DEFAULT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.photos_likes ALTER COLUMN id SET DEFAULT nextval('app_public.photos_likes_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.users ALTER COLUMN id SET DEFAULT nextval('app_public.users_id_seq'::regclass);


--
-- Name: user_data user_data_pkey; Type: CONSTRAINT; Schema: app_hidden; Owner: -
--

ALTER TABLE ONLY app_hidden.user_data
    ADD CONSTRAINT user_data_pkey PRIMARY KEY (id);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: app_private; Owner: -
--

ALTER TABLE ONLY app_private.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- Name: user_data user_data_pkey; Type: CONSTRAINT; Schema: app_private; Owner: -
--

ALTER TABLE ONLY app_private.user_data
    ADD CONSTRAINT user_data_pkey PRIMARY KEY (id);


--
-- Name: comments comments_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.comments
    ADD CONSTRAINT comments_pkey PRIMARY KEY (id);


--
-- Name: images images_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.images
    ADD CONSTRAINT images_pkey PRIMARY KEY (id);


--
-- Name: locations locations_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.locations
    ADD CONSTRAINT locations_pkey PRIMARY KEY (id);


--
-- Name: photos_likes photos_likes_id_photo_id_key; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.photos_likes
    ADD CONSTRAINT photos_likes_id_photo_id_key UNIQUE (id, photo_id);


--
-- Name: photos_likes photos_likes_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.photos_likes
    ADD CONSTRAINT photos_likes_pkey PRIMARY KEY (id);


--
-- Name: photos photos_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.photos
    ADD CONSTRAINT photos_pkey PRIMARY KEY (id);


--
-- Name: photos_likes photos_user_id_photo_id_key; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.photos_likes
    ADD CONSTRAINT photos_user_id_photo_id_key UNIQUE (user_id, photo_id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: user_data_email_uindex; Type: INDEX; Schema: app_hidden; Owner: -
--

CREATE UNIQUE INDEX user_data_email_uindex ON app_hidden.user_data USING btree (email);


--
-- Name: user_data_user_id_uindex; Type: INDEX; Schema: app_hidden; Owner: -
--

CREATE UNIQUE INDEX user_data_user_id_uindex ON app_hidden.user_data USING btree (user_id);


--
-- Name: session_token_expires_at_idx; Type: INDEX; Schema: app_private; Owner: -
--

CREATE INDEX session_token_expires_at_idx ON app_private.sessions USING btree (token_expires_at);


--
-- Name: session_token_hash_idx; Type: INDEX; Schema: app_private; Owner: -
--

CREATE INDEX session_token_hash_idx ON app_private.sessions USING btree (token_hash);


--
-- Name: session_token_revoked_at_idx; Type: INDEX; Schema: app_private; Owner: -
--

CREATE INDEX session_token_revoked_at_idx ON app_private.sessions USING btree (token_revoked_at);


--
-- Name: session_user_id_idx; Type: INDEX; Schema: app_private; Owner: -
--

CREATE INDEX session_user_id_idx ON app_private.sessions USING btree (user_id);


--
-- Name: user_data_google_email_uindex; Type: INDEX; Schema: app_private; Owner: -
--

CREATE UNIQUE INDEX user_data_google_email_uindex ON app_private.user_data USING btree (google_email);


--
-- Name: user_data_google_id_uindex; Type: INDEX; Schema: app_private; Owner: -
--

CREATE UNIQUE INDEX user_data_google_id_uindex ON app_private.user_data USING btree (google_id);


--
-- Name: user_data_user_id_idx; Type: INDEX; Schema: app_private; Owner: -
--

CREATE INDEX user_data_user_id_idx ON app_private.user_data USING btree (user_id);


--
-- Name: user_data_user_id_uindex; Type: INDEX; Schema: app_private; Owner: -
--

CREATE UNIQUE INDEX user_data_user_id_uindex ON app_private.user_data USING btree (user_id);


--
-- Name: comments_is_archived_idx; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX comments_is_archived_idx ON app_public.comments USING btree (is_archived) WHERE (is_archived = true);


--
-- Name: comments_photo_id_idx; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX comments_photo_id_idx ON app_public.comments USING btree (photo_id);


--
-- Name: comments_user_id_idx; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX comments_user_id_idx ON app_public.comments USING btree (user_id);


--
-- Name: images_user_id_idx; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX images_user_id_idx ON app_public.images USING btree (user_id);


--
-- Name: locations_geo_idx; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX locations_geo_idx ON app_public.locations USING gist (geo);


--
-- Name: locations_is_archived_idx; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX locations_is_archived_idx ON app_public.locations USING btree (is_archived) WHERE (is_archived = false);


--
-- Name: photos_author_id_idx; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX photos_author_id_idx ON app_public.photos USING btree (author_id);


--
-- Name: photos_created_at_idx; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX photos_created_at_idx ON app_public.photos USING btree (created_at);


--
-- Name: photos_image_id_idx; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX photos_image_id_idx ON app_public.photos USING btree (image_id);


--
-- Name: photos_is_archived_idx; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX photos_is_archived_idx ON app_public.photos USING btree (is_archived) WHERE (is_archived = true);


--
-- Name: photos_location_id_idx; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX photos_location_id_idx ON app_public.photos USING btree (location_id);


--
-- Name: photos_shot_at_idx; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX photos_shot_at_idx ON app_public.photos USING btree (shot_at);


--
-- Name: unique_slug; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX unique_slug ON app_public.locations USING btree (lower((slug)::text));


--
-- Name: users_is_archived_idx; Type: INDEX; Schema: app_public; Owner: -
--

CREATE INDEX users_is_archived_idx ON app_public.users USING btree (is_archived) WHERE (is_archived = false);


--
-- Name: user_data _100_user_data_set_updated_at; Type: TRIGGER; Schema: app_hidden; Owner: -
--

CREATE TRIGGER _100_user_data_set_updated_at BEFORE UPDATE ON app_hidden.user_data FOR EACH ROW EXECUTE FUNCTION app_private.set_updated_at();


--
-- Name: sessions _100_session_updated_at; Type: TRIGGER; Schema: app_private; Owner: -
--

CREATE TRIGGER _100_session_updated_at BEFORE UPDATE ON app_private.sessions FOR EACH ROW EXECUTE FUNCTION app_private.set_updated_at();


--
-- Name: user_data _100_user_data_set_updated_at; Type: TRIGGER; Schema: app_private; Owner: -
--

CREATE TRIGGER _100_user_data_set_updated_at BEFORE UPDATE ON app_private.user_data FOR EACH ROW EXECUTE FUNCTION app_private.set_updated_at();


--
-- Name: sessions _200_delete_old_session_trigger; Type: TRIGGER; Schema: app_private; Owner: -
--

CREATE TRIGGER _200_delete_old_session_trigger AFTER INSERT ON app_private.sessions FOR EACH ROW EXECUTE FUNCTION app_public.delete_old_session();


--
-- Name: comments _100_comments_updated_at; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _100_comments_updated_at BEFORE UPDATE ON app_public.comments FOR EACH ROW EXECUTE FUNCTION app_private.set_updated_at();


--
-- Name: images _100_images_updated_at; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _100_images_updated_at BEFORE UPDATE ON app_public.images FOR EACH ROW EXECUTE FUNCTION app_private.set_updated_at();


--
-- Name: locations _100_locations_set_updated_at; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _100_locations_set_updated_at BEFORE UPDATE ON app_public.locations FOR EACH ROW EXECUTE FUNCTION app_private.set_updated_at();


--
-- Name: photos_likes _100_photos_likes_notify_trigger; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _100_photos_likes_notify_trigger AFTER INSERT ON app_public.photos_likes FOR EACH ROW EXECUTE FUNCTION app_private.photos_likes_notify_trigger();


--
-- Name: photos_likes _100_photos_likes_recalculate_count_on_delete; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _100_photos_likes_recalculate_count_on_delete AFTER DELETE ON app_public.photos_likes FOR EACH ROW EXECUTE FUNCTION app_private.photos_likes_recalculate_count_on_delete();


--
-- Name: photos_likes _100_photos_likes_recalculate_count_on_insert; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _100_photos_likes_recalculate_count_on_insert AFTER INSERT ON app_public.photos_likes FOR EACH ROW EXECUTE FUNCTION app_private.photos_likes_recalculate_count_on_insert();


--
-- Name: photos_likes _100_photos_likes_recalculate_count_on_update; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _100_photos_likes_recalculate_count_on_update AFTER UPDATE ON app_public.photos_likes FOR EACH ROW WHEN ((new.count IS DISTINCT FROM old.count)) EXECUTE FUNCTION app_private.photos_likes_recalculate_count_on_update();


--
-- Name: photos_likes _100_photos_likes_updated_at; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _100_photos_likes_updated_at BEFORE UPDATE ON app_public.photos_likes FOR EACH ROW EXECUTE FUNCTION app_private.set_updated_at();


--
-- Name: photos _100_photos_on_delete; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _100_photos_on_delete AFTER DELETE ON app_public.photos FOR EACH ROW EXECUTE FUNCTION app_private.delete_image();


--
-- Name: photos _100_photos_updated_at; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _100_photos_updated_at BEFORE UPDATE ON app_public.photos FOR EACH ROW EXECUTE FUNCTION app_private.set_updated_at();


--
-- Name: users _100_users_set_updated_at; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _100_users_set_updated_at BEFORE UPDATE ON app_public.users FOR EACH ROW EXECUTE FUNCTION app_private.set_updated_at();


--
-- Name: images _500_complete_image_upload; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _500_complete_image_upload AFTER UPDATE ON app_public.images FOR EACH ROW WHEN (((old.is_uploaded = false) AND (new.is_uploaded = true))) EXECUTE FUNCTION app_private.complete_image_upload();


--
-- Name: comments _500_update_comment_check; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _500_update_comment_check BEFORE UPDATE ON app_public.comments FOR EACH ROW EXECUTE FUNCTION app_private.update_comment_check();


--
-- Name: comments _800_comments_notify_trigger; Type: TRIGGER; Schema: app_public; Owner: -
--

CREATE TRIGGER _800_comments_notify_trigger AFTER INSERT ON app_public.comments FOR EACH ROW EXECUTE FUNCTION app_private.comment_notify_trigger();


--
-- Name: user_data user_data_user_id_fkey; Type: FK CONSTRAINT; Schema: app_hidden; Owner: -
--

ALTER TABLE ONLY app_hidden.user_data
    ADD CONSTRAINT user_data_user_id_fkey FOREIGN KEY (user_id) REFERENCES app_public.users(id) ON DELETE CASCADE;


--
-- Name: sessions sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: app_private; Owner: -
--

ALTER TABLE ONLY app_private.sessions
    ADD CONSTRAINT sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES app_public.users(id) ON DELETE CASCADE;


--
-- Name: user_data user_data_user_id_fkey; Type: FK CONSTRAINT; Schema: app_private; Owner: -
--

ALTER TABLE ONLY app_private.user_data
    ADD CONSTRAINT user_data_user_id_fkey FOREIGN KEY (user_id) REFERENCES app_public.users(id) ON DELETE CASCADE;


--
-- Name: comments comments_photo_id_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.comments
    ADD CONSTRAINT comments_photo_id_fkey FOREIGN KEY (photo_id) REFERENCES app_public.photos(id) ON DELETE CASCADE;


--
-- Name: comments comments_user_id_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.comments
    ADD CONSTRAINT comments_user_id_fkey FOREIGN KEY (user_id) REFERENCES app_public.users(id) ON DELETE CASCADE;


--
-- Name: images images_user_id_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.images
    ADD CONSTRAINT images_user_id_fkey FOREIGN KEY (user_id) REFERENCES app_public.users(id) ON DELETE SET NULL;


--
-- Name: photos photos_author_id_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.photos
    ADD CONSTRAINT photos_author_id_fkey FOREIGN KEY (author_id) REFERENCES app_public.users(id) ON DELETE CASCADE;


--
-- Name: photos photos_image_id_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.photos
    ADD CONSTRAINT photos_image_id_fkey FOREIGN KEY (image_id) REFERENCES app_public.images(id) ON DELETE SET NULL;


--
-- Name: photos_likes photos_likes_photo_id_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.photos_likes
    ADD CONSTRAINT photos_likes_photo_id_fkey FOREIGN KEY (photo_id) REFERENCES app_public.photos(id) ON DELETE CASCADE;


--
-- Name: CONSTRAINT photos_likes_photo_id_fkey ON photos_likes; Type: COMMENT; Schema: app_public; Owner: -
--

COMMENT ON CONSTRAINT photos_likes_photo_id_fkey ON app_public.photos_likes IS '@foreignFieldName likes';


--
-- Name: photos_likes photos_likes_user_id_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.photos_likes
    ADD CONSTRAINT photos_likes_user_id_fkey FOREIGN KEY (user_id) REFERENCES app_public.users(id) ON DELETE CASCADE;


--
-- Name: photos photos_location_fkey; Type: FK CONSTRAINT; Schema: app_public; Owner: -
--

ALTER TABLE ONLY app_public.photos
    ADD CONSTRAINT photos_location_fkey FOREIGN KEY (location_id) REFERENCES app_public.locations(id) ON DELETE SET NULL;


--
-- Name: comments; Type: ROW SECURITY; Schema: app_public; Owner: -
--

ALTER TABLE app_public.comments ENABLE ROW LEVEL SECURITY;

--
-- Name: images; Type: ROW SECURITY; Schema: app_public; Owner: -
--

ALTER TABLE app_public.images ENABLE ROW LEVEL SECURITY;

--
-- Name: photos insert_user; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY insert_user ON app_public.photos FOR INSERT TO app_user WITH CHECK ((author_id = app_public.current_user_id()));


--
-- Name: locations; Type: ROW SECURITY; Schema: app_public; Owner: -
--

ALTER TABLE app_public.locations ENABLE ROW LEVEL SECURITY;

--
-- Name: comments manage_all; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY manage_all ON app_public.comments TO app_admin USING (true);


--
-- Name: images manage_all; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY manage_all ON app_public.images TO app_admin USING (true);


--
-- Name: locations manage_all; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY manage_all ON app_public.locations TO app_admin USING (true);


--
-- Name: photos manage_all; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY manage_all ON app_public.photos TO app_admin USING (true);


--
-- Name: photos_likes manage_all; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY manage_all ON app_public.photos_likes TO app_admin USING (true);


--
-- Name: users manage_all; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY manage_all ON app_public.users TO app_admin USING (true);


--
-- Name: comments manage_own; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY manage_own ON app_public.comments TO app_user USING ((user_id = app_public.current_user_id()));


--
-- Name: images manage_own; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY manage_own ON app_public.images FOR UPDATE TO app_user USING ((user_id = app_public.current_user_id()));


--
-- Name: photos_likes manage_own; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY manage_own ON app_public.photos_likes TO app_user USING ((user_id = app_public.current_user_id()));


--
-- Name: photos; Type: ROW SECURITY; Schema: app_public; Owner: -
--

ALTER TABLE app_public.photos ENABLE ROW LEVEL SECURITY;

--
-- Name: photos_likes; Type: ROW SECURITY; Schema: app_public; Owner: -
--

ALTER TABLE app_public.photos_likes ENABLE ROW LEVEL SECURITY;

--
-- Name: comments select_all; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY select_all ON app_public.comments FOR SELECT TO app_anonymous USING ((is_archived = false));


--
-- Name: images select_all; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY select_all ON app_public.images FOR SELECT TO app_anonymous USING (true);


--
-- Name: locations select_all; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY select_all ON app_public.locations FOR SELECT TO app_anonymous USING ((is_archived = false));


--
-- Name: photos select_all; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY select_all ON app_public.photos FOR SELECT TO app_anonymous USING ((is_archived = false));


--
-- Name: photos_likes select_all; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY select_all ON app_public.photos_likes FOR SELECT TO app_anonymous USING (true);


--
-- Name: users select_all; Type: POLICY; Schema: app_public; Owner: -
--

CREATE POLICY select_all ON app_public.users FOR SELECT TO app_anonymous USING ((is_archived = false));


--
-- Name: users; Type: ROW SECURITY; Schema: app_public; Owner: -
--

ALTER TABLE app_public.users ENABLE ROW LEVEL SECURITY;

--
-- Name: SCHEMA app_hidden; Type: ACL; Schema: -; Owner: -
--

GRANT USAGE ON SCHEMA app_hidden TO app_anonymous;


--
-- Name: SCHEMA app_public; Type: ACL; Schema: -; Owner: -
--

GRANT USAGE ON SCHEMA app_public TO app_anonymous;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: -
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;
GRANT USAGE ON SCHEMA public TO app_anonymous;


--
-- Name: FUNCTION access_token(); Type: ACL; Schema: app_private; Owner: -
--

REVOKE ALL ON FUNCTION app_private.access_token() FROM PUBLIC;


--
-- Name: FUNCTION comment_notify_trigger(); Type: ACL; Schema: app_private; Owner: -
--

REVOKE ALL ON FUNCTION app_private.comment_notify_trigger() FROM PUBLIC;


--
-- Name: FUNCTION complete_image_upload(); Type: ACL; Schema: app_private; Owner: -
--

REVOKE ALL ON FUNCTION app_private.complete_image_upload() FROM PUBLIC;


--
-- Name: FUNCTION delete_image(); Type: ACL; Schema: app_private; Owner: -
--

REVOKE ALL ON FUNCTION app_private.delete_image() FROM PUBLIC;


--
-- Name: FUNCTION photos_likes_notify_trigger(); Type: ACL; Schema: app_private; Owner: -
--

REVOKE ALL ON FUNCTION app_private.photos_likes_notify_trigger() FROM PUBLIC;


--
-- Name: FUNCTION photos_likes_recalculate_count_on_delete(); Type: ACL; Schema: app_private; Owner: -
--

REVOKE ALL ON FUNCTION app_private.photos_likes_recalculate_count_on_delete() FROM PUBLIC;


--
-- Name: FUNCTION photos_likes_recalculate_count_on_insert(); Type: ACL; Schema: app_private; Owner: -
--

REVOKE ALL ON FUNCTION app_private.photos_likes_recalculate_count_on_insert() FROM PUBLIC;


--
-- Name: FUNCTION photos_likes_recalculate_count_on_update(); Type: ACL; Schema: app_private; Owner: -
--

REVOKE ALL ON FUNCTION app_private.photos_likes_recalculate_count_on_update() FROM PUBLIC;


--
-- Name: FUNCTION set_updated_at(); Type: ACL; Schema: app_private; Owner: -
--

REVOKE ALL ON FUNCTION app_private.set_updated_at() FROM PUBLIC;


--
-- Name: FUNCTION update_comment_check(); Type: ACL; Schema: app_private; Owner: -
--

REVOKE ALL ON FUNCTION app_private.update_comment_check() FROM PUBLIC;


--
-- Name: TABLE users; Type: ACL; Schema: app_public; Owner: -
--

GRANT ALL ON TABLE app_public.users TO app_admin;
GRANT SELECT ON TABLE app_public.users TO app_anonymous;


--
-- Name: FUNCTION upsert_user(google_id character varying, google_email character varying, google_refresh_token character varying, google_picture_url character varying, google_name character varying, google_given_name character varying, google_family_name character varying, google_locale character varying, google_verified_email boolean); Type: ACL; Schema: app_private; Owner: -
--

REVOKE ALL ON FUNCTION app_private.upsert_user(google_id character varying, google_email character varying, google_refresh_token character varying, google_picture_url character varying, google_name character varying, google_given_name character varying, google_family_name character varying, google_locale character varying, google_verified_email boolean) FROM PUBLIC;


--
-- Name: FUNCTION "current_user"(); Type: ACL; Schema: app_public; Owner: -
--

REVOKE ALL ON FUNCTION app_public."current_user"() FROM PUBLIC;
GRANT ALL ON FUNCTION app_public."current_user"() TO app_anonymous;


--
-- Name: FUNCTION current_user_id(); Type: ACL; Schema: app_public; Owner: -
--

REVOKE ALL ON FUNCTION app_public.current_user_id() FROM PUBLIC;
GRANT ALL ON FUNCTION app_public.current_user_id() TO app_anonymous;


--
-- Name: FUNCTION delete_old_session(); Type: ACL; Schema: app_public; Owner: -
--

REVOKE ALL ON FUNCTION app_public.delete_old_session() FROM PUBLIC;
GRANT ALL ON FUNCTION app_public.delete_old_session() TO app_anonymous;


--
-- Name: FUNCTION drop_all_policies(table_name_in text, schema_name_in text); Type: ACL; Schema: app_public; Owner: -
--

REVOKE ALL ON FUNCTION app_public.drop_all_policies(table_name_in text, schema_name_in text) FROM PUBLIC;
GRANT ALL ON FUNCTION app_public.drop_all_policies(table_name_in text, schema_name_in text) TO app_anonymous;


--
-- Name: TABLE locations; Type: ACL; Schema: app_public; Owner: -
--

GRANT ALL ON TABLE app_public.locations TO app_admin;
GRANT SELECT ON TABLE app_public.locations TO app_anonymous;


--
-- Name: FUNCTION locations_by_distance(lat double precision, lng double precision); Type: ACL; Schema: app_public; Owner: -
--

REVOKE ALL ON FUNCTION app_public.locations_by_distance(lat double precision, lng double precision) FROM PUBLIC;
GRANT ALL ON FUNCTION app_public.locations_by_distance(lat double precision, lng double precision) TO app_anonymous;


--
-- Name: TABLE photos_likes; Type: ACL; Schema: app_public; Owner: -
--

GRANT ALL ON TABLE app_public.photos_likes TO app_admin;
GRANT SELECT ON TABLE app_public.photos_likes TO app_anonymous;


--
-- Name: COLUMN photos_likes.photo_id; Type: ACL; Schema: app_public; Owner: -
--

GRANT INSERT(photo_id) ON TABLE app_public.photos_likes TO app_user;


--
-- Name: COLUMN photos_likes.count; Type: ACL; Schema: app_public; Owner: -
--

GRANT INSERT(count),UPDATE(count) ON TABLE app_public.photos_likes TO app_user;


--
-- Name: FUNCTION upsert_photo_like(photoid integer, count integer); Type: ACL; Schema: app_public; Owner: -
--

REVOKE ALL ON FUNCTION app_public.upsert_photo_like(photoid integer, count integer) FROM PUBLIC;
GRANT ALL ON FUNCTION app_public.upsert_photo_like(photoid integer, count integer) TO app_anonymous;


--
-- Name: SEQUENCE user_data_id_seq; Type: ACL; Schema: app_hidden; Owner: -
--

GRANT SELECT,USAGE ON SEQUENCE app_hidden.user_data_id_seq TO app_anonymous;


--
-- Name: TABLE comments; Type: ACL; Schema: app_public; Owner: -
--

GRANT ALL ON TABLE app_public.comments TO app_admin;
GRANT SELECT ON TABLE app_public.comments TO app_anonymous;


--
-- Name: COLUMN comments.body; Type: ACL; Schema: app_public; Owner: -
--

GRANT INSERT(body),UPDATE(body) ON TABLE app_public.comments TO app_user;


--
-- Name: COLUMN comments.photo_id; Type: ACL; Schema: app_public; Owner: -
--

GRANT INSERT(photo_id) ON TABLE app_public.comments TO app_user;


--
-- Name: COLUMN comments.is_archived; Type: ACL; Schema: app_public; Owner: -
--

GRANT UPDATE(is_archived) ON TABLE app_public.comments TO app_user;


--
-- Name: SEQUENCE comments_id_seq; Type: ACL; Schema: app_public; Owner: -
--

GRANT SELECT,USAGE ON SEQUENCE app_public.comments_id_seq TO app_anonymous;


--
-- Name: TABLE images; Type: ACL; Schema: app_public; Owner: -
--

GRANT ALL ON TABLE app_public.images TO app_admin;
GRANT SELECT ON TABLE app_public.images TO app_anonymous;


--
-- Name: COLUMN images.is_uploaded; Type: ACL; Schema: app_public; Owner: -
--

GRANT UPDATE(is_uploaded) ON TABLE app_public.images TO app_user;


--
-- Name: SEQUENCE images_id_seq; Type: ACL; Schema: app_public; Owner: -
--

GRANT SELECT,USAGE ON SEQUENCE app_public.images_id_seq TO app_anonymous;


--
-- Name: SEQUENCE locations_id_seq; Type: ACL; Schema: app_public; Owner: -
--

GRANT SELECT,USAGE ON SEQUENCE app_public.locations_id_seq TO app_anonymous;


--
-- Name: TABLE photos; Type: ACL; Schema: app_public; Owner: -
--

GRANT ALL ON TABLE app_public.photos TO app_admin;
GRANT SELECT ON TABLE app_public.photos TO app_anonymous;
GRANT INSERT ON TABLE app_public.photos TO app_user;


--
-- Name: SEQUENCE photos_id_seq; Type: ACL; Schema: app_public; Owner: -
--

GRANT SELECT,USAGE ON SEQUENCE app_public.photos_id_seq TO app_anonymous;


--
-- Name: SEQUENCE photos_likes_id_seq; Type: ACL; Schema: app_public; Owner: -
--

GRANT SELECT,USAGE ON SEQUENCE app_public.photos_likes_id_seq TO app_anonymous;


--
-- Name: SEQUENCE users_id_seq; Type: ACL; Schema: app_public; Owner: -
--

GRANT SELECT,USAGE ON SEQUENCE app_public.users_id_seq TO app_anonymous;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: app_hidden; Owner: -
--

ALTER DEFAULT PRIVILEGES FOR ROLE app_postgraphile IN SCHEMA app_hidden GRANT SELECT,USAGE ON SEQUENCES  TO app_anonymous;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: app_hidden; Owner: -
--

ALTER DEFAULT PRIVILEGES FOR ROLE app_postgraphile IN SCHEMA app_hidden GRANT ALL ON FUNCTIONS  TO app_anonymous;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: app_public; Owner: -
--

ALTER DEFAULT PRIVILEGES FOR ROLE app_postgraphile IN SCHEMA app_public GRANT SELECT,USAGE ON SEQUENCES  TO app_anonymous;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: app_public; Owner: -
--

ALTER DEFAULT PRIVILEGES FOR ROLE app_postgraphile IN SCHEMA app_public GRANT ALL ON FUNCTIONS  TO app_anonymous;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: -
--

ALTER DEFAULT PRIVILEGES FOR ROLE app_postgraphile IN SCHEMA public GRANT SELECT,USAGE ON SEQUENCES  TO app_anonymous;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: -
--

ALTER DEFAULT PRIVILEGES FOR ROLE app_postgraphile IN SCHEMA public GRANT ALL ON FUNCTIONS  TO app_anonymous;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: -; Owner: -
--

ALTER DEFAULT PRIVILEGES FOR ROLE app_postgraphile REVOKE ALL ON FUNCTIONS  FROM PUBLIC;


--
-- Name: postgraphile_watch_ddl; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER postgraphile_watch_ddl ON ddl_command_end
         WHEN TAG IN ('ALTER AGGREGATE', 'ALTER DOMAIN', 'ALTER EXTENSION', 'ALTER FOREIGN TABLE', 'ALTER FUNCTION', 'ALTER POLICY', 'ALTER SCHEMA', 'ALTER TABLE', 'ALTER TYPE', 'ALTER VIEW', 'COMMENT', 'CREATE AGGREGATE', 'CREATE DOMAIN', 'CREATE EXTENSION', 'CREATE FOREIGN TABLE', 'CREATE FUNCTION', 'CREATE INDEX', 'CREATE POLICY', 'CREATE RULE', 'CREATE SCHEMA', 'CREATE TABLE', 'CREATE TABLE AS', 'CREATE VIEW', 'DROP AGGREGATE', 'DROP DOMAIN', 'DROP EXTENSION', 'DROP FOREIGN TABLE', 'DROP FUNCTION', 'DROP INDEX', 'DROP OWNED', 'DROP POLICY', 'DROP RULE', 'DROP SCHEMA', 'DROP TABLE', 'DROP TYPE', 'DROP VIEW', 'GRANT', 'REVOKE', 'SELECT INTO')
   EXECUTE FUNCTION postgraphile_watch.notify_watchers_ddl();


--
-- Name: postgraphile_watch_drop; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER postgraphile_watch_drop ON sql_drop
   EXECUTE FUNCTION postgraphile_watch.notify_watchers_drop();


--
-- PostgreSQL database dump complete
--

