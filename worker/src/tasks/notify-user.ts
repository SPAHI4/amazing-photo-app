import { Task } from 'graphile-worker';
import { UserEmailSender } from '../user-email-sender.ts';
import { ImageSource } from './convert-image.ts';
import { EmailNotifyUser } from '../emails/notify-user/email-notify-user.tsx';

interface NotifyUserPayload {
  user_id: number;
}

export interface DbPhotosLikes {
  id: number;
  sources: ImageSource[];
  likes_count: number;
  slug: string;
  s3_bucket: string;
  location_slug: string;
}

export interface DbPhotosComments {
  id: number;
  sources: ImageSource[];
  comments_count: number;
  s3_bucket: string;
  location_slug: string;
}

export const notifyUserTask: Task = async (inPayload, { query, logger }) => {
  const payload = inPayload as NotifyUserPayload;

  const { rows: photosLikedSince } = await query<DbPhotosLikes>(
    `
      select distinct on (p.id)
          pl.photo_id as id,
          count(pl.*) as likes_count,
          l.slug,
          json_array_element (array_to_json(i.sources), 0) as sources,
          i.s3_bucket as s3_bucket,
          l.slug as location_slug
      from
          app_public.photos_likes pl
          join app_public.photos p on p.id = pl.photo_id
          join app_public.locations l on l.id = p.location_id
          join app_public.images i on i.id = p.image_id
          join app_public.users u on u.id = p.author_id
          join app_private.user_data ud on ud.user_id = u.id
      where
          u.id = $1
          and pl.created_at > coalesce(ud.notified_at, '1970-01-01'::timestamp with time zone)
          and p.is_archived = false
      group by
          pl.photo_id,
          p.id,
          l.slug,
          i.s3_bucket,
          i.sources
`,
    [payload.user_id],
  );

  const { rows: photosCommentedSince } = await query<DbPhotosComments>(
    `
      select distinct on (p.id)
          c.photo_id as id,
          count(c.*) as comments_count,
          l.slug,
          json_array_element (array_to_json(i.sources), 0) as sources,
          i.s3_bucket as s3_bucket,
          l.slug as location_slug
      from
          app_public.comments c
          join app_public.photos p on p.id = c.photo_id
          join app_public.locations l on l.id = p.location_id
          join app_public.images i on i.id = p.image_id
          join app_public.users u on u.id = p.author_id
          join app_private.user_data ud on ud.user_id = u.id
      where
          u.id = $1
          and c.created_at > coalesce(ud.notified_at, '1970-01-01'::timestamp with time zone)
          and p.is_archived = false
      group by
          c.photo_id,
          p.id,
          i.sources,
          l.slug,
          i.s3_bucket
`,
    [payload.user_id],
  );

  if (photosLikedSince.length === 0 && photosCommentedSince.length === 0) {
    return;
  }

  const emailSender = new UserEmailSender({
    query,
    logger,
  });

  await emailSender.setUserId(payload.user_id).send(EmailNotifyUser, {
    photosLikedSince,
    photosCommentedSince,
  });

  await query(
    `
update
    app_private.user_data
set
    notified_at = now()
where
    user_id = $1
`,
    [payload.user_id],
  );
};
