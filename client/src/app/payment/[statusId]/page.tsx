'use client';

import { useState, useEffect } from 'react';

import Loading from '@/components/Loading';
import { CryptoWalletAttributes } from '@/types/crypto-wallet.types';
import { FiatPlatformAttributes } from '@/types/fiat-platform.types';

interface PaymentInitData {
  shippingStage: {
    id: number;
    feeInDollars: number;
    title: string;
  };
  cryptoWallets: CryptoWalletAttributes[];
  fiatPlatforms: FiatPlatformAttributes[];
}

export default function PaymentPage({ params }: { params: { statusId: string } }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [paymentData, setPaymentData] = useState<PaymentInitData | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(true);

  useEffect(() => {
    const fetchPaymentData = async () => {
      try {
        const data = await apiUtils.getPaymentInit(params.statusId);
        setPaymentData(data);
        setError('');
      } catch (err: any) {
        if (err.status === 404) {
          setError('Payment information not found.');
        } else if (err.status === 400) {
          setError('Payment is not required or already completed.');
        } else {
          setError('Unable to load payment options. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentData();
  }, [params.statusId]);

  const handleFiatPayment = () => {
    if (!selectedPlatform || !paymentData) {
      setError('Please select a payment platform.');
      return;
    }

    try {
      const message = selectedPlatform.messageTemplate
        .replace('{statusId}', String(paymentData.shippingStage.id))
        .replace('{amount}', String(paymentData.shippingStage.feeInDollars));

      const redirectUrl = `${selectedPlatform.baseUrl}?text=${encodeURIComponent(message)}`;
      window.location.href = redirectUrl;
    } catch (err) {
      setError('Unable to redirect to payment. Try again.');
    }
  };

  if (loading) return <Loading />;
  if (error) return <div className="text-red-500 p-4">{error}</div>;
  if (!paymentData) return null;

  if (!showPaymentModal) {
    return <div className="text-center p-4">Payment window closed</div>;
  }

  return (
  <>
    {/* <PaymentModal
      statusId={params.statusId}
      onClose={() => setShowPaymentModal(false)}
      onSuccess={() => {
        alert('Payment initiated successfully');
        setShowPaymentModal(false);
      }}
      feeInDollars={paymentData?.shippingStage.feeInDollars || 0}
      cryptoWallets={paymentData?.cryptoWallets || []}
      fiatPlatforms={paymentData?.fiatPlatforms || []}
    />

    <h1 className="text-2xl font-bold mb-4">Payment Required</h1>
    <div className="mb-6">
      <h2 className="text-xl">{paymentData.shippingStage.title}</h2>
      <p className="text-lg">Amount: ${paymentData.shippingStage.feeInDollars}</p>
    </div>

      <div className="space-y-4">
        <div>
          <label className="block font-medium mb-2">Select Payment Method</label>
          <div className="space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                value="crypto"
                checked={paymentMethod === 'crypto'}
                onChange={(e) => setPaymentMethod('crypto')}
                className="mr-2"
              />
              Cryptocurrency
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                value="fiat"
                checked={paymentMethod === 'fiat'}
                onChange={(e) => setPaymentMethod('fiat')}
                className="mr-2"
              />
              Fiat Currency
            </label>
          </div>
        </div>

        {paymentMethod === 'crypto' && (
          <div>
            <label className="block font-medium mb-2">Select Cryptocurrency</label>
            <select
              value={selectedWallet?.id || ''}
              onChange={(e) => {
                const wallet = paymentData.cryptoWallets.find(w => w.id === Number(e.target.value));
                setSelectedWallet(wallet || null);
              }}
              className="w-full p-2 border rounded"
            >
              <option value="">Select a wallet</option>
              {paymentData.cryptoWallets.map(wallet => (
                <option key={wallet.id} value={wallet.id}>
                  {wallet.currency} {wallet.label ? `(${wallet.label})` : ''}
                </option>
              ))}
            </select>
            {selectedWallet && (
              <div className="mt-4 p-4 bg-gray-100 rounded">
                <p className="font-medium">Wallet Address:</p>
                <div className="flex items-center gap-2">
                  <p className="font-mono break-all flex-1">{selectedWallet.walletAddress}</p>
                  <button
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(selectedWallet.walletAddress);
                        const toast = document.createElement('div');
                        toast.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg transition-opacity duration-300';
                        toast.textContent = 'Address copied!';
                        document.body.appendChild(toast);
                        setTimeout(() => {
                          toast.style.opacity = '0';
                          setTimeout(() => toast.remove(), 300);
                        }, 2000);
                      } catch (err) {
                        alert('Failed to copy address. Please try again.');
                      }
                    }}
                    className="px-4 py-2 bg-white border rounded hover:bg-gray-50 active:bg-gray-100 transition-colors"
                  >
                    Copy Address
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {paymentMethod === 'fiat' && (
          <div>
            <label className="block font-medium mb-2">Select Payment Platform</label>
            <select
              value={selectedPlatform?.id || ''}
              onChange={(e) => {
                const platform = paymentData.fiatPlatforms.find(p => p.id === Number(e.target.value));
                setSelectedPlatform(platform || null);
              }}
              className="w-full p-2 border rounded"
            >
              <option value="">Select a platform</option>
              {paymentData.fiatPlatforms.map(platform => (
                <option key={platform.id} value={platform.id}>
                  {platform.name}
                </option>
              ))}
            </select>
            {selectedPlatform && (
              <button
                onClick={handleFiatPayment}
                className="mt-4 bg-primary-blue text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Pay Now
              </button>
            )}
          </div>
        )}
      </div> */}
    </>
  );
}