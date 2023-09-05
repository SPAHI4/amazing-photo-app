--! Previous: sha1:34060d257314add287a5c9f7713695781036bb55
--! Hash: sha1:ffd3b98d0e0ff3b5f4835e39c4db45d47a53ed6c

alter table app_public.images alter column user_id drop not null;

create or replace function app_private.photos_likes_recalculate_count_on_delete() returns trigger
  security definer
  language plpgsql
as
$$
begin
  -- Use select for update to apply row level lock
  perform id from app_public.photos where id = old.photo_id for update;
  update app_public.photos
  set likes_count = likes_count - old.count
  where id = old.photo_id;
  return old;
end;
$$;

create or replace trigger _100_photos_likes_recalculate_count_on_delete
  after delete
  on app_public.photos_likes
  for each row
execute procedure app_private.photos_likes_recalculate_count_on_delete();
