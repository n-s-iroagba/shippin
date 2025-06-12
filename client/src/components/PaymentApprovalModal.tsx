// @/components/PaymentApprovalModal.tsx
'use client';

import { useState } from 'react';
import { Stage } from '@/types/stage.types';
import { XMarkIcon, CurrencyDollarIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

interface PaymentApprovalModalProps {
  onClose: () => void;
  Stage: Stage;
}

export function PaymentApprovalModal({ onClose, Stage }: PaymentApprovalModalProps) {
  const [formData, setFormData] = useState({
    amountPaid: Stage.amountPaid?.toString() || '',
    paymentDate: new Date().toISOString().split('T')[0],
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const amountPaid = parseFloat(formData.amountPaid);
      
      if (isNaN(amountPaid) || amountPaid <= 0) {
        throw new Error('Please enter a valid amount');
      }

      // Your API call logic here
      const payload = {
        id: Stage.id,
        amountPaid,
        paymentDate: new Date(formData.paymentDate),
        paymentStatus: 'PAID',
        notes: formData.notes,
      };

      console.log('Approving payment:', payload);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Close modal after successful submission
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to approve payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-2 rounded-full">
              <CurrencyDollarIcon className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Approve Payment</h2>
              <p className="text-sm text-gray-600">Stage {Stage.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Stage Info */}
        <div className="p-6 bg-gray-50 border-b border-gray-200">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Location:</span>
              <p className="font-medium text-gray-900">{Stage.location}</p>
            </div>
            <div>
              <span className="text-gray-600">Required Fee:</span>
              <p className="font-medium text-gray-900">
                {Stage.amountPaid ? formatCurrency(Stage.amountPaid) : 'N/A'}
              </p>
            </div>
            <div>
              <span className="text-gray-600">Current Status:</span>
              <p className="font-medium text-gray-900">{Stage.paymentStatus}</p>
            </div>
            <div>
              <span className="text-gray-600">Stage Date:</span>
              <p className="font-medium text-gray-900">
                {new Date(Stage.dateAndTime).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="amountPaid" className="block text-sm font-medium text-gray-700 mb-2">
                Amount Paid *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  id="amountPaid"
                  step="0.01"
                  min="0"
                  value={formData.amountPaid}
                  onChange={(e) => setFormData({ ...formData, amountPaid: e.target.value })}
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="paymentDate" className="block text-sm font-medium text-gray-700 mb-2">
                Payment Date *
              </label>
              <input
                type="date"
                id="paymentDate"
                value={formData.paymentDate}
                onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                Notes (Optional)
              </label>
              <textarea
                id="notes"
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Add any additional notes about this payment..."
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircleIcon className="w-5 h-5" />
                  Approve Payment
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}