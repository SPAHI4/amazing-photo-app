import { useCallback, useEffect, useRef, useState } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useThrottle = <T extends (...args: any) => void>(
  func: T,
  wait: number,
): [(...args: Parameters<T>) => void, () => void] => {
  const timer = useRef<number | null>(null);
  const throttle = useCallback(
    (...args: Parameters<T>) => {
      if (timer.current != null) {
        clearTimeout(timer.current);
      }

      timer.current = setTimeout(() => {
        func(...Array.from(args));
        timer.current = null;
      }, wait) as unknown as number;
    },
    [func, wait],
  );

  const cancel = useCallback(() => {
    if (timer.current != null) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  }, []);

  useEffect(
    () => () => {
      if (timer.current != null) clearTimeout(timer.current);
    },
    [],
  );

  return [throttle, cancel];
};

export const useThrottledValue = <TValue>(value: TValue, duration: number): TValue => {
  const [state, setState] = useState(value);
  const [throttledValue, cancel] = useThrottle(setState, duration);

  useEffect(() => {
    throttledValue(value);
    return cancel;
  }, [value, cancel, throttledValue]);

  return state;
};
