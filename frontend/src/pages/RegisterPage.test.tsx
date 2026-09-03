import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import RegisterPage from './RegisterPage';
import { AuthProvider } from '../context/AuthContext';
import axiosClient from '../api/axiosClient';
import { vi, describe, it, expect, beforeEach } from 'vitest';

vi.mock('../api/axiosClient', () => {
  return {
    default: {
      get: vi.fn(),
      post: vi.fn(),
    },
  };
});

describe('RegisterPage Component', () => {
  beforeEach(() => {
    const mockGet = axiosClient.get as unknown as ReturnType<typeof vi.fn>;
    mockGet.mockResolvedValue({ data: [] });
  });

  it('should render the registration form', () => {
    render(
      <AuthProvider>
        <BrowserRouter>
          <RegisterPage />
        </BrowserRouter>
      </AuthProvider>
    );

    expect(screen.getByPlaceholderText('Full name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('0771234567')).toBeInTheDocument();
    expect(screen.getByText('Register Appointment')).toBeInTheDocument();
  });

  it('should validate required fields', async () => {
    render(
      <AuthProvider>
        <BrowserRouter>
          <RegisterPage />
        </BrowserRouter>
      </AuthProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: /Register Appointment/i }));

    await waitFor(() => {
      expect(screen.getByText('Name must be at least 2 characters.')).toBeInTheDocument();
      expect(screen.getByText('Address is required.')).toBeInTheDocument();
      expect(screen.getByText('Enter a valid Sri Lankan phone number (e.g. 0771234567).')).toBeInTheDocument();
    });
  });
});
