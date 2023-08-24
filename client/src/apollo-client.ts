import {
  ApolloClient,
  ApolloError,
  ApolloLink,
  defaultDataIdFromObject,
  FetchResult,
  fromPromise,
  HttpLink,
  InMemoryCache,
  NextLink,
  Observer,
  Operation,
  ServerError,
  ServerParseError,
} from '@apollo/client';
import { createPersistedQueryLink } from '@apollo/client/link/persisted-queries';
import { setContext } from '@apollo/client/link/context';
import { Observable, relayStylePagination } from '@apollo/client/utilities';
import { onError } from '@apollo/client/link/error';
import decode from 'jwt-decode';
import { OperationQueuing } from 'apollo-link-token-refresh';
import { TypePolicies } from '@apollo/client/cache/inmemory/policies';
import { mergeDeep } from '@apollo/client/utilities/common/mergeDeep';
import { NetworkError } from '@apollo/client/errors';
import { GraphQLError } from 'graphql/error';
import { graphql } from './__generated__';
import { scalarTypePolicies } from './__generated__/graphql-types.ts';

if (import.meta.env.DEV) {
  const { loadErrorMessages, loadDevMessages } = await import('@apollo/client/dev');

  loadDevMessages();
  loadErrorMessages();
}

let accessToken: string | null = null;
let fetchedOnInit = false;

export const setAccessToken = (token: string) => {
  accessToken = token;
};

export const resetToken = async () => {
  accessToken = null;
  fetchedOnInit = false;
};

const httpLink: ApolloLink = new HttpLink({
  uri: import.meta.env.VITE_GRAPHQL_ENDPOINT,
  credentials: 'include',
});

const authLink = setContext(async (_operation, { headers }) => {
  if (accessToken == null) {
    return { headers };
  }

  return {
    headers: {
      ...headers,
      Authorization: `Bearer ${accessToken}`,
    },
  };
});

const GET_ACCESS_TOKEN_MUTATION = graphql(`
  mutation GetAccessToken {
    getAccessToken(input: { fromCookie: true }) {
      accessToken
    }
  }
`);

const fetchAccessToken = async () => {
  try {
    const res = await fetch(import.meta.env.VITE_GRAPHQL_ENDPOINT, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        extensions: {
          persistedQuery: {
            version: 1,
            // eslint-disable-next-line no-underscore-dangle
            sha256Hash: (GET_ACCESS_TOKEN_MUTATION as unknown as { __meta__: { hash: string } })
              .__meta__.hash,
          },
        },
      }),
    });

    const { data } = await res.json();

    fetchedOnInit = true;
    accessToken = data?.getAccessToken?.accessToken ?? null;
  } catch (err) {
    throw new ApolloError({
      errorMessage: 'Failed to fetch access token',
      networkError: err as Error,
    });
  }
};

const shouldUseToken = (operation: Operation) => {
  if (operation.operationName === 'loginWithGoogle') {
    return false;
  }

  if (!fetchedOnInit) {
    return true;
  }

  return accessToken != null;
};

const isTokenExpired = () => {
  if (accessToken == null) return true;

  try {
    const decoded = decode(accessToken) as { exp: number };
    return decoded.exp < Date.now() / 1000;
  } catch (err) {
    return false;
  }
};

class TokenLink extends ApolloLink {
  private queue: OperationQueuing = new OperationQueuing();

  private fetching = false;

  public request(operation: Operation, forward: NextLink): Observable<FetchResult> | null {
    return fromPromise(
      (async () => {
        if (!isTokenExpired()) {
          return forward(operation);
        }

        if (!this.fetching) {
          (async () => {
            this.fetching = true;

            try {
              await fetchAccessToken();
            } catch (err) {
              this.queue.queuedRequests.forEach((request) => {
                request.error?.(err as Error);
              });
            }

            this.fetching = false;
            this.queue.consumeQueue();
          })();
        }

        return this.queue.enqueueRequest({ operation, forward });
      })(),
    ).flatMap((x) => x);
  }
}

// errors subscriber to receive all errors during the request to get then in ui, used later in errorLink

let graphqlErrorsObserver: Observer<
  Error[] | [ServerParseError] | [ServerError] | GraphQLError[] | [NetworkError]
> = {
  next: () => {},
  error: () => {},
  complete: () => {},
};

export const graphqlErrorsObservable = new Observable<
  Error[] | [ServerParseError] | [ServerError] | GraphQLError[] | [NetworkError]
>((observer) => {
  const subscriber = {
    next: observer.next.bind(observer),
    error: observer.error.bind(observer),
    complete: observer.complete.bind(observer),
  };

  graphqlErrorsObserver = subscriber;
});

const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors != null) {
    for (const error of graphQLErrors) {
      if ('extensions' in error) {
        if (error.extensions.code === 'TOKEN_INVALID') {
          accessToken = null;
        }

        if (error.extensions.code === 'TOKEN_EXPIRED') {
          return new Observable((observer) => {
            (async () => {
              const subscriber = {
                next: observer.next.bind(observer),
                error: observer.error.bind(observer),
                complete: observer.complete.bind(observer),
              };

              try {
                await fetchAccessToken();
              } catch (err) {
                observer.error(err);
              }

              forward(operation).subscribe(subscriber);
            })().catch((err) => observer.error(err));
          });
        }
      }

      console.error(`[GraphQL error]: ${error.message}`);
    }
  }

  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
  }

  graphqlErrorsObserver.next?.([
    ...(graphQLErrors ?? []),
    ...(networkError != null ? [networkError] : []),
  ]);

  return forward(operation);
});

const typePolicies: TypePolicies = {
  Location: {
    fields: {
      photos: relayStylePagination(['type', '@connection', ['key', 'filter']]),
    },
  },
  Query: {
    fields: {
      comments: relayStylePagination(['type', '@connection', ['key', 'filter']]),
      locationBySlug: {
        read(_, { args, toReference }) {
          return toReference({
            __typename: 'Location',
            slug: args?.slug,
          });
        },
      },
      photo: {
        read(_, { args, toReference }) {
          return toReference({
            __typename: 'Photo',
            id: args?.id,
          });
        },
      },
    },
  },
};

const cache = new InMemoryCache({
  dataIdFromObject: (object: { __typename?: string; slug?: string; id?: string | number }) => {
    // cache location by slug as we use it in the url
    if (object.__typename === 'Location' && object.slug != null) {
      return `Location:${object.slug}`;
    }

    return defaultDataIdFromObject(object);
  },
  typePolicies: mergeDeep(typePolicies, scalarTypePolicies),
});

const persistedQueryLink = createPersistedQueryLink({
  generateHash: (document) =>
    // eslint-disable-next-line no-underscore-dangle
    Promise.resolve((document as unknown as { __meta__: { hash: string } }).__meta__.hash),
});

const baseLinkChain = ApolloLink.from([persistedQueryLink, httpLink]);

export const apolloClient = new ApolloClient({
  link: ApolloLink.split(
    shouldUseToken,
    ApolloLink.from([new TokenLink(), errorLink, authLink, baseLinkChain]),
    baseLinkChain,
  ),
  cache,
});
