
import { render, screen, fireEvent, waitFor } from '../../utils/test-utils';
import AuthForm from '../AuthForm';
import { act } from '@testing-library/react';

describe('AuthForm', () => {
  const mockSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Signup Flow', () => {
    it('validates password match', async () => {
      render(<AuthForm mode="signup" onSubmit={mockSubmit} />);
      
      await act(async () => {
        fireEvent.change(screen.getByLabelText(/email/i), {
          target: { value: 'test@example.com' },
        });
        fireEvent.change(screen.getByLabelText(/password/i), {
          target: { value: 'password123' },
        });
        fireEvent.change(screen.getByLabelText(/confirm password/i), {
          target: { value: 'password124' },
        });
        fireEvent.submit(screen.getByTestId('auth-form'));
      });

      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
      expect(mockSubmit).not.toHaveBeenCalled();
    });

    it('submits form with valid data', async () => {
      render(<AuthForm mode="signup" onSubmit={mockSubmit} />);
      
      await act(async () => {
        fireEvent.change(screen.getByLabelText(/email/i), {
          target: { value: 'test@example.com' },
        });
        fireEvent.change(screen.getByLabelText(/password/i), {
          target: { value: 'password123' },
        });
        fireEvent.change(screen.getByLabelText(/confirm password/i), {
          target: { value: 'password123' },
        });
        fireEvent.submit(screen.getByTestId('auth-form'));
      });

      expect(mockSubmit).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });

  describe('Login Flow', () => {
    it('handles login submission', async () => {
      render(<AuthForm mode="login" onSubmit={mockSubmit} />);
      
      await act(async () => {
        fireEvent.change(screen.getByLabelText(/email/i), {
          target: { value: 'test@example.com' },
        });
        fireEvent.change(screen.getByLabelText(/password/i), {
          target: { value: 'password123' },
        });
        fireEvent.submit(screen.getByTestId('auth-form'));
      });

      expect(mockSubmit).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });

  describe('Password Reset Flow', () => {
    it('handles password reset request', async () => {
      render(<AuthForm mode="reset" onSubmit={mockSubmit} />);
      
      await act(async () => {
        fireEvent.change(screen.getByLabelText(/email/i), {
          target: { value: 'test@example.com' },
        });
        fireEvent.submit(screen.getByTestId('auth-form'));
      });

      expect(mockSubmit).toHaveBeenCalledWith({
        email: 'test@example.com',
      });
    });
  });
});
