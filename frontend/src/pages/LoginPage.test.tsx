import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LoginPage from './LoginPage';
import { AuthProvider } from '../context/AuthContext';
import axiosClient from '../api/axiosClient';
import { vi, describe, it, expect } from 'vitest';

// Mock axios client
vi.mock('../api/axiosClient', () => {
  return {
    default: {
      post: vi.fn(),
    },
  };
});

describe('LoginPage Component', () => {
  it('should render the login form', () => {
    render(
      <AuthProvider>
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      </AuthProvider>
    );

    expect(screen.getByPlaceholderText('Enter your username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument();
  });

  it('should show error when fields are empty', () => {
    render(
      <AuthProvider>
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      </AuthProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));
    expect(screen.getByText('⚠️ Please enter your username and password.')).toBeInTheDocument();
  });

  it('should call API on submit', async () => {
    const mockPost = axiosClient.post as unknown as ReturnType<typeof vi.fn>;
    mockPost.mockResolvedValueOnce({
      data: { token: 'fake-jwt', role: 'ADMIN', fullName: 'Test User', username: 'admin' }
    });

    render(
      <AuthProvider>
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      </AuthProvider>
    );

    fireEvent.change(screen.getByPlaceholderText('Enter your username'), { target: { value: 'admin' } });
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), { target: { value: 'password' } });
    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

    await waitFor(() => {
      expect(mockPost).toHaveBeenCalledWith('/auth/login', { username: 'admin', password: 'password' });
    });
  });
});
