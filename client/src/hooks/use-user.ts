import { useApolloClient, useMutation, useSuspenseQuery } from '@apollo/client';
import React, { useCallback } from 'react';
import { graphql } from '../__generated__/gql.ts';
import { resetToken } from '../apollo-client.ts';
import { CurrentUserQueryQuery } from '../__generated__/graphql.ts';

const currentUserQuery = graphql(`
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

const logoutMutation = graphql(`
  mutation LogoutMutation {
    logout(input: { fromCookie: true })
  }
`);

export const useCurrentUser = (): [
  CurrentUserQueryQuery['currentUser'] | null,
  {
    refetch: () => Promise<void>;
  },
] => {
  const client = useApolloClient();
  const { data } = useSuspenseQuery(currentUserQuery, {
    fetchPolicy: 'cache-and-network',
  });

  // refetch from suspenseQuery is not a promise
  const refetch = useCallback(async () => {
    await client.refetchQueries({
      include: [currentUserQuery],
    });
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
  const [loading, setLoading] = React.useState(false);

  const logoutFunc = React.useCallback(async () => {
    setLoading(true);
    try {
      await logout();
      resetToken();
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
