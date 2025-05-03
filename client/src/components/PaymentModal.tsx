import React, { useState } from 'react';
import QRCode from 'qrcode.react';
import { convertUSDToCrypto } from '../utils/currencyUtils';

export const PaymentModal = ({ stage, onClose }) => {
  const [paymentMethod, setPaymentMethod] = useState<'crypto' | 'fiat' | null>(null);
  const [selectedCrypto, setSelectedCrypto] = useState('');
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [showProofUpload, setShowProofUpload] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateProofFile = (file: File) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      throw new Error('Invalid file type. Please upload an image or PDF.');
    }
    if (file.size > maxSize) {
      throw new Error('File too large. Maximum size is 5MB.');
    }
  };

  const handlePaymentSubmit = async () => {
    try {
      if (!proofFile) {
        alert('Please upload payment proof');
        return;
      }

      if (!paymentMethod) {
        alert('Please select a payment method');
        return;
      }

      if (paymentMethod === 'crypto' && !selectedCrypto) {
        alert('Please select a cryptocurrency');
        return;
      }

      // Validate file type and size
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
      if (!allowedTypes.includes(proofFile.type)) {
        alert('Invalid file type. Please upload an image or PDF.');
        return;
      }

      if (proofFile.size > 5 * 1024 * 1024) {
        alert('File too large. Maximum size is 5MB.');
        return;
      }

      validateProofFile(proofFile);

      // Additional validation
      if (paymentMethod === 'crypto' && !selectedCrypto) {
        throw new Error('Please select a cryptocurrency');
      }

      if (paymentMethod === 'fiat' && !stage.acceptedFiatOptions?.length) {
        throw new Error('No fiat payment options available');
      }

      setLoading(true);
      const formData = new FormData();
      formData.append('proof', proofFile);
      formData.append('stageId', stage.id);
      formData.append('paymentMethod', paymentMethod === 'crypto' ? selectedCrypto : 'fiat');
      formData.append('paymentAmount', stage.paymentAmount.toString());
      formData.append('fiatMethod', paymentMethod === 'fiat' ? stage.acceptedFiatOptions[0] : '');

      if (paymentMethod === 'crypto' && !selectedCrypto) {
        alert('Please select a cryptocurrency');
        return;
      }

      const response = await fetch(`/api/payments/submit-proof`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit payment');
      }

      alert('Payment submitted. Admin will verify.');
      onClose();
    } catch (error) {
      alert(`Failed to submit payment proof: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Payment Required</h2>
          <button onClick={onClose} className="text-gray-500">&times;</button>
        </div>
        <p className="mb-4">Amount: ${stage.paymentAmount}</p>
        <p className="mb-4 text-sm">Stage: {stage.status}</p>

        {!paymentMethod ? (
          <div className="space-y-4">
            <button 
              onClick={() => setPaymentMethod('crypto')}
              className="w-full p-2 bg-blue-500 text-white rounded"
            >
              Pay with Crypto
            </button>
            <button 
              onClick={() => setPaymentMethod('fiat')}
              className="w-full p-2 bg-green-500 text-white rounded"
            >
              Pay with Fiat
            </button>
          </div>
        ) : paymentMethod === 'crypto' ? (
          <div className="space-y-4">
            <select 
              value={selectedCrypto}
              onChange={(e) => setSelectedCrypto(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="">Select Cryptocurrency</option>
              <option value="BTC">Bitcoin</option>
              <option value="ETH">Ethereum</option>
            </select>

            {selectedCrypto && (
              <div className="text-center">
                <QRCode value={stage.walletAddress} size={200} />
                <p className="mt-2 font-mono text-sm break-all">
                  Wallet Address: {stage.walletAddress}
                  <button 
                    onClick={() => navigator.clipboard.writeText(stage.walletAddress)}
                    className="ml-2 text-blue-500 hover:text-blue-700"
                  >
                    Copy
                  </button>
                </p>
                <p className="mt-2 text-lg font-semibold">
                  Amount: {convertUSDToCrypto(stage.paymentAmount, selectedCrypto)} {selectedCrypto}
                  <span className="text-gray-500 text-sm ml-2">(${stage.paymentAmount} USD)</span>
                </p>
                <button
                  onClick={() => setShowProofUpload(true)}
                  className="mt-4 w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                >
                  Upload Payment Proof
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {stage.acceptedFiatOptions?.map(option => (
              <button 
                key={option}
                onClick={() => {
                  const message = `Hello, I would like to make a payment for shipment:\n\n` +
                    `Tracking #: ${stage.shipmentDetailsId}\n` +
                    `Stage: ${stage.status}\n` +
                    `Amount: $${stage.paymentAmount} USD\n` +
                    `Method: ${option}\n\n` +
                    `Please provide payment instructions.`;
                  // Open WhatsApp with pre-filled message
                  const whatsappLink = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
                  window.open(whatsappLink, '_blank');
                  setShowProofUpload(true);
                  alert(`Select "${option}" and follow the WhatsApp instructions. Upload your proof of payment here after completing the transfer.`);
                }}
                className="w-full p-2 bg-gray-200 rounded hover:bg-gray-300 mb-2"
              >
                Pay with {option}
              </button>
            ))}
            {showProofUpload && (
              <div className="mt-4 p-4 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-4">After making the payment, please upload your proof of payment below:</p>
                <input
                  type="file"
                  onChange={(e) => setProofFile(e.target.files?.[0] || null)}
                  className="w-full mb-2"
                  accept="image/*,.pdf"
                />
              </div>
            )}
          </div>

          )}

        {showProofUpload && (
          <div className="mt-4 p-4 border rounded">
            <h3 className="font-bold mb-2">Upload Payment Proof</h3>
            <input
              type="file"
              onChange={(e) => setProofFile(e.target.files?.[0] || null)}
              className="w-full mb-2"
              accept="image/*,.pdf"
            />
            <button
              onClick={handlePaymentSubmit}
              disabled={!proofFile || loading}
              className="w-full p-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
            >
              {loading ? 'Submitting...' : 'Submit Payment Proof'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};