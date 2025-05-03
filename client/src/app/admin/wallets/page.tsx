
'use client'

import { useState, useEffect } from 'react';
import Loading from '@/components/Loading';

interface Wallet {
  id: number;
  coinName: string;
  walletAddress: string;
  qrCode?: string;
}

export default function WalletManagement() {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [loading, setLoading] = useState(true);
  const [newWallet, setNewWallet] = useState({
    coinName: '',
    walletAddress: '',
    qrCode: ''
  });

  useEffect(() => {
    fetchWallets();
  }, []);

  const fetchWallets = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/wallets/admin', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setWallets(data);
    } catch (error) {
      console.error('Failed to fetch wallets:', error);
    } finally {
      setLoading(false);
    }
  };

  const [error, setError] = useState<string | null>(null);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await fetch('/api/wallets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newWallet)
      });
      if (response.ok) {
        fetchWallets();
        setNewWallet({ coinName: '', walletAddress: '', qrCode: '' });
      }
    } catch (error) {
      console.error('Failed to create wallet:', error);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Wallet Management</h1>
      
      <form onSubmit={handleSubmit} className="mb-8 bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-1 gap-4">
          <input
            type="text"
            placeholder="Coin Name"
            value={newWallet.coinName}
            onChange={(e) => setNewWallet({...newWallet, coinName: e.target.value})}
            className="border p-2 rounded"
            required
          />
          <input
            type="text"
            placeholder="Wallet Address"
            value={newWallet.walletAddress}
            onChange={(e) => setNewWallet({...newWallet, walletAddress: e.target.value})}
            className="border p-2 rounded"
            required
          />
          <input
            type="text"
            placeholder="QR Code URL (optional)"
            value={newWallet.qrCode}
            onChange={(e) => setNewWallet({...newWallet, qrCode: e.target.value})}
            className="border p-2 rounded"
          />
          <button type="submit" className="bg-blue-500 text-white p-2 rounded">
            Add Wallet
          </button>
        </div>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {wallets.map(wallet => (
          <div key={wallet.id} className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-bold">{wallet.coinName}</h3>
            <p className="text-sm break-all">{wallet.walletAddress}</p>
            {wallet.qrCode && (
              <img src={wallet.qrCode} alt="QR Code" className="mt-2 w-32 h-32" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
