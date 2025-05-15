
import { useState } from 'react';
import { ApiService } from '@/services/api.service';
import { CryptoWalletAttributes } from '@/types/crypto-wallet.types';
import { FiatPlatformAttributes } from '@/types/fiat-platform.types';

interface PaymentModalProps {
  statusId: string;
  onClose: () => void;
  onSuccess: () => void;
  feeInDollars: number;
  cryptoWallets: CryptoWalletAttributes[];
  fiatPlatforms: FiatPlatformAttributes[];
}

export default function PaymentModal({ 
  statusId, 
  onClose, 
  onSuccess,
  feeInDollars,
  cryptoWallets,
  fiatPlatforms 
}: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<'crypto' | 'fiat' | null>(null);
  const [selectedWallet, setSelectedWallet] = useState<CryptoWalletAttributes | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<FiatPlatformAttributes | null>(null);

  const handleCopyAddress = async () => {
    if (!selectedWallet) return;
    try {
      await navigator.clipboard.writeText(selectedWallet.walletAddress);
      alert('Wallet address copied!');
    } catch (err) {
      alert('Failed to copy address');
    }
  };

  const handleFiatRedirect = () => {
    if (!selectedPlatform) return;
    const message = selectedPlatform.messageTemplate
      .replace('{statusId}', statusId)
      .replace('{amount}', feeInDollars.toString());
    window.location.href = `${selectedPlatform.baseUrl}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h3 className="text-lg font-bold mb-4">Make Payment</h3>
        <div className="mb-4">
          <p className="font-semibold">Amount: ${feeInDollars}</p>
        </div>

        <div className="mb-4">
          <label className="block font-semibold mb-2">Select Payment Method</label>
          <div className="flex gap-4">
            <button 
              onClick={() => setPaymentMethod('crypto')}
              className={`px-4 py-2 rounded ${paymentMethod === 'crypto' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              Cryptocurrency
            </button>
            <button 
              onClick={() => setPaymentMethod('fiat')}
              className={`px-4 py-2 rounded ${paymentMethod === 'fiat' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              Fiat Currency
            </button>
          </div>
        </div>

        {paymentMethod === 'crypto' && (
          <div className="mb-4">
            <label className="block font-semibold mb-2">Select Wallet</label>
            <select 
              className="w-full p-2 border rounded mb-4"
              onChange={(e) => {
                const wallet = cryptoWallets.find(w => w.id === Number(e.target.value));
                setSelectedWallet(wallet || null);
              }}
            >
              <option value="">Choose a cryptocurrency</option>
              {cryptoWallets.map(wallet => (
                <option key={wallet.id} value={wallet.id}>
                  {wallet.currency} {wallet.label && `(${wallet.label})`}
                </option>
              ))}
            </select>

            {selectedWallet && (
              <div className="bg-gray-100 p-4 rounded">
                <p className="font-semibold mb-2">Wallet Address:</p>
                <div className="flex gap-2">
                  <input 
                    type="text"
                    readOnly
                    value={selectedWallet.walletAddress}
                    className="flex-1 p-2 bg-white rounded"
                  />
                  <button
                    onClick={handleCopyAddress}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    Copy
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {paymentMethod === 'fiat' && (
          <div className="mb-4">
            <label className="block font-semibold mb-2">Select Platform</label>
            <select 
              className="w-full p-2 border rounded mb-4"
              onChange={(e) => {
                const platform = fiatPlatforms.find(p => p.id === Number(e.target.value));
                setSelectedPlatform(platform || null);
              }}
            >
              <option value="">Choose a payment platform</option>
              {fiatPlatforms.map(platform => (
                <option key={platform.id} value={platform.id}>
                  {platform.name}
                </option>
              ))}
            </select>

            {selectedPlatform && (
              <button
                onClick={handleFiatRedirect}
                className="w-full bg-blue-500 text-white px-4 py-2 rounded"
              >
                Continue to Payment
              </button>
            )}
          </div>
        )}

        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="bg-gray-200 px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
