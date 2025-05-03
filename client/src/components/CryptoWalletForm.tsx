
import React, { useState } from 'react';
import { ApiService } from '@/services/api.service';
import { CreateCryptoWalletDto, CryptoWalletAttributes } from '@/types/crypto-wallet.types';

interface CryptoWalletFormProps {
  wallet?: CryptoWalletAttributes;
  onSuccess: () => void;
  onClose: () => void;
}

export default function CryptoWalletForm({ wallet, onSuccess, onClose }: CryptoWalletFormProps) {
  const [formData, setFormData] = useState<CreateCryptoWalletDto>({
    currency: wallet?.currency || '',
    walletAddress: wallet?.walletAddress || '',
    label: wallet?.label || ''
  });
  const [errors, setErrors] = useState<Partial<Record<keyof CreateCryptoWalletDto, string>>>({});
  const [submitting, setSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: Partial<Record<keyof CreateCryptoWalletDto | '_global', string>> = {};
    if (!formData.currency?.trim()) newErrors.currency = 'Currency is required';
    if (!formData.walletAddress?.trim()) newErrors.walletAddress = 'Wallet address is required';
    if (formData.walletAddress?.trim().length < 10) {
      newErrors.walletAddress = 'Wallet address must be at least 10 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      if (wallet) {
        await ApiService.updateCryptoWallet(wallet.id, formData);
      } else {
        await ApiService.createCryptoWallet(formData);
      }
      onSuccess();
    } catch (err: any) {
      if (err.status === 400 && err.data?.errors) {
        setErrors(err.data.errors);
      } else if (err.status === 403) {
        setErrors({
          _global: 'You do not have permission to edit this wallet.'
        });
      } else if (err.status === 404) {
        setErrors({
          _global: 'Crypto wallet not found.'
        });
      } else {
        setErrors({
          _global: `Could not ${wallet ? 'update' : 'create'} crypto wallet. Please try again later.`
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" data-testid="crypto-wallet-form">
      {errors._global && (
        <div className="text-red-500 text-sm p-2 bg-red-50 rounded" data-testid="global-error">
          {errors._global}
        </div>
      )}
      <div>
        <label className="block mb-2" htmlFor="wallet-currency">Currency</label>
        <input
          id="wallet-currency"
          type="text"
          value={formData.currency}
          onChange={e => setFormData({ ...formData, currency: e.target.value })}
          className="w-full p-2 border rounded"
          disabled={submitting}
          data-testid="wallet-currency-input"
        />
        {errors.currency && (
          <p className="text-red-500 text-sm mt-1" data-testid="currency-error">
            {errors.currency}
          </p>
        )}
      </div>
      <div>
        <label className="block mb-2" htmlFor="wallet-address">Wallet Address</label>
        <div className="flex">
          <input
            id="wallet-address"
            type="text"
            value={formData.walletAddress}
            onChange={e => setFormData({ ...formData, walletAddress: e.target.value })}
            className="flex-1 p-2 border rounded-l"
            disabled={submitting}
            data-testid="wallet-address-input"
          />
          <button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(formData.walletAddress);
              alert('Address copied to clipboard!');
            }}
            className="px-4 py-2 bg-gray-100 border border-l-0 rounded-r hover:bg-gray-200"
            data-testid="copy-address-button"
          >
            Copy
          </button>
        </div>
        {errors.walletAddress && (
          <p className="text-red-500 text-sm mt-1" data-testid="address-error">
            {errors.walletAddress}
          </p>
        )}
      </div>
      <div>
        <label className="block mb-2" htmlFor="wallet-label">Label (Optional)</label>
        <input
          id="wallet-label"
          type="text"
          value={formData.label || ''}
          onChange={e => setFormData({ ...formData, label: e.target.value })}
          className="w-full p-2 border rounded"
          disabled={submitting}
          data-testid="wallet-label-input"
        />
      </div>
      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border rounded"
          disabled={submitting}
          data-testid="cancel-button"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-primary-blue text-white rounded"
          disabled={submitting}
          data-testid="submit-button"
        >
          {submitting ? 'Saving...' : wallet ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
}
