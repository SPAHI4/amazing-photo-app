import { LoaderFunctionArgs } from 'react-router-dom';
import { graphql } from '../__generated__/gql.ts';
import { apolloClient } from '../apollo-client.ts';

export const ROUTE_LOCATION_QUERY = graphql(`
  query LocationQuery($slug: String!, $after: Cursor, $first: Int!) {
    location: locationBySlug(slug: $slug) {
      id
      name
      slug
      description
      photos(orderBy: [CREATED_AT_DESC], after: $after, first: $first)
        @connection(key: "RouteLocation_photos", filter: [$slug]) {
        totalCount
        pageInfo {
          hasNextPage
          startCursor
          endCursor
        }
        edges {
          cursor
          node {
            ...RoutePhoto_EssentialsFragment
            ...PhotoCard_photo @nonreactive
            id
            width
            height
            blurhash
            thumbnail
            image {
              s3Bucket
              sources {
                type
                s3Key
                size
              }
            }
          }
        }
      }
    }
  }
`);

export const routeLocationLoader = ({ params }: LoaderFunctionArgs) =>
  apolloClient.query({
    query: ROUTE_LOCATION_QUERY,
    variables: {
      slug: params.slug ?? '',
      after: null,
      first: 20,
    },
  });
