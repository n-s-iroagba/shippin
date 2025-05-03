
import { render, screen, fireEvent, waitFor } from '../../utils/test-utils';
import VerifyEmail from '../../app/admin/verify-email/[token]/page';
import { act } from '@testing-library/react';

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
  useParams: () => ({
    token: 'test-token',
  }),
}));

describe('VerifyEmail', () => {
  const mockVerify = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('handles verification code submission', async () => {
    render(<VerifyEmail />);
    
    await act(async () => {
      fireEvent.change(screen.getByTestId('verification-code'), {
        target: { value: '123456' },
      });
      fireEvent.click(screen.getByTestId('verify-button'));
    });

    await waitFor(() => {
      expect(mockVerify).toHaveBeenCalledWith({
        code: '123456',
        verificationToken: 'test-token',
      });
    });
  });

  it('handles resend verification code', async () => {
    jest.useFakeTimers();
    render(<VerifyEmail />);
    
    // Fast-forward 3 minutes
    act(() => {
      jest.advanceTimersByTime(180000);
    });

    await act(async () => {
      fireEvent.click(screen.getByTestId('resend-button'));
    });

    expect(screen.getByText(/verification code resent/i)).toBeInTheDocument();
    jest.useRealTimers();
  });
});
