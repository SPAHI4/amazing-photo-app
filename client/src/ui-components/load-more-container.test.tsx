import { render, screen, waitFor } from '@testing-library/react';
import { jest } from '@jest/globals';

jest.unstable_mockModule('react-use/esm', () => ({
  useIntersection: jest.fn(),
}));

const { LoadMoreContainer } = await import('./load-more-conainer.tsx');

const { useIntersection } = await import('react-use/esm');

describe('LoadMoreContainer', () => {
  it('does not render loading indicator when loading is false', () => {
    (useIntersection as jest.Mock).mockReturnValue({ isIntersecting: true });

    render(<LoadMoreContainer loading={false} onLoadMore={() => {}} />);
    const loadingIndicator = screen.queryByTestId('loading');
    expect(loadingIndicator).not.toBeInTheDocument();
  });

  it('renders loading indicator with a delay when loading is initially true', async () => {
    const { rerender } = render(<LoadMoreContainer loading={false} onLoadMore={() => {}} />);
    let loadingIndicator = screen.queryByTestId('loading');
    expect(loadingIndicator).not.toBeInTheDocument();

    rerender(<LoadMoreContainer loading onLoadMore={() => {}} />);
    loadingIndicator = screen.queryByTestId('loading');
    expect(loadingIndicator).not.toBeInTheDocument();

    // after throttle
    await waitFor(
      () => {
        loadingIndicator = screen.getByTestId('loading');
        expect(loadingIndicator).toBeInTheDocument();
      },
      {
        timeout: 150,
      },
    );
  });

  it('calls onLoadMore when intersection occurs', async () => {
    const onLoadMoreMock = jest.fn(); // Mock the onLoadMore function
    render(<LoadMoreContainer loading={false} onLoadMore={onLoadMoreMock} />);

    // Wait for the intersection callback to trigger
    await waitFor(() => {
      expect(onLoadMoreMock).toHaveBeenCalledTimes(1);
    });
  });
});
