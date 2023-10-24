import { render, fireEvent, act } from '@testing-library/react';
import { jest } from '@jest/globals';

// mock useNavigation
jest.unstable_mockModule('react-router-dom', () => ({
  ...(jest.requireActual('react-router-dom') as typeof import('react-router-dom')),
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
}));

// mock useColorScheme
jest.unstable_mockModule('@mui/material/styles', () => ({
  ...(jest.requireActual('@mui/material/styles') as typeof import('@mui/material/styles')),
  useColorScheme: jest.fn(),
}));

const { useColorScheme } = await import('@mui/material/styles');
const { ThemeChangeButton } = await import('./theme-change-button.tsx');
const { TestApp } = await import('../__mocks__/test-app.tsx');

describe('ThemeChangeButton', () => {
  let mockStartViewTransition: jest.Mock;
  let mockAnimate: jest.Mock;
  let mockSetMode: jest.Mock;

  beforeEach(() => {
    document.documentElement.className = '';
    mockStartViewTransition = jest.fn().mockImplementation((callback) => {
      (callback as () => void)();

      return {
        ready: Promise.resolve(),
      };
    });

    document.startViewTransition =
      mockStartViewTransition as unknown as typeof document.startViewTransition;

    mockAnimate = jest.fn().mockImplementation(() => ({
      finished: Promise.resolve(),
    }));

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (Element.prototype.animate == null) {
      Object.defineProperty(Element.prototype, 'animate', {
        configurable: true,
        value: mockAnimate,
      });
    }

    mockSetMode = jest.fn();
    (useColorScheme as jest.Mock).mockReturnValue({
      mode: 'light',
      setMode: mockSetMode,
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should add and remove view-transition-lock class', async () => {
    const { getByRole } = render(<ThemeChangeButton />, {
      wrapper: TestApp,
    });
    const button = getByRole('button');

    await act(async () => {
      fireEvent.click(button);
      expect(document.documentElement.classList.contains('view-transition-lock')).toBe(true);
    });
    expect(mockStartViewTransition).toHaveBeenCalled();

    expect(document.documentElement.classList.contains('view-transition-lock')).toBe(false);
  });

  it('should toggle mode', async () => {
    const { getByRole } = render(<ThemeChangeButton />, {
      wrapper: TestApp,
    });

    const button = getByRole('button');

    await act(async () => {
      fireEvent.click(button);
    });

    expect(mockSetMode).toHaveBeenCalledWith('dark');
  });
});
