import { useApolloClient, useMutation, useSuspenseQuery } from '@apollo/client/react';
import { useCallback, useState } from 'react';
import { graphql } from '../__generated__/gql.ts';
import { resetToken } from '../apollo-client.ts';
import { CurrentUserQueryQuery } from '../__generated__/graphql.ts';

export const CURRENT_USER_QUERY = graphql(`
  query CurrentUserQuery {
    currentUser {
      __typename
      id
      displayName
      pictureUrl
      role
    }
  }
`);

export const logoutMutation = graphql(`
  mutation LogoutMutation {
    logout(input: { fromCookie: true })
  }
`);

export const useCurrentUser = (): [
  CurrentUserQueryQuery['currentUser'] | null,
  {
    refetch: () => Promise<CurrentUserQueryQuery['currentUser'] | null>;
  },
] => {
  const client = useApolloClient();
  const { data } = useSuspenseQuery(CURRENT_USER_QUERY, {
    fetchPolicy: 'cache-and-network',
  });

  // refetch from suspenseQuery is not a promise
  const refetch = useCallback(async () => {
    await client.refetchQueries({
      include: [CURRENT_USER_QUERY],
      optimistic: false,
    });

    const result = client.readQuery({
      query: CURRENT_USER_QUERY,
    });

    return result?.currentUser ?? null;
  }, [client]);

  return [data.currentUser, { refetch }];
};

export const useLogout = (): [
  () => Promise<void>,
  {
    loading: boolean;
  },
] => {
  const client = useApolloClient();
  const [logout] = useMutation(logoutMutation);
  const [loading, setLoading] = useState(false);

  const logoutFunc = useCallback(async () => {
    setLoading(true);
    try {
      await logout();
      await resetToken();
      await client.clearStore();
      await client.resetStore();
    } finally {
      setLoading(false);
    }
  }, [client, logout]);

  return [
    logoutFunc,
    {
      loading,
    },
  ];
};
