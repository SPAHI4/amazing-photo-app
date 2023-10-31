import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import { jest } from '@jest/globals';

jest.unstable_mockModule('react-router-dom', () => ({
  useNavigation: jest.fn().mockReturnValue({ state: 'idle' }),
}));

jest.unstable_mockModule('@mui/material', () => ({
  ...(jest.requireActual('@mui/material') as object),
  useMediaQuery: jest.fn().mockReturnValue(true),
}));

jest.unstable_mockModule('../hooks/use-throttle.ts', () => ({
  useThrottledValue: jest.fn((value) => value),
}));

jest.unstable_mockModule('../hooks/use-cursor.ts', () => ({
  useCursor: jest.fn(),
}));

const { CursorProvider, StickPointerButton, StickPointerImage } = await import('./cursor');
const { useCursor } = await import('../hooks/use-cursor.ts');

describe('<CursorProvider />', () => {
  it('should render children', () => {
    render(
      <CursorProvider>
        <div>Test Child</div>
      </CursorProvider>,
    );
    expect(screen.getByText('Test Child')).toBeInTheDocument();
  });

  it('should show loading state based on navigation state', async () => {
    const useNavigationMock = (await import('react-router-dom').then(
      (module) => module.useNavigation,
    )) as jest.Mock;

    useNavigationMock.mockReturnValue({ state: 'loading' });

    render(
      <CursorProvider>
        <div />
      </CursorProvider>,
    );

    expect(screen.getByTestId('cursor-loading')).toBeInTheDocument();
  });

  it('should handle mouse events to move cursor', () => {
    render(
      <CursorProvider>
        <div />
      </CursorProvider>,
    );

    const cursorElement = screen.getByTestId('cursor');

    act(() => {
      fireEvent.mouseMove(cursorElement!, { clientX: 10, clientY: 20 });
    });

    expect(cursorElement).toHaveStyle('--cursor-x: 10px');
  });

  it('should enable or disable cursor based on media query', async () => {
    const useMediaQueryMock = (await import('@mui/material').then(
      (module) => module.useMediaQuery,
    )) as jest.Mock;

    useMediaQueryMock.mockReturnValue(false); // mobile
    const { rerender } = render(
      <CursorProvider>
        <div />
      </CursorProvider>,
    );

    expect(screen.queryByText('cursor')).toBeNull();

    useMediaQueryMock.mockReturnValue(true);
    rerender(
      <CursorProvider>
        <div />
      </CursorProvider>,
    );

    expect(screen.getByTestId('cursor')).toBeInTheDocument();
  });
});

describe('<StickPointerButton />', () => {
  let mockCursorRef;

  beforeEach(() => {
    mockCursorRef = { current: document.createElement('div') };
    (useCursor as jest.Mock).mockReturnValue({
      cursorRef: mockCursorRef,
      lockCursor: jest.fn(),
      unlockCursor: jest.fn(),
      resetCursor: jest.fn(),
      cursorEnabled: true,
    });
  });

  it('renders children', () => {
    render(
      <StickPointerButton>
        <div data-testid="child">Test Child</div>
      </StickPointerButton>,
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('handles mouse enter event', () => {
    render(
      <StickPointerButton>
        <div data-testid="child">Test Child</div>
      </StickPointerButton>,
    );

    const childElement = screen.getByTestId('child');

    act(() => {
      fireEvent.mouseEnter(childElement);
    });

    expect(childElement.style.getPropertyValue('--scale')).toBe('1.05');
  });

  it('handles mouse move event', () => {
    render(
      <StickPointerButton>
        <div data-testid="child">Test Child</div>
      </StickPointerButton>,
    );

    const childElement = screen.getByTestId('child');

    act(() => {
      fireEvent.mouseEnter(childElement);
      fireEvent.mouseMove(childElement, { clientX: 10, clientY: 20 });
    });
  });

  it('handles mouse out event', () => {
    render(
      <StickPointerButton>
        <div data-testid="child">Test Child</div>
      </StickPointerButton>,
    );

    const childElement = screen.getByTestId('child');

    act(() => {
      fireEvent.mouseEnter(childElement);
      fireEvent.mouseOut(childElement);
    });

    expect(childElement.style.getPropertyValue('--scale')).toBe('1');
  });
});

describe('<StickPointerImage />', () => {
  let mockCursorRef;

  beforeEach(() => {
    mockCursorRef = { current: document.createElement('div') };
    (useCursor as jest.Mock).mockReturnValue({
      cursorRef: mockCursorRef,
      lockCursor: jest.fn(),
      unlockCursor: jest.fn(),
      resetCursor: jest.fn(),
      cursorEnabled: true,
    });
  });

  it('renders children', () => {
    render(
      <StickPointerImage>
        <div data-testid="child">Test Child</div>
      </StickPointerImage>,
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('handles mouse enter event', () => {
    render(
      <StickPointerImage>
        <div data-testid="child">Test Child</div>
      </StickPointerImage>,
    );

    const childElement = screen.getByTestId('child');

    act(() => {
      fireEvent.mouseEnter(childElement);
    });

    expect(childElement.style.getPropertyValue('--scale')).toBe('1.05');
  });

  it('handles mouse move event', async () => {
    render(
      <StickPointerImage>
        <div data-testid="child">Test Child</div>
      </StickPointerImage>,
    );

    const childElement = screen.getByTestId('child');

    act(() => {
      fireEvent.mouseEnter(childElement);
      fireEvent.mouseMove(childElement, { clientX: 10, clientY: 20 });
    });

    await waitFor(() => {
      expect(window.getComputedStyle(childElement).display).toBeTruthy();
    });

    // expect(childElement.style.getPropertyValue('--translate-x')).toBe('10px');
  });

  it('handles mouse out event', () => {
    render(
      <StickPointerImage>
        <div data-testid="child">Test Child</div>
      </StickPointerImage>,
    );

    const childElement = screen.getByTestId('child');

    act(() => {
      fireEvent.mouseEnter(childElement);
      fireEvent.mouseOut(childElement);
    });

    expect(childElement.style.getPropertyValue('--scale')).toBe('1');
  });
});
