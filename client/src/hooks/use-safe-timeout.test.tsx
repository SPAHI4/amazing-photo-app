import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, expect } from '@jest/globals';
import { useSafeTimeout } from './use-safe-timeout.ts';

describe('useSafeTimeout', () => {
  const { result } = renderHook(() => useSafeTimeout());
  const [setSafeTimeout, clearSafeTimeout] = result.current;

  let value = 0;

  it('should execute timer', async () => {
    act(() => {
      setSafeTimeout(() => {
        value = 1;
      }, 100);
    });

    await waitFor(
      () => {
        expect(value).toBe(1);
      },
      { timeout: 200 },
    );
  });

  it('should not execute timer too early', async () => {
    act(() => {
      setSafeTimeout(() => {
        value = 2;
      }, 200);
    });

    await waitFor(
      () => {
        expect(value).toBe(1);
      },
      { timeout: 100 },
    );
  });

  it('should correctly clear a timer', async () => {
    act(() => {
      setSafeTimeout(() => {
        value = 2;
      }, 100);
    });

    act(() => {
      clearSafeTimeout();
    });

    await waitFor(
      () => {
        expect(value).toBe(1);
      },
      { timeout: 200 },
    );
  });
});
