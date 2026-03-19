import React from 'react';
import {Text} from 'react-native';
import {render, screen, fireEvent} from '@testing-library/react-native';
import {ScreenHeader} from '../../src/components/ScreenHeader';

describe('ScreenHeader', () => {
  const mockOnBack = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the provided title', () => {
    render(<ScreenHeader title="My Page" onBack={mockOnBack} />);
    expect(screen.getByText('My Page')).toBeTruthy();
  });

  it('calls onBack when the back button is pressed', () => {
    render(<ScreenHeader title="Test" onBack={mockOnBack} />);
    fireEvent.press(screen.getByTestId('screen-header-back'));
    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  it('renders right content when provided', () => {
    render(
      <ScreenHeader
        title="Test"
        onBack={mockOnBack}
        right={<Text>Action</Text>}
      />,
    );
    expect(screen.getByText('Action')).toBeTruthy();
  });

  it('does not throw when right prop is omitted', () => {
    expect(() =>
      render(<ScreenHeader title="Test" onBack={mockOnBack} />),
    ).not.toThrow();
  });
});
