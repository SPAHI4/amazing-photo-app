import { useEffect, useState } from 'react';
import { useMediaQuery } from '@mui/material';

let avifSupportedVal: boolean | null = null;
let webpSupportedVal: boolean | null = null;

export const useBrowserFeatures = (): {
  avifSupported: boolean;
  webpSupported: boolean;
  hdrSupported: boolean;
  isChromuimBased: boolean;
} => {
  const [avifSupported, setAvifSupported] = useState<boolean>(avifSupportedVal === true);
  const [webpSupported, setWebpSupported] = useState<boolean>(webpSupportedVal === true);
  const hdrSupported = useMediaQuery('(dynamic-range: high)');

  const isFirefox = navigator.userAgent.toLowerCase().includes('firefox');
  const isChromuimBased = navigator.userAgent.toLowerCase().includes('chrome');

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
  }, [isFirefox]);

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

  return {
    avifSupported,
    webpSupported,
    hdrSupported,
    isChromuimBased,
  };
};
