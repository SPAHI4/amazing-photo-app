import { useContext } from 'react';
import { CursorContext, CursorContextValue } from '../ui-components/cursor-context.tsx';

export const useCursor = (): CursorContextValue => {
  const context = useContext(CursorContext);

  if (context == null) {
    throw new Error('useCursor must be used within a CursorProvider');
  }

  return context;
};
