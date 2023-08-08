import React, { useEffect } from 'react';
import { rootElement } from '../main.tsx';

export const useMutationObserver = (
  mutationCallback: MutationCallback,
  ref?: React.RefObject<HTMLElement>,
): void => {
  const target = ref?.current ?? rootElement;

  useEffect(() => {
    const observer = new MutationObserver(mutationCallback);

    if (target != null) {
      observer.observe(target, {
        childList: true,
        subtree: true,
      });
    }

    return () => {
      observer.disconnect();
    };
  }, [mutationCallback, target]);
};
