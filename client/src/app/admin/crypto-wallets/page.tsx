
'use client';

import { useEffect, useState } from 'react';
import { ApiService } from '@/services/api.service';
import { CryptoWalletAttributes } from '@/types/crypto-wallet.types';
import CryptoWalletForm from '@/components/CryptoWalletForm';
import Loading from '@/components/Loading';

export default function CryptoWalletsPage() {
  const [wallets, setWallets] = useState<CryptoWalletAttributes[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedWallet, setSelectedWallet] = useState<CryptoWalletAttributes | null>(null);
  const [showForm, setShowForm] = useState(false);

  const loadWallets = async () => {
    try {
      const data = await ApiService.listCryptoWallets();
      setWallets(data);
      setError(null);
    } catch (err) {
      setError('Unable to load crypto wallets. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWallets();
  }, []);

  const handleDelete = async (wallet: CryptoWalletAttributes) => {
    if (!confirm('Are you sure you want to delete this wallet?')) return;

    try {
      await ApiService.deleteCryptoWallet(wallet.id);
      await loadWallets();
      alert('Crypto wallet deleted successfully');
    } catch (err: any) {
      if (err.status === 403) {
        alert('You do not have permission to delete this wallet.');
      } else if (err.status === 404) {
        alert('Crypto wallet not found.');
      } else {
        alert('Could not delete crypto wallet. Please try again later.');
      }
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Crypto Wallets</h1>
        <button
          onClick={() => {
            setSelectedWallet(null);
            setShowForm(true);
          }}
          className="bg-primary-blue text-white px-4 py-2 rounded"
          data-testid="create-wallet-button"
        >
          Create Wallet
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">
              {selectedWallet ? 'Edit Wallet' : 'Create Wallet'}
            </h2>
            <CryptoWalletForm
              wallet={selectedWallet || undefined}
              onSuccess={() => {
                loadWallets();
                setShowForm(false);
                setSelectedWallet(null);
              }}
              onClose={() => {
                setShowForm(false);
                setSelectedWallet(null);
              }}
            />
          </div>
        </div>
      )}

      <div className="grid gap-4">
        {wallets.map(wallet => (
          <div
            key={wallet.id}
            className="p-4 border rounded-lg shadow flex justify-between items-center"
            data-testid="wallet-item"
          >
            <div>
              <h3 className="font-bold">{wallet.currency}</h3>
              <p className="text-gray-600 break-all">{wallet.walletAddress}</p>
              {wallet.label && (
                <p className="text-gray-500 text-sm">{wallet.label}</p>
              )}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  setSelectedWallet(wallet);
                  setShowForm(true);
                }}
                className="text-blue-500 hover:text-blue-700"
                data-testid="edit-button"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(wallet)}
                className="text-red-500 hover:text-red-700"
                data-testid="delete-button"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {wallets.length === 0 && (
          <p className="text-gray-500 text-center py-8">
            No crypto wallets found. Click "Create Wallet" to add one.
          </p>
        )}
      </div>
    </div>
  );
}
