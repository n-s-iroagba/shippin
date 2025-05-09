
import { render, screen, fireEvent, waitFor } from '../utils/test-utils';
import ShipmentForm from '../ShipmentForm';

describe('ShipmentForm', () => {
  const mockOnSubmit = jest.fn();
  const defaultProps = {
    mode: 'create' as const,
    onSubmit: mockOnSubmit,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders form fields correctly', () => {
    render(<ShipmentForm {...defaultProps} />);
    expect(screen.getByTestId('shipment-form')).toBeInTheDocument();
    expect(screen.getByLabelText(/sender name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/pickup point/i)).toBeInTheDocument();
  });

  it('handles form submission', async () => {
    render(<ShipmentForm {...defaultProps} />);
    
    fireEvent.change(screen.getByLabelText(/sender name/i), {
      target: { value: 'John Doe' },
    });
    
    fireEvent.submit(screen.getByTestId('shipment-form'));
    
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
    });
  });

  it('validates required fields', async () => {
    render(<ShipmentForm {...defaultProps} />);
    
    fireEvent.submit(screen.getByTestId('shipment-form'));
    
    await waitFor(() => {
      expect(screen.getByText(/please fill all required fields/i)).toBeInTheDocument();
    });
  });
});
