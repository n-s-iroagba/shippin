
'use client';

import { useState, useEffect } from 'react';
import { ApiService } from '@/services/api.service';
import FiatPlatformForm from '@/components/FiatPlatformForm';
import Loading from '@/components/Loading';
import { FiatPlatformAttributes } from '@/types/fiat-platform.types';

export default function FiatPlatformsPage() {
  const [platforms, setPlatforms] = useState<FiatPlatformAttributes[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<FiatPlatformAttributes | null>(null);
  const [successMessage, setSuccessMessage] = useState('');

  const fetchPlatforms = async () => {
    try {
      const data = await ApiService.listFiatPlatforms();
      setPlatforms(data);
      setError('');
    } catch (err) {
      setError('Unable to load fiat platforms. Please try again later.');
      console.error('Failed to fetch fiat platforms:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlatforms();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this platform?')) return;
    
    try {
      await ApiService.deleteFiatPlatform(id);
      setPlatforms(platforms.filter(p => p.id !== id));
      setSuccessMessage('Fiat platform deleted successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error:unknown) {
      const err = error as {status:number}
      if (err.status === 403) {
        setError('You do not have permission to delete this platform.');
      } else if (err.status === 404) {
        setError('Fiat platform not found.');
      } else if (err.status === 500) {
        setError('Could not delete fiat platform. Please try again later.');
      } else {
        setError('An unexpected error occurred. Please try again later.');
      }
      setTimeout(() => setError(''), 3000);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Fiat Platforms</h1>
        <button
          onClick={() => {
            setSelectedPlatform(null);
            setShowForm(true);
          }}
          className="bg-primary-blue text-white px-4 py-2 rounded"
        >
          Create Platform
        </button>
      </div>

      {error && <div className="text-red-500 mb-4">{error}</div>}
      {successMessage && <div className="text-green-500 mb-4">{successMessage}</div>}

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {selectedPlatform ? 'Edit Platform' : 'Create Platform'}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <FiatPlatformForm
              platform={selectedPlatform || undefined}
              onSuccess={() => {
                setShowForm(false);
                setSelectedPlatform(null);
                fetchPlatforms();
                setSuccessMessage(selectedPlatform ? 'Fiat platform updated successfully' : 'Fiat platform created successfully');
                setTimeout(() => setSuccessMessage(''), 3000);
              }}
              onClose={() => {
                setShowForm(false);
                setSelectedPlatform(null);
              }}
            />
          </div>
        </div>
      )}

      <div className="grid gap-4">
        {platforms.map((platform) => (
          <div key={platform.id} className="border p-4 rounded">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold">{platform.name}</h3>
                <p className="text-sm text-gray-600">{platform.baseUrl}</p>
                <p className="text-sm mt-2">{platform.messageTemplate}</p>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => {
                    setSelectedPlatform(platform);
                    setShowForm(true);
                  }}
                  className="text-primary-blue"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(platform.id)}
                  className="text-red-500"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
