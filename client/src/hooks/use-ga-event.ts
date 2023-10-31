import { useCallback } from 'react';

export type GaEvent = 'click';

export const useGaEvent = () => {
  const gaEvent = useCallback((event: GaEvent, params: Record<string, string>) => {
    if (import.meta.env.DEV) {
      console.log('gaEvent', event, params);
      return;
    }

    window.gtag?.('event', event, params);
  }, []);

  return gaEvent;
};
