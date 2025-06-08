// components/CryptoWalletForm.tsx
'use client';
import React, { useState, useEffect } from 'react';

import { XMarkIcon, WalletIcon } from '@heroicons/react/24/outline';
import { CryptoWallet } from '@/types/crypto-wallet.types';
import { protectedApi } from '@/utils/apiUtils';

interface CryptoWalletFormProps {
  existingWallet?: CryptoWallet;
  patch?: boolean;
  onClose: () => void;
}

const CryptoWalletForm: React.FC<CryptoWalletFormProps> = ({
  existingWallet,
  patch = false,
  onClose,
}) => {
  const [formData, setFormData] = useState({
    currency: '',
    walletAddress: '',
    label: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const currencyOptions = [
    { value: 'bitcoin', label: 'Bitcoin (BTC)', symbol: '₿' },
    { value: 'ethereum', label: 'Ethereum (ETH)', symbol: 'Ξ' },
    { value: 'litecoin', label: 'Litecoin (LTC)', symbol: 'Ł' },
    { value: 'usdt', label: 'Tether (USDT)', symbol: '₮' },
    { value: 'bnb', label: 'Binance Coin (BNB)', symbol: 'BNB' },
    { value: 'cardano', label: 'Cardano (ADA)', symbol: 'ADA' },
    { value: 'solana', label: 'Solana (SOL)', symbol: 'SOL' },
    { value: 'dogecoin', label: 'Dogecoin (DOGE)', symbol: 'Ð' },
  ];

  useEffect(() => {
    if (existingWallet) {
      setFormData({
        currency: existingWallet.currency,
        walletAddress: existingWallet.walletAddress,
        label: existingWallet.label || '',
      });
    }
  }, [existingWallet]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const adminId = localStorage.getItem('admin_id');
      if (!adminId) {
        throw new Error('Admin ID not found');
      }

      const walletData = {
        ...formData,
        label: formData.label || undefined,
      };

      if (patch && existingWallet) {
        await protectedApi.patch(`/admin/crypto-wallets/${existingWallet.id}`, walletData);
      } else {
        await protectedApi.post(`/admin/crypto-wallets/${adminId}`, walletData);
      }

      onClose();
      // Refresh the page to show updated data
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save wallet');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-2 rounded-full">
                <WalletIcon className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                {patch ? 'Edit' : 'Add'} Crypto Wallet
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <XMarkIcon className="w-6 h-6 text-gray-400" />
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">
                Currency *
              </label>
              <select
                id="currency"
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select a currency</option>
                {currencyOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.symbol} {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="walletAddress" className="block text-sm font-medium text-gray-700 mb-1">
                Wallet Address *
              </label>
              <textarea
                id="walletAddress"
                name="walletAddress"
                value={formData.walletAddress}
                onChange={handleChange}
                required
                rows={3}
                placeholder="Enter the wallet address"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
              />
            </div>

       

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Saving...' : (patch ? 'Update' : 'Add')} Wallet
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CryptoWalletForm;