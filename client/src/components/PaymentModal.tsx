import { useState } from 'react';
import { ApiService } from '@/services/api.service';

interface PaymentModalProps {
  statusId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function PaymentModal({ statusId, onClose, onSuccess }: PaymentModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a receipt file');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      await ApiService.uploadPaymentReceipt(statusId, file);
      onSuccess();
    } catch (err: any) {
      if (err.message === 'Status not found') {
        setError('Status not found');
      } else if (err.message === 'Invalid receipt file') {
        setError('Please select a valid receipt file');
      } else {
        setError('Could not upload receipt. Please try again later.');
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h3 className="text-lg font-bold mb-4">Upload Payment Receipt</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full border p-2 rounded"
            />
          </div>
          {error && (
            <div className="text-red-500 mb-4">{error}</div>
          )}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 px-4 py-2 rounded"
              disabled={uploading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-primary-blue text-white px-4 py-2 rounded"
              disabled={uploading}
            >
              {uploading ? 'Uploading...' : 'Upload Receipt'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}