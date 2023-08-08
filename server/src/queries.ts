import { gql, makeExtendSchemaPlugin } from 'graphile-utils';

export const locationBySlugQuery = makeExtendSchemaPlugin((build) => {
  const { pgSql: sql } = build;

  return {
    typeDefs: gql`
      extend type Query {
        locationBySlug(slug: String!): Location @pgField
      }
    `,
    resolvers: {
      Query: {
        locationBySlug: async (_query, args, _context, resolveInfo) => {
          const rows = await resolveInfo.graphile.selectGraphQLResultFromTable(
            sql.fragment`app_public.locations`,
            (tableAlias, queryBuilder) => {
              queryBuilder.where(sql.fragment`${tableAlias}.slug = ${sql.value(args.slug)}`);
              queryBuilder.limit(1);
            },
          );

          return rows[0];
        },
      },
    },
  };
});
