--! Previous: sha1:ffd3b98d0e0ff3b5f4835e39c4db45d47a53ed6c
--! Hash: sha1:9bff7de709da07c1f0a82f040a9bb149e4a783d4

-- delete session if already exists more than 10 rows

create or replace function delete_old_session() returns trigger as $$
begin
    delete from app_private.sessions where id in (
        select id from app_private.sessions
        where user_id = new.user_id
        order by created_at desc offset 20
    );
    return null;
end;
$$ language plpgsql security definer;

drop trigger if exists _200_delete_old_session_trigger on app_private.sessions;

create trigger _200_delete_old_session_trigger after insert on app_private.sessions
    for each row execute procedure delete_old_session();
