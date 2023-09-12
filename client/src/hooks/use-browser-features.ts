import { useEffect, useState } from 'react';
import { useMediaQuery } from '@mui/material';

let avifSupportedVal: boolean | null = null;
let webpSupportedVal: boolean | null = null;

export const useBrowserFeatures = (): {
  avifSupported: boolean;
  webpSupported: boolean;
  hdrSupported: boolean;
  isChromuimBased: boolean;
  viewTransitionSupported: boolean;
} => {
  const [avifSupported, setAvifSupported] = useState<boolean>(avifSupportedVal === true);
  const [webpSupported, setWebpSupported] = useState<boolean>(webpSupportedVal === true);
  const hdrSupported = useMediaQuery('(dynamic-range: high)');

  const userAgent = navigator.userAgent.toLowerCase();

  const isFirefox = userAgent.includes('firefox');
  const isChromuimBased =
    userAgent.includes('chrome') ||
    userAgent.includes('chromium') ||
    userAgent.includes('edg') ||
    userAgent.includes('opr') ||
    userAgent.includes('crios');
  const isSafari =
    userAgent.includes('safari') && !userAgent.includes('chrome') && !userAgent.includes('crios');

  useEffect(() => {
    if (avifSupportedVal !== null) {
      return undefined;
    }

    // Firefox doesn't properly handle HDR downmix images yet
    if (isFirefox) {
      avifSupportedVal = false;
      setAvifSupported(avifSupportedVal);
      return undefined;
    }

    // I faced really bad performance issues with Safari and HDR avif images, and it doesn't even render them in HDR
    if (isSafari) {
      avifSupportedVal = false;
      setAvifSupported(avifSupportedVal);
      return undefined;
    }

    const img = new Image();
    img.onload = () => {
      avifSupportedVal = img.width > 0 && img.height > 0;
      setAvifSupported(avifSupportedVal);
    };
    img.onerror = () => {
      avifSupportedVal = false;
      setAvifSupported(avifSupportedVal);
    };
    img.src =
      'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgANogQEAwgMg8f8D///8WfhwB8+ErK42A=';

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [isFirefox, isSafari]);

  useEffect(() => {
    if (webpSupportedVal !== null) {
      return undefined;
    }

    const img = new Image();
    img.onload = () => {
      webpSupportedVal = img.width > 0 && img.height > 0;
      setWebpSupported(webpSupportedVal);
    };
    img.onerror = () => {
      webpSupportedVal = false;
      setWebpSupported(webpSupportedVal);
    };
    img.src = 'data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA=';

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, []);

  const viewTransitionSupported = 'startViewTransition' in document;

  return {
    avifSupported,
    webpSupported,
    hdrSupported,
    isChromuimBased,
    viewTransitionSupported,
  };
};
