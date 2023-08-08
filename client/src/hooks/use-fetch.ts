import { useRef, useReducer, useCallback } from 'react';

type FetchState<TData> = {
  data: TData | null | unknown;
  error: string | null;
  loading: boolean;
  abort: () => void;
};

type FetchAction<TData> =
  | { type: 'LOADING' }
  | { type: 'SUCCESS'; data: TData | null }
  | { type: 'FAILURE'; error: string }
  | { type: 'ABORT' };

function fetchReducer<TData>(state: Omit<FetchState<TData>, 'abort'>, action: FetchAction<TData>) {
  switch (action.type) {
    case 'LOADING':
      return { ...state, loading: true };
    case 'SUCCESS':
      return { data: action.data, error: null, loading: false };
    case 'FAILURE':
      return { data: null, error: action.error, loading: false };
    case 'ABORT':
      return { data: null, error: null, loading: false };
    default:
      throw new Error();
  }
}

export function useFetch<TData>(
  baseOptions: RequestInit = {},
  json: boolean = true,
): [(url: RequestInfo | URL, options?: RequestInit) => Promise<TData | null>, FetchState<TData>] {
  const active = useRef(true);
  const abortCtrl = useRef(new AbortController());
  const initialState: Omit<FetchState<TData>, 'abort'> = {
    data: null,
    error: null,
    loading: false,
  };

  const [state, dispatch] = useReducer(fetchReducer, initialState);

  const abortFn = useCallback(() => {
    abortCtrl.current.abort();
    abortCtrl.current = new AbortController();
    dispatch({ type: 'ABORT' });
  }, [dispatch]);

  const fetchFunc = async (
    url: RequestInfo | URL,
    options?: RequestInit,
  ): Promise<TData | null> => {
    if (active.current) {
      abortFn();
    }

    let data: TData | null = null;

    dispatch({ type: 'LOADING' });

    try {
      active.current = true;
      const res = await fetch(url, {
        ...baseOptions,
        ...options,
        signal: abortCtrl.current.signal,
      });

      if (!res.ok) {
        throw new Error(`HTTP error, status = ${res.status}`);
      }

      if (json) {
        if (res.headers.get('content-type') !== 'application/json') {
          throw new Error('Invalid content type');
        }

        data = (await res.json()) as TData;
      } else {
        data = (await res.text()) as TData;
      }

      dispatch({ type: 'SUCCESS', data });
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') {
        return null;
      }

      if (active.current) {
        dispatch({ type: 'FAILURE', error: String(err) });
      }

      throw err;
    } finally {
      active.current = false;
    }

    return data;
  };

  return [
    fetchFunc,
    {
      loading: state.loading,
      data: state.data,
      error: state.error,
      abort: abortFn,
    },
  ];
}
