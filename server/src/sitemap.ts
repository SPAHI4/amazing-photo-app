import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { SitemapStream, streamToPromise } from 'sitemap';
import { env } from '@app/config/env.ts';
import { PgClient } from './pg-client.ts';

const staticUrls = [{ url: '/legal', changefreq: 'monthly', priority: 0.9 }];

let sitemap: Buffer | null = null;

type DbPhotoRow = {
  id: number;
  slug: string;
};

const getPhotosUrls = async (pgClient: PgClient) => {
  const { rows } = await pgClient.query<DbPhotoRow>(
    `
      select
          photos.id,
          locations.slug
      from
          app_public.photos photos
          join app_public.locations locations on locations.id = photos.location_id
      where
          photos.is_archived = false
      `,
  );

  return rows.map(({ id, slug }) => ({
    url: `/location/${slug}/${id}`,
    changefreq: 'daily',
    priority: 0.9,
  }));
};

const getLocationsUrls = async (pgClient: PgClient) => {
  const { rows } = await pgClient.query<{ slug: string }>(
    `
      select
          slug
      from
          app_public.locations
      where
          is_archived = false
      `,
  );

  return rows.map(({ slug }) => ({
    url: `/location/${slug}`,
    changefreq: 'monthly',
    priority: 0.9,
  }));
};

let lastSitemapUpdate = 0;

export const appSitemap: FastifyPluginAsync = async (app: FastifyInstance) => {
  app.get('/sitemap.xml', async (_req, reply) => {
    reply.type('application/xml');

    // later smart update could be implemented with XMLToSitemapItemStream
    const shouldUpdateSitemap = Date.now() - lastSitemapUpdate > 1000 * 60 * 60 * 1;
    if (sitemap != null && !shouldUpdateSitemap) {
      reply.send(sitemap);
    } else {
      // eslint-disable-next-line
      await using pgClient = new PgClient(app.log);

      const stream = new SitemapStream({
        hostname: env.WEB_ORIGIN,
      });

      stream.pipe(reply.raw);

      streamToPromise(stream).then((data) => {
        sitemap = data;
      });

      staticUrls.forEach((url) => stream.write(url));

      const locationsUrls = await getLocationsUrls(pgClient);
      locationsUrls.forEach((url) => stream.write(url));

      const photosUrls = await getPhotosUrls(pgClient);
      photosUrls.forEach((url) => stream.write(url));

      lastSitemapUpdate = Date.now();

      stream.end();
    }
  });
};
