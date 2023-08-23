import { memo, useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { css } from '@emotion/react';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import { useThrottledValue } from '../hooks/use-throttle.ts';

export const MainSkeleton = memo(() => {
  const theme = useTheme();
  const [rendered, setRendered] = useState(false);
  const show = useThrottledValue(rendered, 1000);

  useEffect(() => {
    setRendered(true);
  }, []);

  return (
    <div
      css={css`
        height: 100dvh;
        display: grid;
        place-items: center;
      `}
    >
      <div
        css={css`
          height: 72px;
          width: 100%;
          position: fixed;
          top: 0;
          left: 0;
          background-color: ${theme.vars.palette.AppBar.defaultBg};
        `}
      />

      {show && (
        <>
          <Typography variant="h6">
            Actually, you should not see this because the site is very fast. Though, here we are.
          </Typography>
          <CircularProgress />
        </>
      )}
    </div>
  );
});
