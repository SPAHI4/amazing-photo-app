import createGlobe from 'cobe';
import React from 'react';
import { css } from '@emotion/react';
import { useWindowSize } from 'react-use/esm';
import { useColorScheme } from '@mui/material';

type Point = {
  lat: number;
  lng: number;
};

type MainGlobeProps = {
  currentLocation: Point | null;
  locations: Point[];
};

export function Globe({ locations, currentLocation }: MainGlobeProps) {
  const { mode } = useColorScheme();
  const ref = React.useRef<HTMLCanvasElement>(null);
  const focusRef = React.useRef<{ lat: number; lng: number } | null>(null);
  const { height: windowHeight } = useWindowSize();
  const globeHeight = windowHeight * 0.85;

  const locationToAngles = (lat: number, lng: number) => [
    Math.PI - ((lng * Math.PI) / 180 - Math.PI / 2),
    (lat * Math.PI) / 180,
  ];

  React.useEffect(() => {
    const dark = mode === 'dark' ? 1 : 0;

    let currentPhi = 0;
    let currentTheta = 0.9;
    let currentScale = 1;
    const doublePi = Math.PI * 2;
    let currentMarkerSize = 0.8;

    const globe = createGlobe(ref.current!, {
      devicePixelRatio: 2,
      width: globeHeight * 2,
      height: globeHeight * 2,
      phi: 0,
      theta: 0.3,
      dark,
      diffuse: 1.2,
      mapSamples: 20000,
      mapBrightness: 8,
      baseColor: dark ? [0.1, 0.1, 0.1] : [0.9, 0.9, 0.9],
      markerColor: [1, 0.54, 0.319],
      glowColor: dark ? [0.3, 0.3, 0.3] : [0.8, 0.8, 0.8],
      scale: 0.8,
      opacity: 0.9,
      markers: locations.map((location) => ({
        location: [location.lat, location.lng],
        size: 0.05,
      })),
      onRender: (state) => {
        /* eslint-disable no-param-reassign */

        state.phi = currentPhi;
        state.theta = currentTheta;

        state.markers = locations.map((location) => ({
          location: [location.lat, location.lng],
          size:
            location.lat === focusRef.current?.lat && location.lng === focusRef.current.lng
              ? currentMarkerSize
              : 0.08,
        }));
        state.scale = currentScale;

        if (focusRef.current == null) {
          currentPhi += 0.002;
          // currentTheta *= currentTheta * 0.98;
          currentMarkerSize = 0.5;
          currentScale = currentScale * 0.98 + 0.02;
          return;
        }

        const [focusPhi, focusTheta] = locationToAngles(focusRef.current.lat, focusRef.current.lng);
        const distPositive = (focusPhi - currentPhi + doublePi) % doublePi;
        const distNegative = (currentPhi - focusPhi + doublePi) % doublePi;
        // Control the speed
        if (distPositive < distNegative) {
          currentPhi += distPositive * 0.02 - 0.005;
        } else {
          currentPhi -= distNegative * 0.02 + 0.005;
        }
        currentTheta = currentTheta * 0.98 + focusTheta * 0.02;
        currentScale = currentScale * 0.98 + 1.1 * 0.02;
        currentMarkerSize = currentMarkerSize * 0.98 + 0.1 * 0.02;
      },
    });
    setTimeout(() => {
      ref.current!.style.opacity = '1';
    });

    return () => {
      globe.destroy();
    };
  }, [mode, globeHeight, locations]);

  React.useEffect(() => {
    focusRef.current = currentLocation;
  }, [currentLocation]);

  return (
    <canvas
      ref={ref}
      css={css`
        width: ${globeHeight}px;
        height: ${globeHeight}px;
        aspect-ratio: 1;
        opacity: 0;
        transition: opacity 0.5s ease-in-out;
      `}
    />
  );
}
