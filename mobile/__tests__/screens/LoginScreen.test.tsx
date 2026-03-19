import React from 'react';
import {act, render, screen, fireEvent, waitFor} from '@testing-library/react-native';
import {LoginScreen} from '../../src/screens/LoginScreen';

const mockLogin = jest.fn();

jest.mock('../../src/store/authStore', () => ({
  useAuthStore: () => ({login: mockLogin}),
}));

jest.mock('../../src/utils/axios', () => ({
  default: {post: jest.fn()},
}));

// Replace Paper TextInput with native RN TextInput so fireEvent.changeText works
jest.mock('react-native-paper', () => {
  const mockReact = require('react');
  const RN = require('react-native');
  const MockTextInput = ({
    testID,
    onChangeText,
    value,
    placeholder,
    secureTextEntry,
  }: any) =>
    mockReact.createElement(RN.TextInput, {
      testID,
      onChangeText,
      value,
      placeholder,
      secureTextEntry,
    });
  MockTextInput.Icon = () => null;
  return {
    Text: RN.Text,
    TextInput: MockTextInput,
    ActivityIndicator: RN.ActivityIndicator,
  };
});

const axiosInstance = require('../../src/utils/axios').default;

describe('LoginScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the login tab and Sign In button by default', () => {
    render(<LoginScreen />);
    expect(screen.getByText('Sign In')).toBeTruthy();
    expect(screen.getByTestId('login-username-input')).toBeTruthy();
    expect(screen.getByTestId('login-password-input')).toBeTruthy();
  });

  it('switches to the signup form when Sign Up tab is pressed', () => {
    render(<LoginScreen />);
    fireEvent.press(screen.getByText('Sign Up'));
    expect(screen.getByText('Create Account')).toBeTruthy();
  });

  it('shows validation error when submitting with empty fields', async () => {
    render(<LoginScreen />);
    fireEvent.press(screen.getByText('Sign In'));
    await waitFor(() =>
      expect(
        screen.getByText('Please fill in all required fields'),
      ).toBeTruthy(),
    );
  });

  it('shows validation error when submitting with empty password only', async () => {
    render(<LoginScreen />);
    fireEvent.changeText(
      screen.getByTestId('login-username-input'),
      'john',
    );
    fireEvent.press(screen.getByText('Sign In'));
    await waitFor(() =>
      expect(
        screen.getByText('Please fill in all required fields'),
      ).toBeTruthy(),
    );
  });

  it('shows email format error for invalid email on signup', async () => {
    render(<LoginScreen />);
    fireEvent.press(screen.getByText('Sign Up'));
    fireEvent.changeText(
      screen.getByTestId('login-username-input'),
      'john',
    );
    fireEvent.changeText(
      screen.getByTestId('login-password-input'),
      'password',
    );
    // Type an invalid email
    fireEvent.changeText(
      screen.getByPlaceholderText('john@example.com'),
      'not-an-email',
    );
    fireEvent.press(screen.getByText('Create Account'));
    await waitFor(() =>
      expect(
        screen.getByText('Please enter a valid email address'),
      ).toBeTruthy(),
    );
  });

  it('calls the login API with credentials on successful submit', async () => {
    axiosInstance.post.mockResolvedValueOnce({
      data: {access_token: 'tok-123', user: {username: 'john'}},
    });

    render(<LoginScreen />);

    // Directly invoke onChangeText inside act() to ensure state is flushed
    await act(async () => {
      screen
        .UNSAFE_getAllByProps({testID: 'login-username-input'})[0]
        .props.onChangeText('john');
      screen
        .UNSAFE_getAllByProps({testID: 'login-password-input'})[0]
        .props.onChangeText('secret');
    });

    fireEvent.press(screen.getByText('Sign In'));

    await waitFor(() =>
      expect(axiosInstance.post).toHaveBeenCalledWith('/auth/login', {
        username: 'john',
        password: 'secret',
      }),
    );
    expect(mockLogin).toHaveBeenCalledWith('tok-123', {username: 'john'});
  });

  it('displays error message returned from the API', async () => {
    axiosInstance.post.mockRejectedValueOnce({
      response: {data: {message: 'Invalid credentials'}},
    });

    render(<LoginScreen />);

    await act(async () => {
      screen
        .UNSAFE_getAllByProps({testID: 'login-username-input'})[0]
        .props.onChangeText('john');
      screen
        .UNSAFE_getAllByProps({testID: 'login-password-input'})[0]
        .props.onChangeText('wrong');
    });

    fireEvent.press(screen.getByText('Sign In'));

    await waitFor(() =>
      expect(screen.getByText('Invalid credentials')).toBeTruthy(),
    );
  });

  it('clears error when switching tabs', () => {
    render(<LoginScreen />);
    fireEvent.press(screen.getByText('Sign In'));
    // Switch tabs — error state should reset
    fireEvent.press(screen.getByText('Sign Up'));
    expect(
      screen.queryByText('Please fill in all required fields'),
    ).toBeNull();
  });
});
