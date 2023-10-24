import { render, fireEvent, screen } from '@testing-library/react';
import { describe, expect, jest } from '@jest/globals';
import { ImageInput } from './image-input.tsx';

describe('ImageInput', () => {
  const mockFile = new File(['hello'], 'hello.png', { type: 'image/png' });

  it('should trigger onChange when a file is dropped', () => {
    const mockOnChange = jest.fn();
    render(<ImageInput onChange={mockOnChange} />);

    const buttonBase = screen.getByRole('button');

    fireEvent.dragEnter(buttonBase);
    fireEvent.dragOver(buttonBase);
    fireEvent.drop(buttonBase, { dataTransfer: { files: [mockFile] } });

    expect(mockOnChange).toHaveBeenCalledWith(mockFile);
  });

  it('should trigger onChange when a file is selected via input', () => {
    const mockOnChange = jest.fn();
    const { container } = render(<ImageInput onChange={mockOnChange} />);

    const input = container.querySelector('input') as HTMLInputElement;

    fireEvent.change(input, { target: { files: [mockFile] } });

    expect(mockOnChange).toHaveBeenCalledWith(mockFile);
  });

  it('should change the label while dragging', () => {
    const mockOnChange = jest.fn();
    render(<ImageInput onChange={mockOnChange} />);

    const buttonBase = screen.getByRole('button');

    fireEvent.dragEnter(buttonBase);
    expect(screen.getByText('Yep, right here!')).toBeTruthy();

    fireEvent.dragLeave(buttonBase);
    expect(screen.getByText('add picture')).toBeTruthy();
  });
});
