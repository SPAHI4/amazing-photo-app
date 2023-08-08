import { useCallback, useRef } from 'react';

export const useSafeTimeout = (): [(callback: () => void, timeout: number) => void, () => void] => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const clear = useCallback(() => {
    if (timeoutRef.current != null) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  const set = useCallback(
    (callback: () => void, timeout: number) => {
      clear();
      timeoutRef.current = setTimeout(callback, timeout);
    },
    [clear],
  );

  return [set, clear];
};
