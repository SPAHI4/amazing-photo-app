--! Previous: sha1:ddf5d5abe885a02bd870efbac509508ad86d7c5d
--! Hash: sha1:34060d257314add287a5c9f7713695781036bb55

-- users can't update likes_count
comment on column app_public.photos.likes_count is '@omit update';
