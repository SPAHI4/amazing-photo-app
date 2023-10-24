import { Box, CircularProgress } from '@mui/material';
import { css } from '@emotion/react';
import { useEffect, useRef } from 'react';
import { useIntersection } from 'react-use/esm';
import { useThrottledValue } from '../hooks/use-throttle.ts';

interface LoadMoreContainerProps {
  loading: boolean;
  onLoadMore: () => void;
}

export function LoadMoreContainer({ loading, onLoadMore }: LoadMoreContainerProps) {
  const intersectionRef = useRef<HTMLDivElement>(null);
  const intersection = useIntersection(intersectionRef, {
    root: null,
    rootMargin: '0px',
    threshold: 1,
  });
  // don't show loading indicator for the first 100ms
  const loadingThrottled = useThrottledValue(loading, 100);

  useEffect(() => {
    if (intersection?.isIntersecting === true) {
      onLoadMore();
    }
  }, [intersection?.isIntersecting, onLoadMore]);

  return (
    <Box
      ref={intersectionRef}
      css={css`
        display: grid;
        place-items: center;
        height: 120px;
      `}
    >
      {
        // always hide if loading is false, but show with delay
        loading && loadingThrottled && <CircularProgress data-testid="loading" />
      }
    </Box>
  );
}
