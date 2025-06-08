// components/AdminCryptoWalletCard.tsx
'use client';
import React from 'react';

import { PencilIcon, TrashIcon, CurrencyDollarIcon, WalletIcon } from '@heroicons/react/24/outline';
import { CryptoWallet } from '@/types/crypto-wallet.types';

interface AdminCryptoWalletCardProps {
  wallet: CryptoWallet;
  onEdit: () => void;
  onDelete: () => void;
}

const AdminCryptoWalletCard: React.FC<AdminCryptoWalletCardProps> = ({
  wallet,
  onEdit,
  onDelete,
}) => {
  const truncateAddress = (address: string, length: number = 20) => {
    if (address.length <= length) return address;
    return `${address.slice(0, length)}...`;
  };

  const getCurrencyIcon = (currency: string) => {
    switch (currency.toLowerCase()) {
      case 'bitcoin':
      case 'btc':
        return '₿';
      case 'ethereum':
      case 'eth':
        return 'Ξ';
      case 'litecoin':
      case 'ltc':
        return 'Ł';
      case 'usdt':
      case 'tether':
        return '₮';
      default:
        return '₿';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <WalletIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-2xl font-bold text-gray-900">
                  {getCurrencyIcon(wallet.currency)}
                </span>
                <h3 className="text-xl font-bold text-gray-900 capitalize">
                  {wallet.currency}
                </h3>
                {wallet.label && (
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    {wallet.label}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <CurrencyDollarIcon className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    Currency: <span className="font-medium">{wallet.currency.toUpperCase()}</span>
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <WalletIcon className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    Address: <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                      {truncateAddress(wallet.walletAddress)}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={onEdit}
              className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
              title="Edit wallet"
            >
              <PencilIcon className="w-5 h-5" />
            </button>
            <button
              onClick={onDelete}
              className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete wallet"
            >
              <TrashIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-xs text-gray-500 mb-1">Full Wallet Address:</div>
            <div className="text-sm font-mono text-gray-700 break-all">
              {wallet.walletAddress}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCryptoWalletCard;