
import { render, screen, fireEvent, waitFor } from '../../utils/test-utils';
import { ApiService } from '@/services/api.service';
import CryptoWalletForm from '../CryptoWalletForm';

jest.mock('@/services/api.service');

describe('CryptoWalletForm', () => {
  const mockOnSuccess = jest.fn();
  const mockOnClose = jest.fn();

  const defaultProps = {
    onSuccess: mockOnSuccess,
    onClose: mockOnClose,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders form fields correctly', () => {
    render(<CryptoWalletForm {...defaultProps} />);
    
    expect(screen.getByTestId('crypto-wallet-form')).toBeInTheDocument();
    expect(screen.getByTestId('wallet-currency-input')).toBeInTheDocument();
    expect(screen.getByTestId('wallet-address-input')).toBeInTheDocument();
    expect(screen.getByTestId('wallet-label-input')).toBeInTheDocument();
  });

  it('validates required fields and address length', async () => {
    render(<CryptoWalletForm {...defaultProps} />);
    
    // Test empty fields
    fireEvent.click(screen.getByTestId('submit-button'));
    await waitFor(() => {
      expect(screen.getByTestId('currency-error')).toBeInTheDocument();
      expect(screen.getByTestId('address-error')).toBeInTheDocument();
    });

    // Test short wallet address
    fireEvent.change(screen.getByTestId('wallet-currency-input'), {
      target: { value: 'BTC' }
    });
    fireEvent.change(screen.getByTestId('wallet-address-input'), {
      target: { value: '123' }
    });
    
    fireEvent.click(screen.getByTestId('submit-button'));
    await waitFor(() => {
      expect(screen.getByTestId('address-error')).toHaveTextContent('Wallet address must be at least 10 characters');
    });
  });

  it('handles authorization errors', async () => {
    (ApiService.createCryptoWallet as jest.Mock).mockRejectedValue({
      status: 403,
      data: { message: 'Not authorized' }
    });

    render(<CryptoWalletForm {...defaultProps} />);
    
    fireEvent.change(screen.getByTestId('wallet-currency-input'), {
      target: { value: 'BTC' }
    });
    fireEvent.change(screen.getByTestId('wallet-address-input'), {
      target: { value: '0x1234567890' }
    });
    
    fireEvent.click(screen.getByTestId('submit-button'));
    
    await waitFor(() => {
      expect(screen.getByTestId('global-error')).toHaveTextContent('You do not have permission');
    });
  });

  it('handles successful creation', async () => {
    (ApiService.createCryptoWallet as jest.Mock).mockResolvedValue({
      id: 1,
      currency: 'BTC',
      walletAddress: '0x123'
    });

    render(<CryptoWalletForm {...defaultProps} />);
    
    fireEvent.change(screen.getByTestId('wallet-currency-input'), {
      target: { value: 'BTC' }
    });
    fireEvent.change(screen.getByTestId('wallet-address-input'), {
      target: { value: '0x123' }
    });
    
    fireEvent.click(screen.getByTestId('submit-button'));
    
    await waitFor(() => {
      expect(ApiService.createCryptoWallet).toHaveBeenCalledWith({
        currency: 'BTC',
        walletAddress: '0x123',
        label: ''
      });
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });

  it('handles API errors', async () => {
    (ApiService.createCryptoWallet as jest.Mock).mockRejectedValue({
      status: 500
    });

    render(<CryptoWalletForm {...defaultProps} />);
    
    fireEvent.change(screen.getByTestId('wallet-currency-input'), {
      target: { value: 'BTC' }
    });
    fireEvent.change(screen.getByTestId('wallet-address-input'), {
      target: { value: '0x123' }
    });
    
    fireEvent.click(screen.getByTestId('submit-button'));
    
    await waitFor(() => {
      expect(screen.getByTestId('global-error')).toBeInTheDocument();
    });
  });
});
