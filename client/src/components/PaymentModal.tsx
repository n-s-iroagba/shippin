import { useState } from 'react';
import { routes } from '@/data/routes';
import type { CryptoWallet } from '@/types/crypto-wallet.types';
import type { SocialMedia } from '@/types/social-media.types';

interface PaymentModalProps {
  statusId: string;
  onClose: () => void;
  feeInDollars: number;
  cryptoWallets: CryptoWallet[];
  socialMediaLinks: SocialMedia[];
  paymentStatus: 'NO_PAYMENT_REQUIRED' | 'UNPAID' | 'PENDING' | 'PARTIALLY_PAID' | 'PAID';
  paymentNotes?: string;
}

export default function PaymentModal({ 
  statusId, 
  onClose, 
  feeInDollars,
  cryptoWallets,
  socialMediaLinks,
  paymentStatus = 'UNPAID',
  paymentNotes
}: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<'crypto' | 'fiat' | null>(null);
  const [selectedWallet, setSelectedWallet] = useState<CryptoWallet | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<SocialMedia | null>(null);
  const [uploadedReceipts, setUploadedReceipts] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleCopyAddress = async () => {
    if (!selectedWallet) return;
    try {
      await navigator.clipboard.writeText(selectedWallet.walletAddress);
      alert('Wallet address copied!');
    } catch {
      alert('Failed to copy address');
    }
  };

  const handleFiatRedirect = () => {
    if (!selectedPlatform) return;
    // Create a default message template for payment
    const message = `Payment Request - Status ID: ${statusId}, Amount: $${feeInDollars}. Please contact us for payment processing.`;
    window.location.href = `${selectedPlatform.url}?text=${encodeURIComponent(message)}`;
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedReceipts(prev => [...prev, ...files]);
  };

  const removeReceipt = (index: number) => {
    setUploadedReceipts(prev => prev.filter((_, i) => i !== index));
  };

  const handleUploadReceipts = async () => {
    if (uploadedReceipts.length === 0) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      for (const file of uploadedReceipts) {
        const formData = new FormData();
        formData.append('paymentReceipt', file);

        const response = await fetch(routes.stage.uploadReceipt(Number(statusId)), {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Failed to upload ${file.name}`);
        }
      }

      onClose();
      window.location.reload();
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Failed to upload receipts');
    } finally {
      setIsUploading(false);
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'text-green-600';
      case 'PARTIALLY_PAID':
        return 'text-yellow-600';
      case 'PENDING':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h3 className="text-lg font-bold mb-4">Make Payment</h3>
        <div className="mb-4">
          <p className="font-semibold">Amount: ${feeInDollars}</p>
          {paymentStatus !== 'UNPAID' && (
            <div className="mt-2">
              <p className="text-sm">
                Payment Status:{' '}
                <span className={`font-medium ${getPaymentStatusColor(paymentStatus)}`}>
                  {paymentStatus}
                </span>
              </p>
              {paymentNotes && (
                <p className="text-sm text-gray-600 mt-1">{paymentNotes}</p>
              )}
            </div>
          )}
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
                  {wallet.currency}
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
                const platform = socialMediaLinks.find(p => p.id === Number(e.target.value));
                setSelectedPlatform(platform || null);
              }}
            >
              <option value="">Choose a payment platform</option>
              {socialMediaLinks.map(platform => (
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

        {/* Payment Receipt Upload */}
        <div className="mb-4">
          <label className="block font-semibold mb-2">Upload Payment Receipts</label>
          {uploadError && (
            <div className="mb-2 p-2 bg-red-100 text-red-700 rounded text-sm">
              {uploadError}
            </div>
          )}
          <input
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileUpload}
            className="w-full p-2 border rounded"
            disabled={isUploading}
          />
          {uploadedReceipts.length > 0 && (
            <div className="mt-2 space-y-2">
              {uploadedReceipts.map((file, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                  <span className="text-sm truncate">{file.name}</span>
                  <button
                    onClick={() => removeReceipt(index)}
                    className="text-red-600 hover:text-red-800"
                    disabled={isUploading}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="bg-gray-200 px-4 py-2 rounded"
            disabled={isUploading}
          >
            Cancel
          </button>
          {uploadedReceipts.length > 0 && (
            <button
              onClick={handleUploadReceipts}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              disabled={isUploading}
            >
              {isUploading ? 'Uploading...' : 'Upload Receipts'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
