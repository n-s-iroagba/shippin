
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface ShipmentFormProps {
  initialData?: Partial<CreateShipmentDetailsDto>;
  mode: 'create' | 'edit';
  onSubmit: (data: CreateShipmentDetailsDto) => Promise<void>;
}

const ShipmentForm: React.FC<ShipmentFormProps> = ({ initialData, mode, onSubmit }) => {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<CreateShipmentDetailsDto>>(initialData || {});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await onSubmit(formData as CreateShipmentDetailsDto);
      router.push('/admin/shipments');
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} data-testid="shipment-form" className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-dark-blue mb-6">
        {mode === 'create' ? 'Create New Shipment' : 'Edit Shipment'}
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
          {error === 'Invalid input' ? 'Please correct the form fields.' : 
           'An error occurred while creating the shipment. Please try again later.'}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-dark-blue mb-1">Sender Name</label>
          <input
            type="text"
            value={formData.senderName || ''}
            onChange={(e) => setFormData({ ...formData, senderName: e.target.value })}
            className="w-full p-2 border rounded-lg focus:ring-primary-blue focus:border-primary-blue"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-dark-blue mb-1">Pickup Point</label>
          <input
            type="text"
            value={formData.sendingPickupPoint || ''}
            onChange={(e) => setFormData({ ...formData, sendingPickupPoint: e.target.value })}
            className="w-full p-2 border rounded-lg focus:ring-primary-blue focus:border-primary-blue"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-dark-blue mb-1">Takeoff Address</label>
          <input
            type="text"
            value={formData.shippingTakeoffAddress || ''}
            onChange={(e) => setFormData({ ...formData, shippingTakeoffAddress: e.target.value })}
            className="w-full p-2 border rounded-lg focus:ring-primary-blue focus:border-primary-blue"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-dark-blue mb-1">Receiving Address</label>
          <input
            type="text"
            value={formData.receivingAddress || ''}
            onChange={(e) => setFormData({ ...formData, receivingAddress: e.target.value })}
            className="w-full p-2 border rounded-lg focus:ring-primary-blue focus:border-primary-blue"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-dark-blue mb-1">Recipient Name</label>
          <input
            type="text"
            value={formData.recipientName || ''}
            onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
            className="w-full p-2 border rounded-lg focus:ring-primary-blue focus:border-primary-blue"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-dark-blue mb-1">Recipient Email</label>
          <input
            type="email"
            value={formData.receipientEmail || ''}
            onChange={(e) => setFormData({ ...formData, receipientEmail: e.target.value })}
            className="w-full p-2 border rounded-lg focus:ring-primary-blue focus:border-primary-blue"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-dark-blue mb-1">Expected Arrival</label>
          <input
            type="datetime-local"
            value={formData.expectedTimeOfArrival?.toString().slice(0, 16) || ''}
            onChange={(e) => setFormData({ ...formData, expectedTimeOfArrival: new Date(e.target.value) })}
            className="w-full p-2 border rounded-lg focus:ring-primary-blue focus:border-primary-blue"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-dark-blue mb-1">Freight Type</label>
          <select
            value={formData.freightType || ''}
            onChange={(e) => setFormData({ ...formData, freightType: e.target.value as 'AIR' | 'SEA' | 'LAND' })}
            className="w-full p-2 border rounded-lg focus:ring-primary-blue focus:border-primary-blue"
            required
          >
            <option value="">Select Type</option>
            <option value="AIR">Air</option>
            <option value="SEA">Sea</option>
            <option value="LAND">Land</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-dark-blue mb-1">Weight (kg)</label>
          <input
            type="number"
            value={formData.weight || ''}
            onChange={(e) => setFormData({ ...formData, weight: Number(e.target.value) })}
            className="w-full p-2 border rounded-lg focus:ring-primary-blue focus:border-primary-blue"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-dark-blue mb-1">Dimensions (inches)</label>
          <input
            type="text"
            value={formData.dimensionInInches || ''}
            onChange={(e) => setFormData({ ...formData, dimensionInInches: e.target.value })}
            className="w-full p-2 border rounded-lg focus:ring-primary-blue focus:border-primary-blue"
            placeholder="L x W x H"
            required
          />
        </div>
      </div>

      <div className="mt-6">
        <label className="block text-sm font-medium text-dark-blue mb-1">Shipment Description</label>
        <textarea
          value={formData.shipmentDescription || ''}
          onChange={(e) => setFormData({ ...formData, shipmentDescription: e.target.value })}
          className="w-full p-2 border rounded-lg focus:ring-primary-blue focus:border-primary-blue"
          rows={4}
          required
        />
      </div>

      <div className="mt-6 flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 text-dark-blue border border-dark-blue rounded-lg hover:bg-dark-blue hover:text-white transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-primary-blue text-white rounded-lg hover:bg-dark-blue transition-colors disabled:opacity-50"
        >
          {loading ? 'Processing...' : mode === 'create' ? 'Create Shipment' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
};

export default ShipmentForm;
