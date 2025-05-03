
import { render, screen, fireEvent, waitFor } from '../../utils/test-utils';
import { ApiService } from '@/services/api.service';
import FiatPlatformForm from '../FiatPlatformForm';

jest.mock('@/services/api.service');

describe('FiatPlatformForm', () => {
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
    render(<FiatPlatformForm {...defaultProps} />);
    
    expect(screen.getByTestId('fiat-platform-form')).toBeInTheDocument();
    expect(screen.getByTestId('platform-name-input')).toBeInTheDocument();
    expect(screen.getByTestId('platform-url-input')).toBeInTheDocument();
    expect(screen.getByTestId('platform-template-input')).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    render(<FiatPlatformForm {...defaultProps} />);
    
    fireEvent.click(screen.getByTestId('submit-button'));

    await waitFor(() => {
      expect(screen.getByTestId('name-error')).toBeInTheDocument();
      expect(screen.getByTestId('url-error')).toBeInTheDocument();
      expect(screen.getByTestId('template-error')).toBeInTheDocument();
    });
  });

  it('handles form submission correctly', async () => {
    const mockCreatePlatform = jest.spyOn(ApiService, 'createFiatPlatform')
      .mockResolvedValue({ id: 1, name: 'Test Platform' });

    render(<FiatPlatformForm {...defaultProps} />);
    
    fireEvent.change(screen.getByTestId('platform-name-input'), {
      target: { value: 'Test Platform' }
    });
    fireEvent.change(screen.getByTestId('platform-url-input'), {
      target: { value: 'https://test.com' }
    });
    fireEvent.change(screen.getByTestId('platform-template-input'), {
      target: { value: 'Payment {amount} for {statusId}' }
    });

    fireEvent.click(screen.getByTestId('submit-button'));

    await waitFor(() => {
      expect(mockCreatePlatform).toHaveBeenCalledWith({
        name: 'Test Platform',
        baseUrl: 'https://test.com',
        messageTemplate: 'Payment {amount} for {statusId}'
      });
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });

  it('handles API errors correctly', async () => {
    jest.spyOn(ApiService, 'createFiatPlatform')
      .mockRejectedValue({ status: 500 });

    render(<FiatPlatformForm {...defaultProps} />);
    
    fireEvent.change(screen.getByTestId('platform-name-input'), {
      target: { value: 'Test Platform' }
    });
    fireEvent.change(screen.getByTestId('platform-url-input'), {
      target: { value: 'https://test.com' }
    });
    fireEvent.change(screen.getByTestId('platform-template-input'), {
      target: { value: 'Payment {amount} for {statusId}' }
    });

    fireEvent.click(screen.getByTestId('submit-button'));

    await waitFor(() => {
      expect(screen.getByTestId('global-error')).toBeInTheDocument();
    });
  });
});
