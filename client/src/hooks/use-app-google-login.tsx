import { ErrorCode, NonOAuthError, useGoogleLogin } from '@react-oauth/google';
import { Observer, useMutation } from '@apollo/client';
import { Observable } from '@apollo/client/utilities';
import React from 'react';
import { graphql } from '../__generated__/gql.ts';
import { resetToken, setAccessToken } from '../apollo-client.ts';
import { useCurrentUser } from './use-user.ts';

const loginWithGoogleMutation = graphql(`
  mutation LoginWithGoogle($code: String!) {
    loginWithGoogle(input: { code: $code, toCookie: true }) {
      accessToken
      refreshToken
    }
  }
`);

export type GoogleError = NonOAuthError['type'] | ErrorCode | 'unknown';

export const useAppGoogleLogin = (): [
  () => Promise<void>,
  {
    loading: boolean;
    error: GoogleError | null;
  },
] => {
  const [, { refetch }] = useCurrentUser();
  const [loading, setGoogleLoading] = React.useState(false);
  const [error, setGoogleError] = React.useState<GoogleError | null>(null);
  const [loginWithGoogle] = useMutation(loginWithGoogleMutation);
  const observerRef = React.useRef<Observer<string | null> | null>(null);

  const googleLogin = useGoogleLogin({
    onSuccess: async (data) => {
      const { code } = data;
      try {
        const response = await loginWithGoogle({
          variables: {
            code,
          },
        });

        observerRef.current?.next?.(response.data?.loginWithGoogle.accessToken);
      } catch (err) {
        setGoogleError('unknown');
        observerRef.current?.error?.(err);
      }
    },
    onError: (err) => {
      if (err.error != null) {
        setGoogleError(err.error);
      }
      observerRef.current?.error?.(err.error);
    },
    onNonOAuthError: (err) => {
      observerRef.current?.error?.(err);
    },
    flow: 'auth-code',
  });

  const login = React.useCallback(async () => {
    observerRef.current?.complete?.();

    setGoogleLoading(true);
    setGoogleError(null);

    try {
      await new Promise<void>((resolve, reject) => {
        const observable = new Observable((subscriber) => {
          observerRef.current = subscriber;
        });

        observable.subscribe({
          async next(value: string | null) {
            if (value != null) {
              resetToken();
              setAccessToken(value);
              await refetch();
              resolve();
            }
          },
          error: (err) => {
            console.error(err);
            reject(err);
          },
        });

        googleLogin();
      });
    } finally {
      setGoogleLoading(false);
    }
  }, [googleLogin, refetch]);

  return [
    login,
    {
      loading,
      error,
    },
  ];
};
