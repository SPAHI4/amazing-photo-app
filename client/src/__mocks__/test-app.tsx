import {
  Experimental_CssVarsProvider as CssVarsProvider,
  StyledEngineProvider,
} from '@mui/material/styles';
import React, { useMemo } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { CursorProvider } from '../ui-components/cursor.tsx';

interface TestAppProps {
  children: React.ReactNode;
}

export function TestApp({ children }: TestAppProps) {
  const router = useMemo(
    () =>
      createBrowserRouter([
        {
          path: '*',
          element: children,
        },
      ]),
    [children],
  );

  return (
    <StyledEngineProvider>
      <CssVarsProvider>
        <CursorProvider>
          <RouterProvider router={router} />
        </CursorProvider>
      </CssVarsProvider>
    </StyledEngineProvider>
  );
}
