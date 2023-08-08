import React, { createContext } from 'react';

// separate file for HMR support
export interface CursorContextValue {
  lockCursor: () => void;
  unlockCursor: (args: { shouldAnimateRect?: boolean }) => void;
  resetCursor: () => void;
  cursorRef: React.RefObject<HTMLElement>;
  cursorEnabled: boolean;
}
export const CursorContext = createContext<CursorContextValue | null>(null);
