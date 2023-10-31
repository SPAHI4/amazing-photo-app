import { describe } from '@jest/globals';
import { render, waitFor } from '@testing-library/react';

const { PullableDrawer } = await import('./pullable-drawer.tsx');

describe('PullableDrawer', () => {
  it('should render title', () => {
    const { getByText } = render(
      <PullableDrawer title="Test title">
        <div>Test content</div>
      </PullableDrawer>,
    );

    expect(getByText('Test title')).toBeInTheDocument();
  });

  it('should not show content when closed', () => {
    const { queryByText } = render(
      <PullableDrawer title="Test title">
        <div>Test content</div>
      </PullableDrawer>,
    );

    expect(queryByText('Test content')).not.toBeVisible();
  });

  it('should show content when opened', async () => {
    const { getByText, getByTestId } = render(
      <PullableDrawer title="Test title">
        <div>Test content</div>
      </PullableDrawer>,
    );

    await waitFor(() => {
      const title = getByTestId('drawer-title');

      title.click();

      expect(getByText('Test content')).toBeVisible();
    });
  });
});
