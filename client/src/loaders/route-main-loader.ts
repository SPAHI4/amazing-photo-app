import { apolloClient } from '../apollo-client.ts';
import { graphql } from '../__generated__/gql.ts';

export const ROUTE_MAIN_QUERY = graphql(`
  query RouteMainQuery {
    locations {
      nodes {
        id
        name
        slug
        description
        geo {
          x
          y
        }
      }
    }
  }
`);

export const routeMainLoader = () =>
  apolloClient.query({
    query: ROUTE_MAIN_QUERY,
  });
